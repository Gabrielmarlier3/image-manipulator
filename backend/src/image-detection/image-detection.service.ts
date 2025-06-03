// src/image-detection/image-detection.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';

export interface Detection {
  class: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
}

@Injectable()
export class ImageDetectionService {
  private readonly logger = new Logger(ImageDetectionService.name);

  private getDarknetCmd(): { bin: string; cwd: string } {
    // __dirname aponta para .../backend/dist/src/image-detection
    // suba duas pastas, entre em darknet e pegue o executável
    const projectRoot = path.resolve(__dirname, '..', '..', '..');
    const darknetDir = path.join(projectRoot, 'darknet');
    const binName = 'darknet';
    const binPath = path.join(darknetDir, binName);
    return { bin: binPath, cwd: darknetDir };
  }

  /**
   * Executa o Darknet YOLO em um frame de imagem e retorna as detecções.
   * @param imageBuffer Buffer da imagem (JPEG, PNG, etc.)
   */
  async detect(imageBuffer: Buffer): Promise<Detection[]> {
    const tmpFile = tmp.fileSync({ postfix: '.jpg' });
    fs.writeFileSync(tmpFile.name, imageBuffer);

    const { bin, cwd } = this.getDarknetCmd();
    const args = [
      'detector',
      'json',
      path.join(cwd, 'cfg', 'coco.data'),
      path.join(cwd, 'cfg', 'yolov3.cfg'),
      path.join(cwd, 'yolov3.weights'),
      tmpFile.name,
    ];

    return new Promise<Detection[]>((resolve, reject) => {
      const proc = spawn(bin, args, { cwd });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => (stdout += data.toString()));
      proc.stderr.on('data', (data) => (stderr += data.toString()));

      proc.on('close', (code) => {
        // limpa o temporário
        tmpFile.removeCallback();

        if (code !== 0) {
          this.logger.error(`Darknet retornou código ${code}: ${stderr}`);
          return reject(new Error(stderr || `Exit code ${code}`));
        }

        try {
          const detections: Detection[] = JSON.parse(stdout);
          resolve(detections);
        } catch (err) {
          this.logger.error(`Erro ao parsear JSON: ${err.message}`);
          reject(err);
        }
      });
    });
  }
}

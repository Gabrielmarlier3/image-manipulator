// src/image-noise/image-noise.service.ts
import {BadRequestException, Injectable} from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageNoiseService {
  /**
   * Adiciona ruído (noise) a uma imagem usando Sharp.
   * @param buffer Buffer da imagem original
   * @param amount Percentual de ruído (0–100)
   */
  async addNoise(buffer: Buffer, amount = 20): Promise<Buffer> {
    if (amount < 0 || amount > 100) {
      throw new BadRequestException('O parâmetro amount deve estar entre 0 e 100');
    }

    // Carrega a imagem e obtém dimensões
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    if (!width || !height) {
      throw new BadRequestException('Não foi possível obter dimensões da imagem');
    }

    // Gera buffer de ruído RGBA
    const alpha = Math.round((amount / 100) * 255);
    const noiseBuffer = Buffer.alloc(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      const v = Math.floor(Math.random() * 256);
      const idx = i * 4;
      noiseBuffer[idx] = v;
      noiseBuffer[idx + 1] = v;
      noiseBuffer[idx + 2] = v;
      noiseBuffer[idx + 3] = alpha;
    }

    // Compoe o ruído sobre a imagem original
    return await image
      .composite([
        {
          input: noiseBuffer,
          raw: {width, height, channels: 4},
        },
      ])
      .toBuffer();
  }
}

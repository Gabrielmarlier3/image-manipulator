import { Injectable, BadRequestException } from '@nestjs/common';
// default import requer esModuleInterop
import sharp from 'sharp';

@Injectable()
export class ImageUpscaleService {
  async upscale(imageBuffer: Buffer, scale = 2): Promise<Buffer> {
    if (scale <= 0) {
      throw new BadRequestException('Scale deve ser maior que zero');
    }

    // metadata() existe no default import
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new BadRequestException(
        'Não foi possível obter dimensões da imagem',
      );
    }

    const newWidth = metadata.width * scale;
    const newHeight = metadata.height * scale;

    // resize e toBuffer do default import
    return sharp(imageBuffer).resize(newWidth, newHeight).toBuffer();
  }
}

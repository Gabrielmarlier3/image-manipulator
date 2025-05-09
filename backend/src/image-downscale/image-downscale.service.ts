import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageDownscaleService {
  /**
   * Faz downscale de uma imagem por um fator (0<scale<=1).
   * @param buffer Buffer da imagem original
   * @param scale Fator de escala (por exemplo, 0.5 para metade do tamanho)
   */
  async downscale(buffer: Buffer, scale = 0.5): Promise<Buffer> {
    if (scale <= 0 || scale > 1) {
      throw new BadRequestException(
        'Parâmetro scale deve estar entre 0 (exclusive) e 1 (inclusive)',
      );
    }

    const image = sharp(buffer);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    if (!width || !height) {
      throw new BadRequestException(
        'Não foi possível obter dimensões da imagem',
      );
    }

    const newWidth = Math.floor(width * scale);
    const newHeight = Math.floor(height * scale);

    return image.resize(newWidth, newHeight).toBuffer();
  }
}

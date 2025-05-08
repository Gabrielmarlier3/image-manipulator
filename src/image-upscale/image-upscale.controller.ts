import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUpscaleService } from './image-upscale.service';

@Controller('image-upscale')
export class ImageUpscaleController {
  constructor(private readonly upscaleService: ImageUpscaleService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndUpscale(
    @UploadedFile() file: Express.Multer.File,
    @Query('scale') scale?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const factor = scale ? parseInt(scale, 10) : 2;
    if (isNaN(factor) || factor < 1) {
      throw new BadRequestException('Parâmetro scale inválido');
    }

    const upscaledBuffer = await this.upscaleService.upscale(
      file.buffer,
      factor,
    );

    // Retorna a imagem em formato octet-stream
    return Buffer.from(upscaledBuffer);
  }
}

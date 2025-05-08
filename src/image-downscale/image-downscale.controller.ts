import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageDownscaleService } from './image-downscale.service';

@Controller('image-downscale')
export class ImageDownscaleController {
  constructor(private readonly downscaleService: ImageDownscaleService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Header('Content-Type', 'application/octet-stream')
  async uploadAndDownscale(
    @UploadedFile() file: Express.Multer.File,
    @Query('scale') scaleStr?: string,
  ): Promise<Buffer> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const scale = scaleStr ? parseFloat(scaleStr) : 0.5;
    if (isNaN(scale)) {
      throw new BadRequestException('Parâmetro scale inválido');
    }

    const output = await this.downscaleService.downscale(
      file.buffer,
      scale,
    );
    return output;
  }
}
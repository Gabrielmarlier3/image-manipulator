// src/image-downscale/image-downscale.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Res, Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageDownscaleService } from './image-downscale.service';

@Controller('image-downscale')
export class ImageDownscaleController {
  private readonly logger = new Logger(ImageDownscaleController.name);

  constructor(private readonly downscaleService: ImageDownscaleService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndDownscale(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Query('scale') scaleStr?: string,
  ) {
    this.logger.log('DownScaling the image...');
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const scale = scaleStr ? parseFloat(scaleStr) : 0.5;
    if (isNaN(scale) || scale <= 0 || scale > 1) {
      throw new BadRequestException('Parâmetro scale inválido (0 < scale ≤ 1)');
    }

    const outputBuffer = await this.downscaleService.downscale(
      file.buffer,
      scale,
    );

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', outputBuffer.length.toString());
    return res.send(outputBuffer);
  }
}

// src/image-upscale/image-upscale.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Logger,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageUpscaleService } from './image-upscale.service';

@Controller('image-upscale')
export class ImageUpscaleController {
  private readonly logger = new Logger(ImageUpscaleController.name);

  constructor(private readonly upscaleService: ImageUpscaleService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndUpscale(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Query('scale') scaleStr?: string,

  ) {
    this.logger.log('Upscaling the image...');
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const factor = scaleStr ? parseInt(scaleStr, 10) : 2;
    if (isNaN(factor) || factor < 1) {
      throw new BadRequestException('Parâmetro scale inválido (≥ 1)');
    }

    const outputBuffer = await this.upscaleService.upscale(
      file.buffer,
      factor,
    );

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', outputBuffer.length.toString());
    return res.send(outputBuffer);
  }
}

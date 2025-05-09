// src/image-noise/image-noise.controller.ts
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
import { ImageNoiseService } from './image-noise.service';

@Controller('image-noise')
export class ImageNoiseController {
  private readonly logger = new Logger(ImageNoiseController.name);

  constructor(private readonly noiseService: ImageNoiseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndAddNoise(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Query('amount') amountStr?: string,
  ) {
    this.logger.log('Adding noise to image...');
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const amount = amountStr ? parseInt(amountStr, 10) : 20;
    if (isNaN(amount) || amount < 0 || amount > 100) {
      throw new BadRequestException('Parâmetro amount inválido (0–100)');
    }

    const outputBuffer = await this.noiseService.addNoise(
      file.buffer,
      amount,
    );

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', outputBuffer.length.toString());
    return res.send(outputBuffer);
  }
}

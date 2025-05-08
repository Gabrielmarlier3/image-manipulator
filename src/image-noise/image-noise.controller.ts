// src/image-noise/image-noise.controller.ts
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
import { ImageNoiseService } from './image-noise.service';

@Controller('image-noise')
export class ImageNoiseController {
  constructor(private readonly noiseService: ImageNoiseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndAddNoise(
    @UploadedFile() file: Express.Multer.File,
    @Query('amount') amountStr?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const amount = amountStr ? parseInt(amountStr, 10) : 20;
    if (isNaN(amount) || amount < 0 || amount > 100) {
      throw new BadRequestException('Parâmetro amount inválido (0–100)');
    }

    const output = await this.noiseService.addNoise(file.buffer, amount);

    // Ajusta o content-type de saída conforme o arquivo original
    return {
      data: output,
      mime: file.mimetype,
    };
  }
}

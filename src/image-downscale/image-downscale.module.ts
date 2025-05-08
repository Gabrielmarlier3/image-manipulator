// src/image-downscale/image-downscale.module.ts
import { Module } from '@nestjs/common';
import { ImageDownscaleController } from './image-downscale.controller';
import { ImageDownscaleService } from './image-downscale.service';

@Module({
  controllers: [ImageDownscaleController],
  providers: [ImageDownscaleService],
})
export class ImageDownscaleModule {}
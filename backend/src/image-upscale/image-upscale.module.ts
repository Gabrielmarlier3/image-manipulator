import { Module } from '@nestjs/common';
import { ImageUpscaleController } from './image-upscale.controller';
import { ImageUpscaleService } from './image-upscale.service';

@Module({
  controllers: [ImageUpscaleController],
  providers: [ImageUpscaleService],
})
export class ImageUpscaleModule {}

import { Module } from '@nestjs/common';
import { ImageNoiseController } from './image-noise.controller';
import { ImageNoiseService } from './image-noise.service';

@Module({
  controllers: [ImageNoiseController],
  providers: [ImageNoiseService],
})
export class ImageNoiseModule {}

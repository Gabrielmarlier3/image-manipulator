import { Module } from '@nestjs/common';
import { ImageDetectionService } from './image-detection.service';
import { ImageDetectionGateway } from './image-detection.gateway';

@Module({
  providers: [ImageDetectionService, ImageDetectionGateway]
})
export class ImageDetectionModule {}

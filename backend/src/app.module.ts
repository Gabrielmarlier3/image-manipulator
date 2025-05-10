import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageUpscaleModule } from './image-upscale/image-upscale.module';
import { ImageNoiseModule } from './image-noise/image-noise.module';
import { ImageDownscaleModule } from './image-downscale/image-downscale.module';
import { ImageDetectionModule } from './image-detection/image-detection.module';

@Module({
  imports: [ImageUpscaleModule, ImageNoiseModule, ImageDownscaleModule, ImageDetectionModule],
  providers: [AppService],
})
export class AppModule {}

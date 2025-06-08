import { Module } from '@nestjs/common';
import { VideoManipulationController } from './video-manipulator.controller';
import { VideoManipulationService } from './video-manipulator.service';

@Module({
  controllers: [VideoManipulationController],
  providers: [VideoManipulationService],
})
export class VideoManipulationModule {}

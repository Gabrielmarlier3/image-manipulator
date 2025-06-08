import { Module } from '@nestjs/common';
import { AudioProcessingService } from './audio-processing.service';
import { AudioProcessingController } from './audio-processing.controller';

@Module({
  controllers: [AudioProcessingController],
  providers: [AudioProcessingService],
})
export class AudioProcessingModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { AudioProcessingService } from './audio-processing.service';

describe('AudioProcessingService', () => {
  let service: AudioProcessingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioProcessingService],
    }).compile();

    service = module.get<AudioProcessingService>(AudioProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

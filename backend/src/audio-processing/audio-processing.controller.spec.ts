import { Test, TestingModule } from '@nestjs/testing';
import { AudioProcessingController } from './audio-processing.controller';

describe('AudioProcessingController', () => {
  let controller: AudioProcessingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioProcessingController],
    }).compile();

    controller = module.get<AudioProcessingController>(AudioProcessingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

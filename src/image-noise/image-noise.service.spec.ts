// src/image-noise/image-noise.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ImageNoiseService } from './image-noise.service';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { BadRequestException } from '@nestjs/common';

describe('ImageNoiseService', () => {
  let service: ImageNoiseService;
  let originalBuffer: Buffer;

  beforeAll(() => {
    originalBuffer = fs.readFileSync(
      path.join(__dirname, '../../test/assets/small.jpg'),
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageNoiseService],
    }).compile();

    service = module.get<ImageNoiseService>(ImageNoiseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should preserve dimensions after adding noise', async () => {
    const result = await service.addNoise(originalBuffer, 20);
    const origMeta = await sharp(originalBuffer).metadata();
    const newMeta = await sharp(result).metadata();

    expect(newMeta.width).toBe(origMeta.width);
    expect(newMeta.height).toBe(origMeta.height);
  });

  it('should change buffer content after adding noise', async () => {
    const result = await service.addNoise(originalBuffer, 20);
    expect(result.equals(originalBuffer)).toBe(false);
  });

  it('should throw BadRequestException for amount < 0', async () => {
    await expect(service.addNoise(originalBuffer, -1)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for amount > 100', async () => {
    await expect(service.addNoise(originalBuffer, 101)).rejects.toThrow(
      BadRequestException,
    );
  });
});

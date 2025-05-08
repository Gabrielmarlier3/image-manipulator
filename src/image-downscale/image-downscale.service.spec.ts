import { Test, TestingModule } from '@nestjs/testing';
import { ImageDownscaleService } from './image-downscale.service';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { BadRequestException } from '@nestjs/common';

describe('ImageDownscaleService', () => {
  let service: ImageDownscaleService;
  let originalBuffer: Buffer;

  beforeAll(() => {
    originalBuffer = fs.readFileSync(
      path.join(__dirname, '../../test/assets/small.jpg'),
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageDownscaleService],
    }).compile();

    service = module.get<ImageDownscaleService>(ImageDownscaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reduce dimensions according to scale', async () => {
    const scale = 0.3;
    const result = await service.downscale(originalBuffer, scale);
    const origMeta = await sharp(originalBuffer).metadata();
    const newMeta = await sharp(result).metadata();

    // @ts-ignore
    expect(newMeta.width).toBe(Math.floor(origMeta.width * scale));
    // @ts-ignore
    expect(newMeta.height).toBe(Math.floor(origMeta.height * scale));
  });

  it('should throw BadRequestException for scale <= 0', async () => {
    await expect(service.downscale(originalBuffer, 0)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for scale > 1', async () => {
    await expect(service.downscale(originalBuffer, 1.5)).rejects.toThrow(
      BadRequestException,
    );
  });
});
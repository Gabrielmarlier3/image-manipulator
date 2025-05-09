import { Test, TestingModule } from '@nestjs/testing';
import { ImageUpscaleService } from './image-upscale.service';
import * as fs from 'fs';
import sharp from 'sharp';
import * as path from 'node:path';

describe('ImageUpscaleService', () => {
  let service: ImageUpscaleService;
  let originalBuffer: Buffer;

  beforeAll(() => {
    // Carregue aqui uma imagem pequena de teste:
    // crie a pasta test/assets e coloque small.jpg dentro
    originalBuffer = fs.readFileSync(
      path.join(__dirname, '../../test/assets/small.jpg'),
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageUpscaleService],
    }).compile();

    service = module.get<ImageUpscaleService>(ImageUpscaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve aumentar as dimensões da imagem pelo fator', async () => {
    const scale = 3;
    const result = await service.upscale(originalBuffer, scale);

    const origMeta = await sharp(originalBuffer).metadata();
    const newMeta = await sharp(result).metadata();

    // @ts-ignore
    expect(newMeta.width).toBe(origMeta.width * scale);
    // @ts-ignore
    expect(newMeta.height).toBe(origMeta.height * scale);
  });

  it('lança BadRequestException para scale inválido', async () => {
    await expect(service.upscale(originalBuffer, 0)).rejects.toThrow();
  });
});

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AudioProcessingService } from './audio-processing.service';

@Controller('audio-process')
export class AudioProcessingController {
  private readonly logger = new Logger(AudioProcessingController.name);

  constructor(private readonly svc: AudioProcessingService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async process(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Query('speed') speedStr?: string,
    @Query('echoInGain') inGainStr?: string,
    @Query('echoOutGain') outGainStr?: string,
    @Query('echoDelays') delaysStr?: string,
    @Query('echoDecays') decaysStr?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Envie o arquivo de áudio no campo "file".');
    }

    const speed = speedStr ? parseFloat(speedStr) : 1.0;
    const echoOpts = {
      inGain: inGainStr ? parseFloat(inGainStr) : 0.8,
      outGain: outGainStr ? parseFloat(outGainStr) : 0.9,
      delays: delaysStr ? parseInt(delaysStr, 10) : 100,
      decays: decaysStr ? parseFloat(decaysStr) : 0.3,
    };

    this.logger.log('Processando áudio: ' + file.originalname);

    const output = await this.svc.modify(file.buffer, speed, echoOpts);

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', output.length.toString());
    return res.send(output);
  }
}

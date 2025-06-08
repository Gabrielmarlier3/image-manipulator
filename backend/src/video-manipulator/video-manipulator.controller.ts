import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  Logger,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { VideoManipulationService } from './video-manipulator.service'
import * as fs from 'fs'

@Controller('video-manipulate')
export class VideoManipulationController {
  private readonly logger = new Logger(VideoManipulationController.name)

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async process(
    @UploadedFile() file: Express.Multer.File,
    @Query('width') width = '1280',
    @Query('height') height = '720',
    @Query('grayscale') grayscale = 'true',
    @Res() res: Response,
    @Query('watermark') watermark?: string,
  ) {
    this.logger.log(
      `Modificando vídeo ${file.originalname} → ${width}x${height}, grayscale=${grayscale}, watermark=${watermark}`,
    )
    const outPath = await this.svc.modifyToFile(
      file.buffer,
      +width,
      +height,
      grayscale === 'true',
      watermark,
    )
    res.setHeader('Content-Type', 'video/mp4')
    // opcional: força download
    // res.setHeader('Content-Disposition', 'attachment; filename="output.mp4"')
    const stream = fs.createReadStream(outPath)
    stream.pipe(res)
    stream.on('end', () => {
      fs.unlinkSync(outPath)
    })
  }

  constructor(private readonly svc: VideoManipulationService) {}
}

// src/video-manipulator/video-manipulator.service.ts
import { Injectable, Logger } from '@nestjs/common'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import * as tmp from 'tmp'
import * as fs from 'fs'
import * as os from 'os'

@Injectable()
export class VideoManipulationService {
  private readonly logger = new Logger(VideoManipulationService.name)

  constructor() {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
  }

  /** Upscale + (opcional) grayscale + watermark */
  async modifyToFile(
    input: Buffer,
    width = 1280,
    height = 720,
    toGrayscale = true,
    watermarkText?: string,
  ): Promise<string> {

    /* width/height precisam ser pares para yuv420p */
    width  = width  % 2 ? width  - 1 : width
    height = height % 2 ? height - 1 : height

    const inFile  = tmp.fileSync({ postfix: '.mp4' })
    const outFile = tmp.fileSync({ postfix: '.mp4' })
    fs.writeFileSync(inFile.name, input)

    /* ---------- filtros ---------- */
    const filters: string[] = [`scale=${width}:${height}`]
    if (toGrayscale) filters.push('hue=s=0')

    if (watermarkText) {
      const fontPath =
        os.platform() === 'win32'
          ? 'C\\:/Windows/Fonts/arial.ttf'
          : '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

      const drawText = [
        `fontfile='${fontPath}'`,
        `text='${watermarkText.replace(/:/g,'\\:').replace(/'/g,"\\'")}'`,
        `x=(w-text_w)/2`,
        `y=(h-text_h)/2`,
        `fontsize=100`,
        `fontcolor=white@0.8`,
        `box=1`, `boxcolor=black@0.5`, `boxborderw=10`,
      ].join(':')

      filters.push(`drawtext=${drawText}`)
    }

    /* ---------- ffmpeg ---------- */
    return new Promise<string>((resolve, reject) => {
      ffmpeg(inFile.name)
        .videoCodec('libx264')
        .audioCodec('copy')
        .outputOptions([
          '-b:v 60M',          // 60 Mbps CBR  → arquivo grande
          '-maxrate 60M',
          '-bufsize 120M',
          '-preset slow',      // compressão mais eficiente
          '-pix_fmt yuv420p',  // compatível com players/web
          '-movflags +faststart'
        ])
        .videoFilters(filters)
        .on('error', (err) => {
          this.logger.error(`FFmpeg error: ${err.message}`)
          inFile.removeCallback()
          outFile.removeCallback()
          reject(err)
        })
        .on('end', () => {
          inFile.removeCallback()
          resolve(outFile.name)
        })
        .save(outFile.name)
    })
  }
}

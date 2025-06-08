// src/audio-processing/audio-processing.service.ts
import { Injectable, Logger } from '@nestjs/common'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import * as tmp from 'tmp'
import * as fs from 'fs'

@Injectable()
export class AudioProcessingService {
  private readonly logger = new Logger(AudioProcessingService.name)

  constructor() {
    // aponta o executável do FFmpeg
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
  }

  /**
   * Modifica o áudio: altera velocidade e adiciona eco.
   * @param inputBuffer Buffer de áudio (mp3, wav, webm, etc.)
   * @param speed Fator de velocidade (ex: 1.5 = 50% mais rápido)
   * @param echoOpts Parâmetros do filtro aecho
   */
  async modify(
    inputBuffer: Buffer,
    speed = 1.0,
    echoOpts: {
      inGain: number
      outGain: number
      delays: number
      decays: number
    } = { inGain: 0.8, outGain: 0.9, delays: 100, decays: 0.3 },
  ): Promise<Buffer> {
    // cria arquivos temporários
    const tmpIn = tmp.fileSync({ postfix: '.wav' })
    const tmpOut = tmp.fileSync({ postfix: '.wav' })
    fs.writeFileSync(tmpIn.name, inputBuffer)

    return new Promise<Buffer>((resolve, reject) => {
      // aqui 'ffmpeg' é uma função
      ffmpeg(tmpIn.name)
        // 1) altera a velocidade/tempo sem mudar pitch
        .audioFilter('volume=2.0')        // aumenta o volume
        .audioFilter(`atempo=${speed}`)
        // 2) adiciona eco
        .audioFilter(
          `aecho=${echoOpts.inGain}:${echoOpts.outGain}:${echoOpts.delays}:${echoOpts.decays}`,
        )
        .format('wav')
        .on('error', (err) => {
          this.logger.error(`FFmpeg error: ${err.message}`)
          tmpIn.removeCallback()
          tmpOut.removeCallback()
          reject(err)
        })
        .on('end', () => {
          const output = fs.readFileSync(tmpOut.name)
          tmpIn.removeCallback()
          tmpOut.removeCallback()
          resolve(output)
        })
        .save(tmpOut.name)
    })
  }
}

"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface AudioVisualizerProps {
  audioUrl: string
}

export function AudioVisualizer({ audioUrl }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // refs para Web Audio
  const ctxRef = useRef<AudioContext>(undefined)
  const analyserRef = useRef<AnalyserNode>(undefined)
  const rafRef = useRef<number>(0)

  // 1️⃣ monta o analisador só uma vez
  useEffect(() => {
    console.log("[Visualizer] useEffect mount")
    console.log("[Visualizer] audioUrl initial:", audioUrl)

    const canvas = canvasRef.current
    const audioEl = audioRef.current
    console.log("[Visualizer] refs:", { canvas, audioEl })
    if (!canvas || !audioEl) return

    const ctx2d = canvas.getContext("2d")
    console.log("[Visualizer] 2d context:", ctx2d)
    if (!ctx2d) return

    if (!ctxRef.current) {
      console.log("[Visualizer] Criando AudioContext e Analyser")
      const audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)()
      const analyser = audioCtx.createAnalyser()
      const source = audioCtx.createMediaElementSource(audioEl)

      source.connect(analyser)
      analyser.connect(audioCtx.destination)

      analyser.fftSize = 256
      ctxRef.current = audioCtx
      analyserRef.current = analyser
      console.log("[Visualizer] AudioContext criado:", audioCtx)
    } else {
      console.log("[Visualizer] Reaproveitando AudioContext")
    }

    const analyser = analyserRef.current!
    console.log("[Visualizer] analyser FFT size:", analyser.fftSize)
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    console.log("[Visualizer] bufferLength, dataArray:", bufferLength, dataArray)

    const draw = () => {
      analyser.getByteFrequencyData(dataArray)
      ctx2d.fillStyle = "#fff"
      ctx2d.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height
        ctx2d.fillStyle = `rgb(${barHeight + 100},50,50)`
        ctx2d.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        x += barWidth + 1
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    const start = () => {
      console.log("[Visualizer] play event received, starting visualization")
      ctxRef.current!.resume().then(() => {
        console.log("[Visualizer] AudioContext resumed")
        draw()
      })
    }
    const stop = () => {
      console.log("[Visualizer] pause/ended event received, stopping visualization")
      cancelAnimationFrame(rafRef.current)
    }

    audioEl.addEventListener("play", start)
    audioEl.addEventListener("pause", stop)
    audioEl.addEventListener("ended", stop)
    console.log("[Visualizer] Listeners registered")

    return () => {
      console.log("[Visualizer] cleanup")
      audioEl.removeEventListener("play", start)
      audioEl.removeEventListener("pause", stop)
      audioEl.removeEventListener("ended", stop)
      stop()
      // mantemos o AudioContext vivo
    }
  }, [])

  // 2️⃣ atualiza src sempre que mudar audioUrl
  useEffect(() => {
    console.log("[Visualizer] useEffect audioUrl change:", audioUrl)
    const audioEl = audioRef.current
    if (audioEl) {
      audioEl.src = audioUrl
      console.log("[Visualizer] audio.src set to", audioEl.src)
      audioEl.load()
      console.log("[Visualizer] audio.load() called")
    }
  }, [audioUrl])

  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Visualizador de Áudio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <audio
                ref={audioRef}
                controls
                className="w-full mb-4"
                onError={(e) => console.error("[Visualizer] audio error", e)}
            />
            <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full border border-gray-200 rounded-md bg-white"
            />
            <p className="text-sm text-gray-500 text-center">
              Reproduza o áudio acima para ver a visualização em tempo real
            </p>
          </div>
        </CardContent>
      </Card>
  )
}

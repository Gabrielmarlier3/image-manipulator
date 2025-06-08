"use client"

import { useState, useRef } from "react"
import { Mic, Square, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedBlob, setRecordedBlob]   = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef         = useRef<HTMLAudioElement | null>(null)
  const timerRef         = useRef<NodeJS.Timeout | null>(null)
  const chunksRef        = useRef<BlobPart[]>([])

  /* ---------- START ---------- */
  const startRecording = async () => {
    console.log("[Recorder] requesting microphone access...")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("[Recorder] microphone granted")

      const mr = new MediaRecorder(stream)        // mime padrão: audio/webm;codecs=opus
      mediaRecorderRef.current = mr
      chunksRef.current = []

      mr.ondataavailable = (e) => {
        console.log("[Recorder] dataavailable:", e.data.size)
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = () => {
        console.log("[Recorder] stop, chunks:", chunksRef.current.length)
        const blob = new Blob(chunksRef.current, { type: mr.mimeType })
        console.log("[Recorder] blob size:", blob.size)
        setRecordedBlob(blob)
        onRecordingComplete(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      mr.start(250)                               // ← recebe chunk a cada 250 ms
      console.log("[Recorder] recording…")

      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
    } catch (err) {
      console.error("Erro ao acessar microfone:", err)
    }
  }

  /* ---------- STOP ---------- */
  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return
    console.log("[Recorder] stopRecording() called")
    mediaRecorderRef.current.stop()
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  /* ---------- PLAY / PAUSE ---------- */
  const playRecording = () => {
    if (!recordedBlob || isPlaying) return
    const url = URL.createObjectURL(recordedBlob)
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => setIsPlaying(false)
    audio.play()
    setIsPlaying(true)
  }
  const pauseRecording = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const fmt = (s: number) =>
      `${String((s / 60) | 0).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="mr-2 h-5 w-5" /> Gravador de Áudio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-mono mb-4">{fmt(recordingTime)}</div>

            {!isRecording ? (
                <Button onClick={startRecording} className="flex gap-2">
                  <Mic className="h-4 w-4" /> Iniciar
                </Button>
            ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex gap-2">
                  <Square className="h-4 w-4" /> Parar
                </Button>
            )}
          </div>

          {recordedBlob && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Gravação pronta</p>
                {!isPlaying ? (
                    <Button onClick={playRecording} variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" /> Reproduzir
                    </Button>
                ) : (
                    <Button onClick={pauseRecording} variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-1" /> Pausar
                    </Button>
                )}
              </div>
          )}
        </CardContent>
      </Card>
  )
}

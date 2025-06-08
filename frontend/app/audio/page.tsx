"use client"

import { useState, useEffect } from "react"
import { AudioUpload } from "@/components/audio-upload"
import { AudioRecorder } from "@/components/audio-recorder"
import { AudioControls } from "@/components/audio-controls"
import { AudioPlayer } from "@/components/audio-player"
import { AudioVisualizer } from "@/components/audio-visualizer"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function AudioPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    speed: 1.0,
    echoInGain: 0.5,
    echoOutGain: 0.5,
    echoDelays: 200,
    echoDecays: 0.4,
  })
  const { toast } = useToast()

  // Log de debugging geral
  useEffect(() => {
    console.log("[Page] current audioFile:", audioFile)
    console.log("[Page] current audioUrl:", audioUrl)
    console.log("[Page] processedAudioUrl:", processedAudioUrl)
  }, [audioFile, audioUrl, processedAudioUrl])

  const handleFileChange = (file: File | null) => {
    console.log("[Page] handleFileChange received file:", file)
    if (!file) return
    setAudioFile(file)

    if (audioUrl) {
      console.log("[Page] revoking previous audioUrl", audioUrl)
      URL.revokeObjectURL(audioUrl)
    }
    const url = URL.createObjectURL(file)
    console.log("[Page] new audioUrl created:", url)
    setAudioUrl(url)
    setProcessedAudioUrl(null)
  }

  const handleRecordingComplete = (blob: Blob) => {
    console.log("[Page] handleRecordingComplete blob:", blob)
    const extension = blob.type.split("/")[1] || "webm"
    const file = new File([blob], `gravacao.${extension}`, { type: blob.type })
    console.log("[Page] new File from blob:", file)
    setAudioFile(file)

    if (audioUrl) {
      console.log("[Page] revoking previous audioUrl", audioUrl)
      URL.revokeObjectURL(audioUrl)
    }
    const url = URL.createObjectURL(blob)
    console.log("[Page] new recording audioUrl:", url)
    setAudioUrl(url)
    setProcessedAudioUrl(null)

    toast({
      title: "Gravação Concluída",
      description: "Áudio gravado com sucesso",
    })
  }

  const handleSettingsChange = (
      key: "speed" | "echoInGain" | "echoOutGain" | "echoDelays" | "echoDecays",
      value: number,
  ) => {
    console.log("[Page] handleSettingsChange:", key, value)
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const processAudio = async () => {
    console.log("[Page] processAudio start", { audioFile, settings })
    if (!audioFile) {
      toast({
        title: "Nenhum áudio selecionado",
        description: "Selecione ou grave um áudio primeiro",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const form = new FormData()
      form.append("file", audioFile)
      console.log("[Page] formData entries:", Array.from(form.entries()))

      const url = new URL("http://localhost:3001/audio-process")
      url.searchParams.set("speed", settings.speed.toString())
      url.searchParams.set("echoInGain", settings.echoInGain.toString())
      url.searchParams.set("echoOutGain", settings.echoOutGain.toString())
      url.searchParams.set("echoDelays", settings.echoDelays.toString())
      url.searchParams.set("echoDecays", settings.echoDecays.toString())
      console.log("[Page] fetch URL:", url.toString())

      const res = await fetch(url.toString(), {
        method: "POST",
        body: form,
      })
      console.log("[Page] fetch response:", res)

      if (!res.ok) {
        console.error("[Page] fetch error status", res.status)
        throw new Error(`Erro ${res.status}`)
      }

      const modAudio = await res.blob()
      console.log("[Page] received processed blob:", modAudio)

      if (processedAudioUrl) {
        console.log("[Page] revoking previous processedAudioUrl", processedAudioUrl)
        URL.revokeObjectURL(processedAudioUrl)
      }
      const processedUrl = URL.createObjectURL(modAudio)
      console.log("[Page] new processedAudioUrl:", processedUrl)
      setProcessedAudioUrl(processedUrl)

      toast({
        title: "Sucesso!",
        description: "Áudio processado com sucesso",
      })
    } catch (error) {
      console.error("[Page] processAudio error:", error)
      toast({
        title: "Falha no processamento",
        description: "Erro ao processar o áudio",
        variant: "destructive",
      })
    } finally {
      console.log("[Page] processAudio end")
      setIsProcessing(false)
    }
  }

  return (
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-6xl mx-auto py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Estúdio de Processamento de Áudio
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AudioUpload onFileChange={handleFileChange} />
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          </div>

          {audioUrl && (
              <div className="mb-6">
                <AudioVisualizer audioUrl={audioUrl} />
              </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AudioPlayer
                  originalAudio={audioUrl}
                  processedAudio={processedAudioUrl}
              />
            </div>
            <div>
              <AudioControls
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                  onProcess={processAudio}
                  isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
        <Toaster />
      </main>
  )
}

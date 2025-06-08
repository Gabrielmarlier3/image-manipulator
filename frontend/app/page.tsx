"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/image-upload"
import { ImageControls } from "@/components/image-controls"
import { ImageResults } from "@/components/image-results"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [images, setImages] = useState<{
    original: string | null
    upscaled: string | null
    downscaled: string | null
    noisy: string | null
  }>({
    original: null,
    upscaled: null,
    downscaled: null,
    noisy: null,
  })
  const [settings, setSettings] = useState({
    upscaleFactor: 2,
    downscaleFactor: 0.5,
    noiseAmount: 20,
  })
  const { toast } = useToast()

  const handleFileChange = (file: File | null) => {
    if (!file) return

    setFile(file)
    // Display original image
    const originalUrl = URL.createObjectURL(file)
    setImages({
      ...images,
      original: originalUrl,
    })
  }

  const handleSettingsChange = (key: "upscaleFactor" | "downscaleFactor" | "noiseAmount", value: number) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const processImage = async () => {
    if (!file) {
      toast({
        title: "Nenhuma imagem selecionada",
        description: "Por favor, selecione uma imagem primeiro",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Process all three operations in parallel
      const formData = new FormData()
      formData.append("file", file)

      const [upscaleRes, downscaleRes, noiseRes] = await Promise.all([
        fetch(`http://localhost:3001/image-upscale?scale=${settings.upscaleFactor}`, {
          method: "POST",
          body: formData,
        }),
        fetch(`http://localhost:3001/image-downscale?scale=${settings.downscaleFactor}`, {
          method: "POST",
          body: formData,
        }),
        fetch(`http://localhost:3001/image-noise?amount=${settings.noiseAmount}`, {
          method: "POST",
          body: formData,
        }),
      ])

      if (!upscaleRes.ok || !downscaleRes.ok || !noiseRes.ok) {
        throw new Error("Failed to process image")
      }

      const upscaleBlob = await upscaleRes.blob()
      const downscaleBlob = await downscaleRes.blob()
      const noiseBlob = await noiseRes.blob()

      setImages({
        ...images,
        upscaled: URL.createObjectURL(upscaleBlob),
        downscaled: URL.createObjectURL(downscaleBlob),
        noisy: URL.createObjectURL(noiseBlob),
      })

      toast({
        title: "Sucesso!",
        description: "Imagem processada com sucesso",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Falha no processamento",
        description: "Houve um erro ao processar sua imagem",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Estúdio de Processamento de Imagem</h1>

        <div className="max-w-4xl mx-auto">
          <ImageUpload onFileChange={handleFileChange} />

          <ImageControls
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onProcess={processImage}
            isProcessing={isProcessing}
          />

          <ImageResults images={images} isProcessing={isProcessing} />
        </div>
      </div>
      <Toaster />
    </main>
  )
}

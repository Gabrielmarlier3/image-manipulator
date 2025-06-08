// app/video/page.tsx
"use client";

import { useState } from "react";
import { VideoUpload } from "@/components/video-upload";
import { VideoControls } from "@/components/video-controls";
import { VideoPlayer } from "@/components/video-player";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function VideoPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    width: 1920,
    height: 1080,
    grayscale: false,
    watermark: "",
    quality: "1080p",
  });
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setProcessedVideoUrl(null);
  };

  const handleSettingsChange = (
      key: "width" | "height" | "grayscale" | "watermark" | "quality",
      value: number | boolean | string
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const processVideo = async () => {
    if (!videoFile) {
      toast({
        title: "Nenhum vídeo selecionado",
        description: "Por favor, selecione um vídeo primeiro",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    try {
      const form = new FormData();
      form.append("file", videoFile);
      const url = new URL("http://localhost:3001/video-manipulate");
      url.searchParams.set("width", settings.width.toString());
      url.searchParams.set("height", settings.height.toString());
      url.searchParams.set("grayscale", settings.grayscale.toString());
      if (settings.watermark.trim()) {
        url.searchParams.set("watermark", settings.watermark);
      }
      url.searchParams.set("quality", settings.quality as string);

      const res = await fetch(url.toString(), {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const blob = await res.blob();
      setProcessedVideoUrl(URL.createObjectURL(blob));
      toast({ title: "Sucesso!", description: "Vídeo processado com sucesso" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Falha no processamento",
        description: "Houve um erro ao processar seu vídeo",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-6xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Estúdio de Processamento de Vídeo
          </h1>

          <VideoUpload onFileChange={handleFileChange} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <VideoPlayer
                  originalVideo={videoUrl}
                  processedVideo={processedVideoUrl}
                  isProcessing={isProcessing}
              />
            </div>
            <VideoControls
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onProcess={processVideo}
                isProcessing={isProcessing}
            />
          </div>
        </div>
        <Toaster />
      </main>
  );
}

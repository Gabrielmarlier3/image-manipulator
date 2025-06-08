"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Video } from "lucide-react"

interface VideoPlayerProps {
  originalVideo: string | null
  processedVideo: string | null
  isProcessing: boolean
}

export function VideoPlayer({ originalVideo, processedVideo, isProcessing }: VideoPlayerProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resultados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoCard title="Vídeo Original" videoSrc={originalVideo} isLoading={false} />
        <VideoCard title="Vídeo Processado" videoSrc={processedVideo} isLoading={isProcessing} />
      </div>
    </div>
  )
}

interface VideoCardProps {
  title: string
  videoSrc: string | null
  isLoading: boolean
}

function VideoCard({ title, videoSrc, isLoading }: VideoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="w-full aspect-video rounded-md" />
            <div className="flex justify-center">
              <p className="text-sm text-gray-500">Processando vídeo...</p>
            </div>
          </div>
        ) : videoSrc ? (
          <video
            src={videoSrc}
            controls
            className="w-full h-auto object-contain border border-gray-200 rounded-md bg-gray-50"
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center border border-gray-200 rounded-md bg-gray-50">
            <div className="flex flex-col items-center text-gray-400">
              <Video className="h-12 w-12 mb-2" />
              <span className="text-sm">Nenhum vídeo</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

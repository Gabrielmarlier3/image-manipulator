"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageIcon } from "lucide-react"

interface ImageResultsProps {
  images: {
    original: string | null
    upscaled: string | null
    downscaled: string | null
    noisy: string | null
  }
  isProcessing: boolean
}

export function ImageResults({ images, isProcessing }: ImageResultsProps) {
  const hasOriginal = !!images.original

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resultado</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageCard title="Original" imageSrc={images.original} isLoading={false} />

        <ImageCard title="Upscaled" imageSrc={images.upscaled} isLoading={hasOriginal && isProcessing} />

        <ImageCard title="Downscaled" imageSrc={images.downscaled} isLoading={hasOriginal && isProcessing} />

        <ImageCard title="With Noise" imageSrc={images.noisy} isLoading={hasOriginal && isProcessing} />
      </div>
    </div>
  )
}

interface ImageCardProps {
  title: string
  imageSrc: string | null
  isLoading: boolean
}

function ImageCard({ title, imageSrc, isLoading }: ImageCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full aspect-video rounded-md" />
        ) : imageSrc ? (
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={`${title} image`}
            className="w-full h-auto object-contain border border-gray-200 rounded-md bg-gray-50"
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center border border-gray-200 rounded-md bg-gray-50">
            <div className="flex flex-col items-center text-gray-400">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">No image</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

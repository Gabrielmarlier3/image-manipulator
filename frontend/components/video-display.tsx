"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoDisplayProps {
  stream: MediaStream | null
  detections: any[]
  onFrameCapture: (frame: ArrayBuffer) => void
  isConnected: boolean
}

export function VideoDisplay({ stream, detections, onFrameCapture, isConnected }: VideoDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // Connect stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  // Frame capture loop
  useEffect(() => {
    if (!isConnected || !stream) {
      setIsCapturing(false)
      return
    }

    let animationFrameId: number
    const captureInterval = 1000 / 15 // 15 FPS capture rate
    let lastCaptureTime = 0

    const captureFrame = async (timestamp: number) => {
      if (!videoRef.current || !canvasRef.current) return

      // Only capture at specified interval
      if (timestamp - lastCaptureTime >= captureInterval) {
        lastCaptureTime = timestamp

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (!ctx) return

        // Set canvas size to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        try {
          // Convert canvas to blob
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob)
              },
              "image/jpeg",
              0.8,
            )
          })

          // Convert blob to ArrayBuffer and send
          const arrayBuffer = await blob.arrayBuffer()
          onFrameCapture(arrayBuffer)
        } catch (err) {
          console.error("Error capturing frame:", err)
          setError("Failed to capture video frame")
        }
      }

      // Continue the capture loop
      animationFrameId = requestAnimationFrame(captureFrame)
    }

    setIsCapturing(true)
    animationFrameId = requestAnimationFrame(captureFrame)

    return () => {
      cancelAnimationFrame(animationFrameId)
      setIsCapturing(false)
    }
  }, [isConnected, stream, onFrameCapture])

  // Draw detection boxes
  useEffect(() => {
    if (!canvasRef.current || !detections.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear previous drawings (the video frame is redrawn in the capture loop)
    // Draw bounding boxes
    detections.forEach((detection) => {
      const { box, class: className, confidence } = detection
      const { x, y, w, h } = box

      // Draw rectangle
      ctx.strokeStyle = "red"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, h)

      // Draw label background
      const label = `${className} ${Math.round(confidence * 100)}%`
      const textMetrics = ctx.measureText(label)
      const textHeight = 20
      ctx.fillStyle = "rgba(255, 0, 0, 0.7)"
      ctx.fillRect(x, y - textHeight, textMetrics.width + 10, textHeight)

      // Draw label text
      ctx.fillStyle = "white"
      ctx.font = "14px Arial"
      ctx.fillText(label, x + 5, y - 5)
    })
  }, [detections])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative aspect-video bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

          {!stream && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <p>No camera stream available</p>
            </div>
          )}

          {isConnected && isCapturing && (
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

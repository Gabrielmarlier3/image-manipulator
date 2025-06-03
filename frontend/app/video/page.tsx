"use client"

import { useState, useEffect } from "react"
import { CameraControls } from "@/components/camera-controls"
import { VideoDisplay } from "@/components/video-display"
import { DetectionSettings } from "@/components/detection-settings"
import { ConnectionStatus } from "@/components/connection-status"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useWebSocket } from "@/hooks/use-websocket"

export default function VideoPage() {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  const [cameraSettings, setCameraSettings] = useState({
    width: 640,
    height: 480,
    frameRate: 15,
  })
  const [detections, setDetections] = useState<any[]>([])
  const { toast } = useToast()

  const { isConnected, connect, disconnect, sendFrame, connectionError } = useWebSocket({
    url: "ws://localhost:3000",
    onDetections: (data) => setDetections(data),
    onError: (error) => {
      toast({
        title: "WebSocket Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Get available camera devices
  useEffect(() => {
    async function getDevices() {
      try {
        // Request permission first by getting any stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop())

        // Now get the list of devices
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")
        setDevices(videoDevices)

        // Select the first device by default
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId)
        }
      } catch (error) {
        console.error("Error accessing media devices:", error)
        toast({
          title: "Camera Error",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive",
        })
      }
    }

    getDevices()
  }, [])

  // Start/stop camera stream when device or settings change
  useEffect(() => {
    async function setupCamera() {
      // Stop any existing stream
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }

      if (!selectedDeviceId) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: cameraSettings.width },
            height: { ideal: cameraSettings.height },
            frameRate: { ideal: cameraSettings.frameRate },
          },
        })

        setVideoStream(stream)
      } catch (error) {
        console.error("Error starting camera:", error)
        toast({
          title: "Camera Error",
          description: "Failed to start camera with selected settings.",
          variant: "destructive",
        })
      }
    }

    setupCamera()

    // Cleanup function to stop stream when component unmounts
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [selectedDeviceId, cameraSettings])

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Video Object Detection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoDisplay
              stream={videoStream}
              detections={detections}
              onFrameCapture={sendFrame}
              isConnected={isConnected}
            />
          </div>

          <div className="space-y-6">
            <ConnectionStatus
              isConnected={isConnected}
              onConnect={connect}
              onDisconnect={disconnect}
              error={connectionError}
            />

            <CameraControls
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onDeviceChange={setSelectedDeviceId}
              settings={cameraSettings}
              onSettingsChange={setCameraSettings}
            />

            <DetectionSettings detections={detections} />
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Camera } from "lucide-react"

interface CameraControlsProps {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  onDeviceChange: (deviceId: string) => void
  settings: {
    width: number
    height: number
    frameRate: number
  }
  onSettingsChange: (settings: any) => void
}

export function CameraControls({
  devices,
  selectedDeviceId,
  onDeviceChange,
  settings,
  onSettingsChange,
}: CameraControlsProps) {
  const resolutionPresets = [
    { label: "320×240", width: 320, height: 240 },
    { label: "640×480", width: 640, height: 480 },
    { label: "1280×720", width: 1280, height: 720 },
    { label: "1920×1080", width: 1920, height: 1080 },
  ]

  const currentResolution =
    resolutionPresets.find((preset) => preset.width === settings.width && preset.height === settings.height)?.label ||
    "Custom"

  const handleResolutionChange = (value: string) => {
    const preset = resolutionPresets.find((preset) => preset.label === value)
    if (preset) {
      onSettingsChange({
        ...settings,
        width: preset.width,
        height: preset.height,
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          Camera Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="camera-select">Camera Source</Label>
          <Select value={selectedDeviceId} onValueChange={onDeviceChange}>
            <SelectTrigger id="camera-select">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${devices.indexOf(device) + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resolution-select">Resolution</Label>
          <Select value={currentResolution} onValueChange={handleResolutionChange}>
            <SelectTrigger id="resolution-select">
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              {resolutionPresets.map((preset) => (
                <SelectItem key={preset.label} value={preset.label}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="framerate">Frame Rate</Label>
            <span className="text-sm font-medium">{settings.frameRate} FPS</span>
          </div>
          <Slider
            id="framerate"
            min={1}
            max={30}
            step={1}
            value={[settings.frameRate]}
            onValueChange={(value) => onSettingsChange({ ...settings, frameRate: value[0] })}
          />
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ImageControlsProps {
  settings: {
    upscaleFactor: number
    downscaleFactor: number
    noiseAmount: number
  }
  onSettingsChange: (key: "upscaleFactor" | "downscaleFactor" | "noiseAmount", value: number) => void
  onProcess: () => void
  isProcessing: boolean
}

export function ImageControls({ settings, onSettingsChange, onProcess, isProcessing }: ImageControlsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Processing Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="upscale">Upscale Factor</Label>
              <span className="text-sm font-medium">{settings.upscaleFactor.toFixed(1)}x</span>
            </div>
            <Slider
              id="upscale"
              min={1}
              max={4}
              step={0.1}
              value={[settings.upscaleFactor]}
              onValueChange={(value) => onSettingsChange("upscaleFactor", value[0])}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Increase image size (factor ≥ 1)</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="downscale">Downscale Factor</Label>
              <span className="text-sm font-medium">{settings.downscaleFactor.toFixed(1)}x</span>
            </div>
            <Slider
              id="downscale"
              min={0.1}
              max={1}
              step={0.1}
              value={[settings.downscaleFactor]}
              onValueChange={(value) => onSettingsChange("downscaleFactor", value[0])}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Decrease image size (0 &lt; factor ≤ 1)</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="noise">Noise Amount</Label>
              <span className="text-sm font-medium">{settings.noiseAmount}%</span>
            </div>
            <Slider
              id="noise"
              min={0}
              max={100}
              step={1}
              value={[settings.noiseAmount]}
              onValueChange={(value) => onSettingsChange("noiseAmount", value[0])}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Add noise to the image (0-100%)</p>
          </div>

          <Button onClick={onProcess} disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Image"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

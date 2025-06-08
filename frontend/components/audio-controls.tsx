"use client"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Settings } from "lucide-react"

interface AudioControlsProps {
  settings: {
    speed: number
    echoInGain: number
    echoOutGain: number
    echoDelays: number
    echoDecays: number
  }
  onSettingsChange: (key: "speed" | "echoInGain" | "echoOutGain" | "echoDelays" | "echoDecays", value: number) => void
  onProcess: () => void
  isProcessing: boolean
}

export function AudioControls({ settings, onSettingsChange, onProcess, isProcessing }: AudioControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Controles de Processamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="speed">Velocidade</Label>
              <span className="text-sm font-medium">{settings.speed.toFixed(1)}x</span>
            </div>
            <Slider
              id="speed"
              min={0.5}
              max={2.0}
              step={0.1}
              value={[settings.speed]}
              onValueChange={(value) => onSettingsChange("speed", value[0])}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Ajustar velocidade de reprodução</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="echoInGain">Ganho de Entrada do Eco</Label>
              <span className="text-sm font-medium">{settings.echoInGain.toFixed(1)}</span>
            </div>
            <Slider
              id="echoInGain"
              min={0}
              max={1}
              step={0.1}
              value={[settings.echoInGain]}
              onValueChange={(value) => onSettingsChange("echoInGain", value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="echoOutGain">Ganho de Saída do Eco</Label>
              <span className="text-sm font-medium">{settings.echoOutGain.toFixed(1)}</span>
            </div>
            <Slider
              id="echoOutGain"
              min={0}
              max={1}
              step={0.1}
              value={[settings.echoOutGain]}
              onValueChange={(value) => onSettingsChange("echoOutGain", value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="echoDelays">Atraso do Eco (ms)</Label>
              <span className="text-sm font-medium">{settings.echoDelays} ms</span>
            </div>
            <Slider
              id="echoDelays"
              min={50}
              max={500}
              step={10}
              value={[settings.echoDelays]}
              onValueChange={(value) => onSettingsChange("echoDelays", value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="echoDecays">Decaimento do Eco</Label>
              <span className="text-sm font-medium">{settings.echoDecays.toFixed(1)}</span>
            </div>
            <Slider
              id="echoDecays"
              min={0.1}
              max={0.9}
              step={0.1}
              value={[settings.echoDecays]}
              onValueChange={(value) => onSettingsChange("echoDecays", value[0])}
              className="w-full"
            />
          </div>

          <Button onClick={onProcess} disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Processar Áudio"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

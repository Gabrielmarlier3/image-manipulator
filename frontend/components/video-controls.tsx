"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Settings } from "lucide-react"

interface VideoControlsProps {
  settings: {
    width: number
    height: number
    grayscale: boolean
    watermark: string
  }
  onSettingsChange: (key: "width" | "height" | "grayscale" | "watermark", value: number | boolean | string) => void
  onProcess: () => void
  isProcessing: boolean
}

export function VideoControls({ settings, onSettingsChange, onProcess, isProcessing }: VideoControlsProps) {
  const resolutionPresets = [
    { label: "480p (854×480)", width: 854, height: 480 },
    { label: "720p (1280×720)", width: 1280, height: 720 },
    { label: "1080p (1920×1080)", width: 1920, height: 1080 },
    { label: "1440p (2560×1440)", width: 2560, height: 1440 },
    { label: "4K (3840×2160)", width: 3840, height: 2160 },
  ]

  const currentResolution = (() => {
    const preset = resolutionPresets.find(
      (preset) => preset.width === settings.width && preset.height === settings.height,
    )
    return preset ? preset.label : `${settings.width}×${settings.height}`
  })()

  const handleResolutionChange = (value: string) => {
    const preset = resolutionPresets.find((preset) => preset.label === value)
    if (preset) {
      onSettingsChange("width", preset.width)
      onSettingsChange("height", preset.height)
    }
  }

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
            <Label htmlFor="resolution-select">Resolução</Label>
            <Select value={currentResolution} onValueChange={handleResolutionChange}>
              <SelectTrigger id="resolution-select">
                <SelectValue placeholder="Selecionar resolução" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Largura</Label>
              <Input
                id="width"
                type="number"
                value={settings.width}
                onChange={(e) => onSettingsChange("width", Number.parseInt(e.target.value) || 1920)}
                min={320}
                max={7680}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura</Label>
              <Input
                id="height"
                type="number"
                value={settings.height}
                onChange={(e) => onSettingsChange("height", Number.parseInt(e.target.value) || 1080)}
                min={240}
                max={4320}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="grayscale"
              checked={settings.grayscale}
              onCheckedChange={(checked) => onSettingsChange("grayscale", checked)}
            />
            <Label htmlFor="grayscale">Preto e Branco</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="watermark">Marca d'água (opcional)</Label>
            <Input
              id="watermark"
              type="text"
              placeholder="Digite o texto da marca d'água"
              value={settings.watermark}
              onChange={(e) => onSettingsChange("watermark", e.target.value)}
            />
            <p className="text-xs text-gray-500">Texto que aparecerá sobreposto no vídeo</p>
          </div>

          <Button onClick={onProcess} disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Processar Vídeo"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

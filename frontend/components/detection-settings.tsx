"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crosshair } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface DetectionSettingsProps {
  detections: any[]
}

export function DetectionSettings({ detections }: DetectionSettingsProps) {
  // Count occurrences of each class
  const classCounts: Record<string, number> = {}
  detections.forEach((detection) => {
    const className = detection.class
    classCounts[className] = (classCounts[className] || 0) + 1
  })

  // Convert to array for rendering
  const classCountsArray = Object.entries(classCounts)
    .map(([className, count]) => ({ className, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Crosshair className="mr-2 h-5 w-5" />
          Detection Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Current Detections</p>
            <p className="text-2xl font-bold">{detections.length} objects</p>
          </div>

          {classCountsArray.length > 0 ? (
            <div>
              <p className="text-sm font-medium mb-2">Detected Classes</p>
              <ScrollArea className="h-[120px]">
                <div className="space-y-2">
                  {classCountsArray.map(({ className, count }) => (
                    <div key={className} className="flex justify-between items-center">
                      <span className="text-sm">{className}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No objects detected</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

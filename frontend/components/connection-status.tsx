"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ConnectionStatusProps {
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
  error: string | null
}

export function ConnectionStatus({ isConnected, onConnect, onDisconnect, error }: ConnectionStatusProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          {isConnected ? (
            <Wifi className="mr-2 h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="mr-2 h-5 w-5 text-gray-500" />
          )}
          Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-gray-300"}`}></div>
          <span>{isConnected ? "Connected to detection server" : "Disconnected"}</span>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full"
          variant={isConnected ? "outline" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? "Disconnect" : "Connect to Server"}
        </Button>
      </CardContent>
    </Card>
  )
}

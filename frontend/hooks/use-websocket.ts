"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface WebSocketHookProps {
  url: string
  onDetections?: (data: any[]) => void
  onError?: (error: { message: string }) => void
}

export function useWebSocket({ url, onDetections, onError }: WebSocketHookProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return

    try {
      const socket = new WebSocket(url)

      socket.onopen = () => {
        setIsConnected(true)
        setConnectionError(null)
      }

      socket.onclose = () => {
        setIsConnected(false)
      }

      socket.onerror = (event) => {
        console.error("WebSocket error:", event)
        setConnectionError("Connection failed. Check if the server is running.")
        if (onError) onError({ message: "Connection failed" })
      }

      socket.onmessage = (event) => {
        try {
          // Handle different message types
          const data = JSON.parse(event.data)

          if (data.event === "detections" && onDetections) {
            onDetections(data.payload)
          } else if (data.event === "error" && onError) {
            onError(data.payload)
            setConnectionError(data.payload.message)
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      socketRef.current = socket
    } catch (error) {
      console.error("Error creating WebSocket:", error)
      setConnectionError("Failed to create WebSocket connection")
    }
  }, [url, onDetections, onError])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [])

  const sendFrame = useCallback((frameData: ArrayBuffer) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return
    }

    // Create a message with event type and binary data
    const message = {
      event: "frame",
      payload: frameData,
    }

    socketRef.current.send(frameData)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  return {
    isConnected,
    connect,
    disconnect,
    sendFrame,
    connectionError,
  }
}

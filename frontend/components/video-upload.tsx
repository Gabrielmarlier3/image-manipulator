"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface VideoUploadProps {
  onFileChange: (file: File | null) => void
}

export function VideoUpload({ onFileChange }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("video/")) {
        setFileName(file.name)
        onFileChange(file)
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFileName(file.name)
      onFileChange(file)
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="video/*" className="hidden" />

          <div className="flex flex-col items-center justify-center gap-2">
            {fileName ? (
              <>
                <Video className="h-12 w-12 text-gray-400" />
                <p className="text-sm font-medium">{fileName}</p>
                <Button variant="outline" onClick={handleButtonClick} className="mt-2">
                  Alterar Vídeo
                </Button>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-semibold">Solte seu vídeo aqui</h3>
                <p className="text-sm text-gray-500 mb-4">ou clique para navegar</p>
                <Button onClick={handleButtonClick}>Selecionar Vídeo</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

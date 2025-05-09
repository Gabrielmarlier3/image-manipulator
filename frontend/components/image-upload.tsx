"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ImageUploadProps {
  onFileChange: (file: File | null) => void
}

export function ImageUpload({ onFileChange }: ImageUploadProps) {
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
      if (file.type.startsWith("image/")) {
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
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden" />

          <div className="flex flex-col items-center justify-center gap-2">
            {fileName ? (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <p className="text-sm font-medium">{fileName}</p>
                <Button variant="outline" onClick={handleButtonClick} className="mt-2">
                  Change Image
                </Button>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-semibold">Adicione sua imagem aqui</h3>
                <p className="text-sm text-gray-500 mb-4">Clique para pesquisar</p>
                <Button onClick={handleButtonClick}>Selecionar imagem</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

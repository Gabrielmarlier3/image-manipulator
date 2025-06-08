// components/audio-player.tsx
"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"

interface AudioPlayerProps {
    originalAudio: string | null
    processedAudio: string | null
}

export function AudioPlayer({ originalAudio, processedAudio }: AudioPlayerProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Resultados</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AudioCard title="Áudio Original" audioSrc={originalAudio} />
                <AudioCard title="Áudio Processado" audioSrc={processedAudio} />
            </div>
        </div>
    )
}

interface AudioCardProps {
    title: string
    audioSrc: string | null
}

function AudioCard({ title, audioSrc }: AudioCardProps) {
    const audioRef = useRef<HTMLAudioElement>(null)

    // Quando a URL mudar, força o reload pra buscar metadata de duração
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load()
        }
    }, [audioSrc])

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {audioSrc ? (
                    <audio
                        ref={audioRef}
                        controls
                        preload="metadata"
                        className="w-full"
                        src={audioSrc}
                        key={audioSrc} // força remontagem se quiser
                    >
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                ) : (
                    <div className="w-full h-12 flex items-center justify-center border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex items-center text-gray-400">
                            <Music className="h-6 w-6 mr-2" />
                            <span className="text-sm">Nenhum áudio</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

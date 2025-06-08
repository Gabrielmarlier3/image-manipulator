"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ImageIcon, Volume2, Video } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const tabs = [
    {
      name: "Processamento de Imagem",
      href: "/",
      icon: <ImageIcon className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      name: "Processamento de Áudio",
      href: "/audio",
      icon: <Volume2 className="h-5 w-5" />,
      active: pathname === "/audio",
    },
    {
      name: "Processamento de Vídeo",
      href: "/video",
      icon: <Video className="h-5 w-5" />,
      active: pathname === "/video",
    },
  ]

  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium
                ${
                  tab.active
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }
              `}
              aria-current={tab.active ? "page" : undefined}
            >
              {tab.icon}
              <span className="ml-2">{tab.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

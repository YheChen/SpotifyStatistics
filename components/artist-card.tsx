import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import type { Artist } from "@/lib/types"

interface ArtistCardProps {
  artist: Artist
  rank: number
}

export default function ArtistCard({ artist, rank }: ArtistCardProps) {
  return (
    <Card className="overflow-hidden bg-zinc-900 border-zinc-800 hover:border-green-500 transition-all">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={artist.images[0]?.url || "/placeholder.svg?height=300&width=300"}
            alt={artist.name}
            width={300}
            height={300}
            className="w-full aspect-square object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
            {rank}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-1">{artist.name}</h3>
          <p className="text-gray-400 capitalize">{artist.genres.slice(0, 2).join(", ")}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">{artist.followers.total.toLocaleString()} followers</span>
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

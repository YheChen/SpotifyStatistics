import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Music2, User } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold">Spotify Stats</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Discover Your <span className="text-green-500">Spotify</span> Stats
        </h1>
        <p className="max-w-md text-xl text-gray-400">
          See your top tracks and artists from your Spotify listening history.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold">
            <Link href="/api/auth/login" className="flex items-center gap-2">
              Login with Spotify <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 w-full max-w-4xl">
          <div className="bg-zinc-900 rounded-xl p-6 flex flex-col items-center text-center">
            <Music2 className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Top Tracks</h2>
            <p className="text-gray-400">Discover your most played songs over time.</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-6 flex flex-col items-center text-center">
            <User className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Top Artists</h2>
            <p className="text-gray-400">See which artists you've listened to the most.</p>
          </div>
        </div>
      </main>
      <footer className="container mx-auto py-6 text-center text-gray-500">
        <p>Not affiliated with Spotify. Made with ❤️ for music lovers.</p>
      </footer>
    </div>
  )
}

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  const cookieStore = cookies()

  // Clear Spotify cookies
  cookieStore.delete("spotify_access_token")
  cookieStore.delete("spotify_refresh_token")

  return redirect("/")
}

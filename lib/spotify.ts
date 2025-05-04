import { cookies } from "next/headers"
import type { Track, Artist, SpotifyTopItemsResponse, SpotifyTokenResponse } from "./types"

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/auth/callback"

// Scopes needed for this application
const SCOPES = ["user-top-read", "user-read-private", "user-read-email"].join(" ")

// Get the authorization URL for Spotify login
export function getAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID!,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: "true",
  })

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

// Exchange the code for an access token
export async function getAccessToken(code: string): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  })

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: params,
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  return response.json()
}

// Refresh the access token
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  })

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: params,
  })

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`)
  }

  return response.json()
}

// Get the user's top items (tracks or artists)
export async function getTopItems(
  type: "tracks" | "artists",
  options: { limit: number; time_range: string },
): Promise<Track[] | Artist[]> {
  const cookieStore = cookies()
  const accessToken = cookieStore.get("spotify_access_token")?.value

  if (!accessToken) {
    throw new Error("No access token found")
  }

  const params = new URLSearchParams({
    limit: options.limit.toString(),
    time_range: options.time_range,
  })

  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value
    if (refreshToken) {
      const newTokens = await refreshAccessToken(refreshToken)

      // Set new cookies (this would need to be done in a server action or API route)
      // For now, we'll just throw an error to trigger a re-login
      throw new Error("Token expired, please login again")
    } else {
      throw new Error("No refresh token found, please login again")
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch top ${type}: ${response.statusText}`)
  }

  const data: SpotifyTopItemsResponse<Track | Artist> = await response.json()
  return data.items
}

// Logout function to clear cookies
export async function logout() {
  // This would need to be implemented as a server action or API route
  // For now, we'll just return a placeholder
  return { success: true }
}

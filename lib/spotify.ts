import type {
  Track,
  Artist,
  SpotifyTopItemsResponse,
  SpotifyTokenResponse,
} from "./types";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/api/auth/callback";

const SCOPES = ["user-top-read", "user-read-private", "user-read-email"].join(
  " "
);

/**
 * Generate the Spotify authorization URL
 */
export function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: "true",
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function getAccessToken(
  code: string
): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Failed to get access token: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Refresh access token using refresh_token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh access token: ${res.statusText}`);
  }

  return await res.json();
}

export async function getTopItemsRaw(
  accessToken: string,
  type: "tracks" | "artists",
  options: { limit: number; time_range: string }
): Promise<Track[] | Artist[]> {
  const url = `https://api.spotify.com/v1/me/top/${type}?${new URLSearchParams({
    limit: options.limit.toString(),
    time_range: options.time_range,
  }).toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.items;
}

/**
 * Fetch top items (tracks or artists)
 */
export async function getTopItems(
  type: "tracks" | "artists",
  options: { limit: number; time_range: string },
  accessToken: string
): Promise<Track[] | Artist[]> {
  const url = `https://api.spotify.com/v1/me/top/${type}?${new URLSearchParams({
    limit: options.limit.toString(),
    time_range: options.time_range,
  }).toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch top ${type}: ${res.statusText}`);
  }

  const data: SpotifyTopItemsResponse<Track | Artist> = await res.json();
  return data.items;
}

/**
 * Placeholder logout — should be handled in a route that clears cookies
 */
export async function logout(): Promise<{ success: boolean }> {
  return { success: true };
}

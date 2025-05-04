export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface Artist {
  id: string
  name: string
  type: string
  external_urls: {
    spotify: string
  }
  followers: {
    total: number
  }
  genres: string[]
  images: SpotifyImage[]
  popularity: number
}

export interface Album {
  id: string
  name: string
  type: string
  images: SpotifyImage[]
  external_urls: {
    spotify: string
  }
}

export interface Track {
  id: string
  name: string
  type: string
  duration_ms: number
  popularity: number
  external_urls: {
    spotify: string
  }
  album: Album
  artists: Artist[]
}

export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}

export interface SpotifyTopItemsResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  href: string
  next: string | null
  previous: string | null
}

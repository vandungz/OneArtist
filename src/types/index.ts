/**
 * TypeScript Interfaces cho ArtistOne
 * Re-export từ database.types và định nghĩa thêm các interface UI-specific
 */

// Re-export database types
export type {
    Artist,
    Album,
    Track,
    InsertArtist,
    InsertAlbum,
    InsertTrack,
    UpdateArtist,
    UpdateAlbum,
    UpdateTrack,
    Database,
} from '@/lib/supabase/database.types'

// Extended types với relations
export interface AlbumWithTracks {
    id: string
    artist_id: string
    title: string
    release_date: string | null
    cover_url: string | null
    created_at: string
    tracks: TrackInfo[]
}

export interface ArtistWithAlbums {
    id: string
    name: string
    bio: string | null
    avatar_url: string | null
    created_at: string
    albums: AlbumInfo[]
}

// Simplified types cho UI components
export interface TrackInfo {
    id: string
    title: string
    duration_seconds: number
    audio_file_url: string | null
    plays_count: number
}

export interface AlbumInfo {
    id: string
    title: string
    cover_url: string | null
    release_date: string | null
}

// Tour interface (cho tương lai)
export interface TourEvent {
    id: string
    artist_id: string
    venue: string
    city: string
    country: string
    event_date: string
    ticket_url: string | null
    latitude: number
    longitude: number
}

// Audio Player State
export interface PlayerState {
    currentTrack: TrackInfo | null
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    queue: TrackInfo[]
}

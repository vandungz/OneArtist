/**
 * TypeScript Interfaces cho ArtistOne
 * Re-export từ database.types và định nghĩa thêm các interface UI-specific
 */

// Re-export database types
export type {
    Artist,
    Album,
    Award,
    InsertArtist,
    InsertAlbum,
    InsertAward,
    UpdateArtist,
    UpdateAlbum,
    UpdateAward,
    Database,
} from '@/lib/supabase/database.types'

// Extended types với relations
export interface ArtistWithAlbums {
    id: string
    name: string
    bio: string | null
    avatar_url: string | null
    created_at: string
    albums: AlbumInfo[]
}

// Simplified types cho UI components
export interface AlbumInfo {
    id: string
    title: string
    slug: string
    cover_url: string | null
    album_type: string  // 'Album' | 'EP' | 'Single'
    release_year: number
}

// Award UI interface
export interface AwardInfo {
    id: string
    title: string
    type: string
    year: number
    url: string | null
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

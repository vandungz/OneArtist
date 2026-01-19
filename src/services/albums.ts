import { createClient } from '@/lib/supabase/server'
import { getStorageUrl } from '@/lib/utils'
import type { Album } from '@/lib/supabase/database.types'

// =============================================
// Types cho UI Components
// =============================================

export interface AlbumData {
    id: string
    slug: string
    title: string
    bio: string | null
    coverUrl: string | null
    year: number
    featuredArtist: string
    type: string  // 'Album' | 'EP' | 'Single'
    genre: string | null
    youtubeVideoId: string | null
    spotifyAlbumId: string | null  // Spotify Album ID cho embed player
    spotifyUrl: string | null
    isFeatured: boolean
}

// =============================================
// Album Functions
// =============================================

/**
 * Lấy tất cả albums/EPs/Singles
 */
export async function getAllAlbums(): Promise<AlbumData[]> {
    const supabase = await createClient()

    const { data: albums, error } = await supabase
        .from('albums')
        .select('*')
        .order('display_order', { ascending: true })

    if (error) {
        console.error('Error fetching albums:', error)
        return []
    }

    return albums.map(transformAlbum)
}

/**
 * Lấy featured albums cho homepage
 */
export async function getFeaturedAlbums(limit = 4): Promise<AlbumData[]> {
    const supabase = await createClient()

    const { data: albums, error } = await supabase
        .from('albums')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(limit)

    if (error) {
        console.error('Error fetching featured albums:', error)
        return []
    }

    return albums.map(transformAlbum)
}

/**
 * Lấy albums theo type (Album, EP, Single)
 */
export async function getAlbumsByType(type: 'Album' | 'EP' | 'Single'): Promise<AlbumData[]> {
    const supabase = await createClient()

    const { data: albums, error } = await supabase
        .from('albums')
        .select('*')
        .eq('album_type', type)
        .order('release_year', { ascending: false })

    if (error) {
        console.error(`Error fetching ${type}s:`, error)
        return []
    }

    return albums.map(transformAlbum)
}

/**
 * Lấy album theo slug (dùng cho URL)
 */
export async function getAlbumBySlug(slug: string): Promise<AlbumData | null> {
    const supabase = await createClient()

    const { data: album, error } = await supabase
        .from('albums')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !album) {
        console.error('Album not found:', slug)
        return null
    }

    return transformAlbum(album)
}

/**
 * Lấy album theo ID
 */
export async function getAlbumById(id: string): Promise<AlbumData | null> {
    const supabase = await createClient()

    const { data: album, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !album) {
        return null
    }

    return transformAlbum(album)
}

// =============================================
// Helper Functions
// =============================================

/**
 * Transform database album to UI-friendly format
 * Convert cover_url từ relative path sang full Supabase Storage URL
 */
function transformAlbum(album: Album): AlbumData {
    return {
        id: album.id,
        slug: album.slug,
        title: album.title,
        bio: album.bio,
        // Convert relative path (covers/album.jpg) to full Storage URL
        coverUrl: album.cover_url 
            ? getStorageUrl('artist_assets', album.cover_url)
            : null,
        year: album.release_year,
        featuredArtist: album.featured_artists || 'None',
        type: album.album_type,
        genre: album.genre,
        youtubeVideoId: album.youtube_video_id,
        spotifyAlbumId: album.spotify_album_id,
        spotifyUrl: album.spotify_url,
        isFeatured: album.is_featured
    }
}

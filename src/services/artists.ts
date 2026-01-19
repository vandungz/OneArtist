import { createClient } from '@/lib/supabase/server'
import { getStorageUrl } from '@/lib/utils'

// =============================================
// Types cho Artist
// =============================================

export interface ArtistData {
    id: string
    name: string
    bio: string | null
    avatarUrl: string | null
    role?: string  // Optional role, có thể lưu trong bio hoặc thêm field sau
}

// Default role khi không có trong database
const DEFAULT_ROLE = 'Musician / Rapper'

// =============================================
// Artist Functions
// =============================================

/**
 * Lấy thông tin nghệ sĩ chính (single-artist mode)
 * Lấy artist đầu tiên trong bảng artists
 */
export async function getMainArtist(): Promise<ArtistData | null> {
    const supabase = await createClient()

    const { data: artist, error } = await supabase
        .from('artists')
        .select('*')
        .limit(1)
        .maybeSingle()  // Dùng maybeSingle thay vì single để tránh lỗi khi 0 rows

    if (error) {
        console.error('Error fetching main artist:', error)
        return null
    }

    if (!artist) {
        console.warn('No artist found in database')
        return null
    }

    return transformArtist(artist)
}

/**
 * Lấy artist theo ID
 */
export async function getArtistById(id: string): Promise<ArtistData | null> {
    const supabase = await createClient()

    const { data: artist, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !artist) {
        return null
    }

    return transformArtist(artist)
}

// =============================================
// Helper Functions
// =============================================

interface ArtistRow {
    id: string
    name: string
    bio: string | null
    avatar_url: string | null
    created_at: string
}

/**
 * Transform database artist to UI-friendly format
 * Convert avatar_url từ relative path sang full Supabase Storage URL
 */
function transformArtist(artist: ArtistRow): ArtistData {
    return {
        id: artist.id,
        name: artist.name,
        bio: artist.bio,
        // Convert relative path (avatars/profile.jpg) to full Storage URL
        avatarUrl: artist.avatar_url 
            ? getStorageUrl('artist_assets', artist.avatar_url)
            : null,
        role: DEFAULT_ROLE
    }
}

// =============================================
// Fallback Data (khi chưa có data trong Supabase)
// =============================================

export function getFallbackArtist(): ArtistData {
    return {
        id: 'fallback',
        name: 'Artist Name',
        bio: 'Artist bio goes here. Update your artist data in Supabase.',
        avatarUrl: getStorageUrl('artist_assets', 'avatars/profile.jpg'),
        role: DEFAULT_ROLE
    }
}

/**
 * Lấy artist với fallback nếu không có data
 */
export async function getMainArtistWithFallback(): Promise<ArtistData> {
    const artist = await getMainArtist()
    return artist || getFallbackArtist()
}

/**
 * Helper để lấy hero image URL
 * Hero image được lưu trong storage, không trong database
 */
export function getHeroImageUrl(): string {
    return getStorageUrl('artist_assets', 'hero/hero.jpg')
}

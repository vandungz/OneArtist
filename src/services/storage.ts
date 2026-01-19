import { createClient } from '@/lib/supabase/server'
import { getStorageUrl } from '@/lib/utils'

// =============================================
// Types cho Media từ Storage
// =============================================

export interface MediaItem {
    url: string
    type: 'image' | 'video'
    name: string
}

// Supported extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov']

// =============================================
// Storage Functions
// =============================================

/**
 * List tất cả media files từ một folder trong Storage
 * Sử dụng cho album gallery
 * 
 * @param folderPath - path đến folder (ví dụ: 'cang_cua' hoặc 'l2k')
 * @param bucket - tên bucket (default: 'artist_assets')
 */
export async function getMediaFromFolder(
    folderPath: string,
    bucket: string = 'artist_assets'
): Promise<MediaItem[]> {
    const supabase = await createClient()

    console.log('[getMediaFromFolder] Listing folder:', folderPath, 'in bucket:', bucket)

    // Debug: List root của bucket để xem có folders không
    const { data: rootFiles, error: rootError } = await supabase
        .storage
        .from(bucket)
        .list('', { limit: 50 })
    console.log('[getMediaFromFolder] Root folders in bucket:', rootFiles?.map(f => f.name), rootError)

    const { data: files, error } = await supabase
        .storage
        .from(bucket)
        .list(folderPath, {
            limit: 100,
            sortBy: { column: 'name', order: 'asc' }
        })

    if (error) {
        console.error(`[getMediaFromFolder] Error listing files from ${folderPath}:`, error)
        return []
    }

    console.log('[getMediaFromFolder] Raw files from Supabase:', files)

    if (!files || files.length === 0) {
        console.log('[getMediaFromFolder] No files found in folder')
        return []
    }

    // Filter và transform files thành MediaItem
    const mediaItems: MediaItem[] = files
        .filter(file => {
            // Bỏ qua folders (có id nhưng không có metadata)
            if (!file.name) return false
            
            const ext = getFileExtension(file.name).toLowerCase()
            return IMAGE_EXTENSIONS.includes(ext) || VIDEO_EXTENSIONS.includes(ext)
        })
        .map(file => {
            const ext = getFileExtension(file.name).toLowerCase()
            const isVideo = VIDEO_EXTENSIONS.includes(ext)
            
            return {
                url: getStorageUrl(bucket, `${folderPath}/${file.name}`),
                type: isVideo ? 'video' : 'image',
                name: file.name
            }
        })

    return mediaItems
}

/**
 * Lấy media cho album page dựa trên slug
 * Trả về media từ folder tương ứng, hoặc chỉ cover nếu folder rỗng
 * 
 * Folder names trong Storage = slug trong database (dùng dấu '-')
 */
export async function getAlbumMedia(
    albumSlug: string,
    coverUrl: string | null
): Promise<MediaItem[]> {
    console.log('[getAlbumMedia] Fetching media for slug:', albumSlug)
    
    // Lấy media từ folder có tên = slug
    const folderMedia = await getMediaFromFolder(albumSlug)
    
    console.log('[getAlbumMedia] Found media items:', folderMedia.length, folderMedia)
    
    if (folderMedia.length > 0) {
        return folderMedia
    }
    
    console.log('[getAlbumMedia] No folder media, using cover fallback:', coverUrl)
    
    // Fallback: dùng cover image nếu không có folder hoặc folder rỗng
    if (coverUrl) {
        return [{
            url: coverUrl,
            type: 'image',
            name: 'cover'
        }]
    }
    
    return []
}

/**
 * Lấy media cho homepage từ album covers
 */
export function getHomepageMedia(
    albums: Array<{ coverUrl: string | null; title: string }>
): MediaItem[] {
    return albums
        .filter(album => album.coverUrl !== null)
        .map(album => ({
            url: album.coverUrl!,
            type: 'image' as const,
            name: album.title
        }))
}

// =============================================
// Helper Functions
// =============================================

function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.')
    if (lastDot === -1) return ''
    return filename.substring(lastDot)
}

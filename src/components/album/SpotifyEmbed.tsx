/**
 * Album Type để xác định chiều cao embed
 */
type AlbumType = 'Single' | 'EP' | 'Album'

/**
 * Tính chiều cao embed dựa trên loại album
 * Layout: Cover + Info ở trên (~280px) + TrackList ở dưới
 * 
 * Chỉ điều chỉnh chiều cao TrackList_background dựa trên số tracks:
 * - Single: 1-2 tracks
 * - EP: 4-6 tracks
 * - Album: 8+ tracks
 */
function getEmbedHeight(albumType: AlbumType, tracksCount?: number): number {
    // Base height: Cover (200px) + Player controls (80px) = 280px
    const baseHeight = 300
    // Mỗi track row: ~56px
    const trackRowHeight = 52

    // Số tracks hiển thị trong TrackList_background
    let trackListRows: number
    
    switch (albumType) {
        case 'Single':
            // Single: 1-2 tracks
            trackListRows = tracksCount || 1
            break
        case 'EP':
            // EP: 4-6 tracks
            trackListRows = tracksCount || 5
            break
        case 'Album':
        default:
            // Album: hiển thị tối đa 8 tracks, có thể scroll
            trackListRows = Math.min(tracksCount || 10, 8)
            break
    }

    return baseHeight + (trackRowHeight * trackListRows)
}

interface SpotifyEmbedProps {
    /**
     * Spotify Album/Track ID
     * Lấy từ: https://open.spotify.com/album/ALBUM_ID
     */
    spotifyId: string
    /**
     * Loại embed: album, track, hoặc playlist
     */
    type?: 'album' | 'track' | 'playlist'
    /**
     * Loại album để tự động responsive chiều cao
     */
    albumType?: AlbumType
    /**
     * Số lượng tracks (optional - dùng để tính chiều cao chính xác hơn)
     */
    tracksCount?: number
    /**
     * Theme: 0 = dark (default), 1 = light
     */
    theme?: 0 | 1
    /**
     * Override chiều cao (px) - nếu set sẽ bỏ qua tính toán tự động
     */
    height?: number | string
}

export function SpotifyEmbed({
    spotifyId,
    type = 'album',
    albumType = 'Album',
    tracksCount,
    theme = 0,
    height
}: SpotifyEmbedProps) {
    // Tính chiều cao tự động dựa trên albumType, hoặc dùng height override
    const embedHeight = height ?? getEmbedHeight(albumType, tracksCount)
    
    // Tạo embed URL
    const embedUrl = `https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=${theme}`

    return (
        <div className="spotify-embed">
            <iframe
                src={embedUrl}
                width="100%"
                height={embedHeight}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify ${type}`}
            />
        </div>
    )
}

/**
 * Compact version - chỉ hiển thị player nhỏ (80px)
 */
export function SpotifyCompactPlayer({ spotifyId, type = 'album' }: { spotifyId: string; type?: 'album' | 'track' }) {
    return (
        <SpotifyEmbed
            spotifyId={spotifyId}
            type={type}
            height={80}
        />
    )
}

/**
 * Full tracklist version - hiển thị tất cả tracks với albumType
 */
export function SpotifyFullPlayer({ 
    spotifyId, 
    type = 'album',
    albumType = 'Album',
    tracksCount
}: { 
    spotifyId: string
    type?: 'album' | 'track' | 'playlist'
    albumType?: AlbumType
    tracksCount?: number 
}) {
    return (
        <SpotifyEmbed
            spotifyId={spotifyId}
            type={type}
            albumType={albumType}
            tracksCount={tracksCount}
        />
    )
}

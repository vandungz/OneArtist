import Link from 'next/link'
import { getStorageUrl } from '@/lib/utils'

interface AlbumCardProps {
    /**
     * Album cover URL from Supabase Storage
     * Example: getStorageUrl('artist_assets', 'covers/album1.jpg')
     */
    coverUrl?: string
    title: string
    slug: string
}

export function AlbumCard({ coverUrl, title, slug }: AlbumCardProps) {
    return (
        <Link href={`/albums/${slug}`} className="work-card-container--showcase">
            {/* Blur overlay on hover */}
            <div className="image-blur"></div>

            {/* Album Cover */}
            {coverUrl ? (
                <img src={coverUrl} alt={title} />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'var(--background-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <p style={{ color: 'var(--text-color-muted)' }}>{title}</p>
                </div>
            )}


            {/* Title overlay */}
            <div className="work-card-title">
                <p className="meta">{title}</p>
            </div>
        </Link>
    )
}

interface AlbumGridProps {
    albums: Array<{
        id: string
        title: string
        cover_url: string | null
    }>
}

export function AlbumGrid({ albums }: AlbumGridProps) {
    return (
        <div className="work-cards-container">
            {albums.map((album) => (
                <AlbumCard
                    key={album.id}
                    coverUrl={album.cover_url || undefined}
                    title={album.title}
                    slug={album.id}
                />
            ))}
        </div>
    )
}

// Placeholder albums for demo
export const placeholderAlbums = [
    { id: 'N0L4B3L', title: 'N0L4B3L', cover_url: getStorageUrl('artist_assets', 'covers/N0L4B3L.jpg') },
    { id: 'MONGYU', title: 'MỘNG YU', cover_url: getStorageUrl('artist_assets', 'covers/MONGYU.jpg') },
    { id: '99', title: '99%', cover_url: getStorageUrl('artist_assets', 'covers/99.jpg') },
    { id: 'TAIVISAO', title: 'TẠI VÌ SAO', cover_url: getStorageUrl('artist_assets', 'covers/TAIVISAO.jpg') },
]

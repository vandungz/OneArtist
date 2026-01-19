import Link from 'next/link'

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

            {/* Blur overlay on hover - must be after image for backdrop-filter to work */}
            <div className="image-blur"></div>

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
        slug?: string         // URL-friendly slug
        title: string
        cover_url?: string | null
        coverUrl?: string | null  // Alternative key từ service
    }>
}

export function AlbumGrid({ albums }: AlbumGridProps) {
    return (
        <div className="work-cards-container">
            {albums.map((album) => (
                <AlbumCard
                    key={album.id}
                    coverUrl={album.cover_url || album.coverUrl || undefined}
                    title={album.title}
                    slug={album.slug || album.id}
                />
            ))}
        </div>
    )
}

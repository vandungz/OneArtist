interface HeroImageProps {
    /** 
     * Image URL from Supabase Storage
     * Example: getStorageUrl('artist_assets', 'hero/main.jpg')
     */
    imageUrl?: string
    alt?: string
    label?: string
}

export function HeroImage({
    imageUrl,
    alt = 'Artist hero image',
    label = 'Latest Music'
}: HeroImageProps) {
    return (
        <div className="body-container__left">
            {/* Hero Image */}
            {imageUrl ? (
                <img src={imageUrl} alt={alt} />
            ) : (
                // Placeholder when no image
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
                    <p style={{ color: 'var(--text-color-muted)' }}>Hero Image</p>
                </div>
            )}

            {/* Label overlay */}
            <div className="select-work">
                <p className="meta">{label}</p>
            </div>
        </div>
    )
}

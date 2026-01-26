import { MusicPageClient } from './MusicPageClient'
import { getAllAlbums } from '@/services/albums'
import { getMainArtistWithFallback } from '@/services/artists'
import { defaultSocialLinks } from '@/components/shared/SocialLinks'

// Revalidate data mỗi 60 giây
export const revalidate = 60

export default async function MusicPage() {
    // Fetch data từ Supabase
    const [albums, artist] = await Promise.all([
        getAllAlbums(),
        getMainArtistWithFallback()
    ])

    // Get default hero image from first album
    const defaultHeroImage = albums[0]?.coverUrl || '/placeholder.jpg'

    return (
        <MusicPageClient
            albums={albums}
            artist={{
                name: artist.name,
                role: artist.role ?? 'Artist',
                avatarUrl: artist.avatarUrl
            }}
            socialLinks={defaultSocialLinks.slice(0, 4)}
            defaultHeroImage={defaultHeroImage}
        />
    )
}

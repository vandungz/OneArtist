import Link from 'next/link'
import { HeroGallery } from '@/components/layout/HeroGallery'
import { ProfileCard } from '@/components/shared/ProfileCard'
import { SocialLinks, defaultSocialLinks } from '@/components/shared/SocialLinks'
import { AlbumGrid } from '@/components/shared/AlbumCard'
import { Footer } from '@/components/layout/Footer'
import { getMainArtistWithFallback } from '@/services/artists'
import { getFeaturedAlbums } from '@/services/albums'
import { getHomepageMedia } from '@/services/storage'

// Revalidate data mỗi 60 giây (hoặc set 0 để luôn fresh)
export const revalidate = 0

export default async function Home() {
  // Fetch data từ Supabase
  const artist = await getMainArtistWithFallback()
  const featuredAlbums = await getFeaturedAlbums(4)
  
  // Get media from album covers for hero gallery
  const heroMedia = getHomepageMedia(featuredAlbums)

  return (
    <div className="body-container">
      {/* Left Column - Hero Gallery with album covers */}
      <HeroGallery
        media={heroMedia}
        label="Latest Music"
      />

      {/* Right Column - Content */}
      <div className="body-container__right">
        {/* Profile & Social Links */}
        <div className="home-card-about">
          <ProfileCard
            avatarUrl={artist.avatarUrl ?? undefined}
            name={artist.name}
            role={artist.role}
            bio={artist.bio ?? undefined}
          />
          <SocialLinks links={defaultSocialLinks} />
        </div>

        {/* Latest Music Section */}
        <div className="lastest-work">
          <div className="lastest-work--title">
            <p className="meta">Latest Albums</p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21L17 16M12 21L7 16M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Link href="/music" className="button-text view-all">
            View all
          </Link>
        </div>

        {/* Album Grid */}
        <AlbumGrid albums={featuredAlbums} />

        {/* View All Projects Button */}
        <div className="btn-view-all button-text">
          <Link href="/music">Show All</Link>
        </div>

        {/* Footer Contact Section */}
        <div className="footer-contact">
          <SocialLinks links={defaultSocialLinks.slice(0, 4)} variant="grid" />

          <Link href="/contact" className="btn-contact-me">
            <p>Contact Me</p>
            <svg width="18" height="18" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L8.10764 6.61227L8.10967 6.61396C8.78785 7.11128 9.12714 7.3601 9.49876 7.45621C9.82723 7.54117 10.1725 7.54117 10.501 7.45621C10.8729 7.36001 11.2132 7.11047 11.8926 6.61227C11.8926 6.61227 15.8101 3.60594 18 2M1 11.8002V4.2002C1 3.08009 1 2.51962 1.21799 2.0918C1.40973 1.71547 1.71547 1.40973 2.0918 1.21799C2.51962 1 3.08009 1 4.2002 1H15.8002C16.9203 1 17.4796 1 17.9074 1.21799C18.2837 1.40973 18.5905 1.71547 18.7822 2.0918C19 2.5192 19 3.07899 19 4.19691V11.8036C19 12.9215 19 13.4805 18.7822 13.9079C18.5905 14.2842 18.2837 14.5905 17.9074 14.7822C17.48 15 16.921 15 15.8031 15H4.19691C3.07899 15 2.5192 15 2.0918 14.7822C1.71547 14.5905 1.40973 14.2842 1.21799 13.9079C1 13.4801 1 12.9203 1 11.8002Z" stroke="var(--text-color-inverse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Footer
            artistName={artist.name}
            role={artist.role}
            avatarUrl={artist.avatarUrl ?? undefined}
          />
        </div>
      </div>
    </div>
  )
}

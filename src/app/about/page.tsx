import Link from 'next/link'
import { HeroGallery } from '@/components/layout/HeroGallery'
import { ProfileCard } from '@/components/shared/ProfileCard'
import { SocialLinks, defaultSocialLinks } from '@/components/shared/SocialLinks'
import { Footer } from '@/components/layout/Footer'
import { AboutDetail, AwardsSection, ClientsMarquee } from '@/components/about'
import { getMainArtistWithFallback } from '@/services/artists'
import { getAwards } from '@/services/awards'
import { getFeaturedAlbums } from '@/services/albums'
import { getHomepageMedia } from '@/services/storage'

// Revalidate data mỗi 60 giây
export const revalidate = 0

export default async function AboutPage() {
    // Fetch data từ Supabase
    const artist = await getMainArtistWithFallback()
    const awards = await getAwards()
    const featuredAlbums = await getFeaturedAlbums(4)

    // About paragraphs - có thể lấy từ database sau
    const aboutParagraphs = [
        "With a focus on both creative expression and technical mastery, I strive to evoke emotion and tell stories through my work. My art blends the rawness of everyday life with precision and artistry, allowing audiences to connect with each piece on a deeper level.",
        "Whether I'm exploring new sounds, pushing creative boundaries, or collaborating with other artists, my goal is to highlight the extraordinary in the ordinary. Through my journey, I invite you to join me on this visual and auditory experience of discovery and inspiration."
    ]

    // Get media from album covers for hero gallery
      const heroMedia = getHomepageMedia(featuredAlbums)

    return (
        <div className="body-container">
            {/* Left Column - Hero Gallery */}
            <HeroGallery
                media={heroMedia}
                label="About"
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

                {/* About Detail Section */}
                <AboutDetail 
                    title="About"
                    paragraphs={aboutParagraphs}
                />

                {/* Clients Marquee */}
                <ClientsMarquee />

                {/* Awards Section */}
                {awards.length > 0 && (
                    <AwardsSection 
                        awards={awards}
                        title="Awards & Recognitions"
                        description="Honored to receive multiple awards for excellence, recognizing creative vision and commitment to the craft."
                    />
                )}

                {/* Footer Contact Section */}
                <div className="footer-contact">
                    <SocialLinks links={defaultSocialLinks.slice(0, 4)} variant="grid" />

                    <Link href="/contact" className="btn-contact-me">
                        <p>Contact Me</p>
                        <div className="icon-wrapper">
                            <div className="icon-stack">
                                <div className="socials-icon">
                                    <svg width="18" height="18" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 2L8.10764 6.61227L8.10967 6.61396C8.78785 7.11128 9.12714 7.3601 9.49876 7.45621C9.82723 7.54117 10.1725 7.54117 10.501 7.45621C10.8729 7.36001 11.2132 7.11047 11.8926 6.61227C11.8926 6.61227 15.8101 3.60594 18 2M1 11.8002V4.2002C1 3.08009 1 2.51962 1.21799 2.0918C1.40973 1.71547 1.71547 1.40973 2.0918 1.21799C2.51962 1 3.08009 1 4.2002 1H15.8002C16.9203 1 17.4796 1 17.9074 1.21799C18.2837 1.40973 18.5905 1.71547 18.7822 2.0918C19 2.5192 19 3.07899 19 4.19691V11.8036C19 12.9215 19 13.4805 18.7822 13.9079C18.5905 14.2842 18.2837 14.5905 17.9074 14.7822C17.48 15 16.921 15 15.8031 15H4.19691C3.07899 15 2.5192 15 2.0918 14.7822C1.71547 14.5905 1.40973 14.2842 1.21799 13.9079C1 13.4801 1 12.9203 1 11.8002Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="nav-icon nav-icon--contact">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" style={{ width: '100%', height: '100%', display: 'inline-block', fill: 'currentColor' }}>
                                        <g>
                                            <path d="M220.24,132.24l-72,72a6,6,0,0,1-8.48-8.48L201.51,134H40a6,6,0,0,1,0-12H201.51L139.76,60.24a6,6,0,0,1,8.48-8.48l72,72A6,6,0,0,1,220.24,132.24Z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Footer */}
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

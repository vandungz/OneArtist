/**
 * Album Detail Page - /albums/[slug]
 * 
 * Dynamic route page hiển thị chi tiết một album/EP/Single
 * Sử dụng HeroGallery component với animation Stacked Vertical Blur-Wipe Reveal
 * 
 * @example /albums/l2k, /albums/cang-cua, /albums/tan-gai-phong-tra
 */

import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAlbumBySlug, getNextAlbum } from '@/services/albums'
import { getMainArtistWithFallback } from '@/services/artists'
import { getAlbumMedia } from '@/services/storage'
import { HeroGallery } from '@/components/layout/HeroGallery'
import { AlbumInfo } from '@/components/album/AlbumInfo'
import { SpotifyEmbed } from '@/components/album/SpotifyEmbed'
import { YouTubeEmbed } from '@/components/album/YouTubeEmbed'
import { SocialLinks, defaultSocialLinks } from '@/components/shared/SocialLinks'
import { Footer } from '@/components/layout/Footer'

// Revalidate data - 0 = always fresh, 60 = every 60 seconds
export const revalidate = 0

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function AlbumDetailPage({ params }: PageProps) {
    const { slug } = await params

    // Fetch data từ Supabase
    const [album, artist, nextAlbum] = await Promise.all([
        getAlbumBySlug(slug),
        getMainArtistWithFallback(),
        getNextAlbum(slug)
    ])

    if (!album) {
        notFound()
    }

    // Get media for this album from storage folder
    const albumMedia = await getAlbumMedia(slug, album.coverUrl)

    return (
        <div className="body-container">
            {/* Left Column - Album Gallery */}
            <HeroGallery
                media={albumMedia}
                label={album.title}
            />

            {/* Right Column - Content */}
            <div className="body-container__right">
                {/* Album Header with Info Cards */}
                <div className="album-detail-header">
                    <div className="album-title-section">
                        <h1>{album.title}</h1>
                        <p className="album-description">
                            {album.bio || `${album.type} phát hành năm ${album.year}.`}
                        </p>
                    </div>
                    <AlbumInfo
                        year={album.year}
                        featuredArtist={album.featuredArtist}
                        type={album.type}
                    />
                </div>

                {/* Album Player Section - Spotify Embed */}
                <div className="album-player-section">
                    {album.spotifyAlbumId ? (
                        <SpotifyEmbed 
                            spotifyId={album.spotifyAlbumId} 
                            type="album"
                            albumType={album.type as 'Single' | 'EP' | 'Album'}
                        />
                    ) : (
                        <div className="no-spotify-placeholder">
                            <p>Spotify embed không khả dụng cho {album.type} này.</p>
                            {album.spotifyUrl && (
                                <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer">
                                    Nghe trên Spotify →
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* YouTube Video Section - chỉ hiển thị nếu có video */}
                {album.youtubeVideoId && (
                    <div className="album-video-section">
                        <div className="lastest-work">
                            <div className="lastest-work--title">
                                <p className="meta">Music Video</p>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 21L17 16M12 21L7 16M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <YouTubeEmbed videoId={album.youtubeVideoId} title={album.title} />
                    </div>
                )}

                {/* Next Album Preview */}
                <div className="next-album-section">
                    {nextAlbum ? (
                        <div className="next-album-card next-album-card--preview">
                            <div className="next-album-content">
                                <span className="next-label">Next</span>
                                <div className="next-bottom">
                                    <p className="album-preview-desc">
                                        {nextAlbum.bio || `${nextAlbum.type} phát hành năm ${nextAlbum.year}.`}
                                    </p>
                                    <Link href={`/albums/${nextAlbum.slug}`} className="button-text view-all">
                                        View Project
                                    </Link>
                                </div>
                            </div>
                            {nextAlbum.coverUrl && (
                                <Link href={`/albums/${nextAlbum.slug}`} className="next-album-thumbnail">
                                    <span className="next-album-title">{nextAlbum.title}</span>
                                    <div className="next-album-blur" />
                                    <Image
                                        src={nextAlbum.coverUrl}
                                        alt={nextAlbum.title}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 280px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="next-album-card">
                            <span className="next-label">Next</span>
                            <p className="album-preview-desc">
                                Khám phá thêm các album khác trong discography của nghệ sĩ.
                            </p>
                            <Link href="/music" className="button-text view-all">
                                View All Albums
                            </Link>
                        </div>
                    )}
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

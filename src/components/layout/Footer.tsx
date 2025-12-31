import Link from 'next/link'
import { ProfileCard } from '@/components/shared/ProfileCard'

const footerNavLinks = {
    pages: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ],
    music: [
        { label: 'Albums', href: '/music' },
        { label: 'Singles', href: '/music#singles' },
        { label: 'Tour', href: '/tour' },
    ],
    utility: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
    ],
}

interface FooterProps {
    artistName: string
    role?: string
    avatarUrl?: string
}

export function Footer({ artistName, role = 'Artist', avatarUrl }: FooterProps) {
    return (
        <div className="footer-infos-contact">
            {/* Profile & More Templates */}
            <div className="footer-contact-profile">
                <div className="home-card-info_profile">
                    {avatarUrl ? (
                        <img className="home-card-info_ava" src={avatarUrl} alt={artistName} />
                    ) : (
                        <div
                            className="home-card-info_ava"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                backgroundColor: 'var(--background-muted)'
                            }}
                        >
                            {artistName.charAt(0)}
                        </div>
                    )}
                    <div className="home-card-info_name">
                        <h5>{artistName}</h5>
                        <p className="meta">{role}</p>
                    </div>
                </div>

                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="footer-contact--more">
                    <p>Powered by Supabase</p>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H9M17 7V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>

            {/* Navigation Links */}
            <div className="footer-contact-navi">
                <div className="footer--nav">
                    <h6>Pages</h6>
                    <ul>
                        {footerNavLinks.pages.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer--nav">
                    <h6>Music</h6>
                    <ul>
                        {footerNavLinks.music.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer--nav">
                    <h6>Utility</h6>
                    <ul>
                        {footerNavLinks.utility.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* License */}
            <div className="footer-license">
                <p className="meta">
                    © {new Date().getFullYear()} {artistName}. Built with{' '}
                    <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
                    {' '}& <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Supabase</a>
                </p>
            </div>
        </div>
    )
}

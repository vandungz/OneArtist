'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navLinks = [
    { href: '/', label: 'Home', dataText: 'Home' },
    { href: '/music', label: 'Music', dataText: 'Music' },
    { href: '/about', label: 'About', dataText: 'About' },
    { href: '/tour', label: 'Tour', dataText: 'Tour' },
    { href: '/contact', label: 'Contact', dataText: 'Contact', isContact: true },
]

interface ProfileCardProps {
    /**
     * Avatar URL from Supabase Storage
     * Example: getStorageUrl('artist_assets', 'avatars/profile.jpg')
     */
    avatarUrl?: string
    name: string
    role?: string
    bio?: string
}

export function Navbar(
    {
    avatarUrl,
    name,
    role = 'Artist',
    bio
}: ProfileCardProps
) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMenuOpen])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const closeMenu = () => setIsMenuOpen(false)

    return (
        <>
            {/* Desktop Navbar */}
            <header className="header header--desktop">
                <div className="header--navbar" id="header--navbar">
                    <ul>
                        <li>
                            <Link href="/">
                                <div className="header--navbar_logo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" overflow="visible">
                                        <g>
                                            <path d="M 0 15 L 0 0 L 15 0 L 15 15 Z" fill="transparent"></path>
                                            <g>
                                                <path d="M 3.75 7.5 C 3.75 5.429 5.429 3.75 7.5 3.75 C 9.571 3.75 11.25 5.429 11.25 7.5 C 11.25 9.571 9.571 11.25 7.5 11.25 C 5.429 11.25 3.75 9.571 3.75 7.5 Z M 7.5 15 C 11.642 15 15 11.642 15 7.5 C 15 3.358 11.642 0 7.5 0 C 3.358 0 0 3.358 0 7.5 C 0 11.642 3.358 15 7.5 15 Z" fill="currentColor"></path>
                                            </g>
                                        </g>
                                    </svg>
                                    <p data-text="Low G">Low G</p>
                                </div>
                            </Link>
                        </li>
                        {navLinks.slice(1, -1).map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>
                                    <p data-text={link.dataText}>{link.label}</p>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
                
                <svg className="header--navbar-corner-right" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                    <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" fill="var(--background-color-default)"></path>
                </svg>
                
                <svg className="header--navbar-corner-bottom" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                    <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" fill="var(--background-color-default)"></path>
                </svg>
            </header>

            {/* Mobile Navbar */}
            <header className="header header--mobile">
                {/* Left side: Logo + Theme Toggle with corner decorations */}
                <div className={`header--mobile-left-wrapper ${isMenuOpen ? 'hidden' : ''}`}>
                    <div className="header--mobile-left">
                        <Link href="/" className="header--navbar_logo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" overflow="visible">
                                <g>
                                    <path d="M 0 15 L 0 0 L 15 0 L 15 15 Z" fill="transparent"></path>
                                    <g>
                                        <path d="M 3.75 7.5 C 3.75 5.429 5.429 3.75 7.5 3.75 C 9.571 3.75 11.25 5.429 11.25 7.5 C 11.25 9.571 9.571 11.25 7.5 11.25 C 5.429 11.25 3.75 9.571 3.75 7.5 Z M 7.5 15 C 11.642 15 15 11.642 15 7.5 C 15 3.358 11.642 0 7.5 0 C 3.358 0 0 3.358 0 7.5 C 0 11.642 3.358 15 7.5 15 Z" fill="currentColor"></path>
                                    </g>
                                </g>
                            </svg>
                            <p>lowg</p>
                        </Link>
                        <ThemeToggle />
                    </div>
                    {/* Corner decoration - right of left section */}
                    <svg className="header--mobile-corner-right" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                        <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" fill="var(--background-color-default)"></path>
                    </svg>
                    {/* Corner decoration - bottom of left section */}
                    <svg className="header--mobile-corner-bottom" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                        <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" fill="var(--background-color-default)"></path>
                    </svg>
                </div>
                
                {/* Right side: Menu button with corner decorations */}
                <div className="header--mobile-right-wrapper">
                    {/* Corner decoration - left of right section */}
                    <svg className="header--mobile-corner-left" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                        <path d="M 18 0 L 18 18 C 18 8.059 9.941 0 0 0 Z" fill="var(--background-color-default)"></path>
                    </svg>
                    <button className="header--mobile-menu-btn" onClick={toggleMenu}>
                        <p>{isMenuOpen ? 'Close' : 'Menu'}</p>
                    </button>
                    {/* Corner decoration - bottom of right section */}
                    <svg className="header--mobile-corner-bottom-right" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                        <path d="M 18 0 L 18 18 C 18 8.059 9.941 0 0 0 Z" fill="var(--background-color-default)"></path>
                    </svg>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    {/* Profile section at top */}
                    <div className="mobile-menu-header">
                        <div className="mobile-menu-profile">
                            {avatarUrl ? (
                                <img className="mobile-menu-avatar" src={avatarUrl} alt={name} />
                            ) : (
                                <div className="mobile-menu-avatar">{name.charAt(0)}</div>
                            )}
                            <div className="mobile-menu-info">
                                <h5>{name}</h5>
                                <p className="meta">{role}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Nav links */}
                    <nav className="mobile-menu-nav">
                        <ul>
                            {navLinks.map((link) => (
                                <li key={link.href} className={link.isContact ? 'contact-item' : ''}>
                                    <Link href={link.href} onClick={closeMenu}>
                                        <span>{link.label}</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

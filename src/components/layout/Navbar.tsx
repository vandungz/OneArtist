'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navLinks = [
    { href: '/music', label: 'Music', dataText: 'Music' },
    { href: '/about', label: 'About', dataText: 'About' },
    { href: '/tour', label: 'Tour', dataText: 'Tour' },
    { href: '/contact', label: 'Contact', dataText: 'Contact' },
]

export function Navbar() {
    return (
        <header className="header">
            <div className="header--navbar" id="header--navbar">
                <ul>
                    <li>
                        <Link href="/">
                            <div className="header--navbar_logo">
                                {/* Logo SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" overflow="visible">
                                    <g>
                                        <path d="M 0 15 L 0 0 L 15 0 L 15 15 Z" fill="transparent"></path>
                                        <g>
                                            <path d="M 3.75 7.5 C 3.75 5.429 5.429 3.75 7.5 3.75 C 9.571 3.75 11.25 5.429 11.25 7.5 C 11.25 9.571 9.571 11.25 7.5 11.25 C 5.429 11.25 3.75 9.571 3.75 7.5 Z M 7.5 15 C 11.642 15 15 11.642 15 7.5 C 15 3.358 11.642 0 7.5 0 C 3.358 0 0 3.358 0 7.5 C 0 11.642 3.358 15 7.5 15 Z" fill="currentColor"></path>
                                        </g>
                                    </g>
                                </svg>
                                <p data-text="lowg">lowg</p>
                            </div>
                        </Link>
                    </li>
                    {navLinks.map((link) => (
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
            
            {/* Corner decoration - right side of navbar */}
            <svg className="header--navbar-corner-right" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" fill="var(--background-color-default)"></path>
            </svg>
            
            {/* Corner decoration - bottom left of navbar */}
            <svg className="header--navbar-corner-bottom" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                <path d="M 0 0 L 0 18 C 0 8.059 8.059 0 18 0 Z" fill="var(--background-color-default)"></path>
            </svg>
        </header>
    )
}

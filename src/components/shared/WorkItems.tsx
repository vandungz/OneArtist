'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { AlbumData } from '@/services/albums'

interface WorkItemsListProps {
    albums: AlbumData[]
    onHoverImage?: (imageUrl: string | null) => void
}

// Arrow down icon for work items
const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21L17 16M12 21L7 16M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

interface WorkItemProps {
    album: AlbumData
    onMouseEnter: (imageUrl: string | null) => void
}

function WorkItem({ album, onMouseEnter }: WorkItemProps) {
    return (
        <li 
            className="work-items" 
            onMouseEnter={() => onMouseEnter(album.coverUrl)}
        >
            <Link href={`/albums/${album.slug}`}>
                <div className="work-items--container">
                    <div className="work-items--title">
                        <h5>{album.title}</h5>
                    </div>
                    <div className="work-items--description">
                        <p className="meta">{album.type}</p>
                        <p className="meta">{album.year}</p>
                    </div>
                    <ArrowIcon />
                </div>
            </Link>
        </li>
    )
}

export function WorkItemsList({ albums, onHoverImage }: WorkItemsListProps) {
    const handleHover = useCallback((imageUrl: string | null) => {
        onHoverImage?.(imageUrl)
    }, [onHoverImage])

    return (
        <div className="work-wrapper">
            <ul className="work-section">
                {albums.map((album) => (
                    <WorkItem 
                        key={album.id} 
                        album={album} 
                        onMouseEnter={handleHover}
                    />
                ))}
            </ul>
        </div>
    )
}

interface HeroImageWithHoverProps {
    defaultImage: string
    currentImage: string | null
    label?: string
}

export function HeroImageWithHover({ 
    defaultImage, 
    currentImage, 
    label = 'Select Work' 
}: HeroImageWithHoverProps) {
    const imageRef = useRef<HTMLImageElement>(null)
    const displayImage = currentImage || defaultImage

    useEffect(() => {
        if (imageRef.current && currentImage) {
            // Fade effect when image changes
            imageRef.current.style.opacity = '0'
            setTimeout(() => {
                if (imageRef.current) {
                    imageRef.current.style.opacity = '1'
                }
            }, 50)
        }
    }, [currentImage])

    return (
        <div className="body-container__left">
            <img 
                ref={imageRef}
                src={displayImage} 
                alt="Selected work" 
                className="hero-image-hover"
                style={{ transition: 'opacity 0.5s ease' }}
            />
            
            {/* Corner decorations */}
            <svg className="select-work--left" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                <path d="M 18 18 L 0 18 C 9.941 18 18 9.941 18 0 Z" fill="var(--background-color-default)"></path>
            </svg>
            
            <div className="select-work">
                <p className="meta">{label}</p>
            </div>
            
            <svg className="select-work--right" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" overflow="visible">
                <path d="M 18 18 L 0 18 C 9.941 18 18 9.941 18 0 Z" fill="var(--background-color-default)"></path>
            </svg>
        </div>
    )
}

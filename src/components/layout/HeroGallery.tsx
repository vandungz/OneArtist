'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// =============================================
// Types
// =============================================

export interface MediaItem {
    url: string
    type: 'image' | 'video'
    name: string
}

interface HeroGalleryProps {
    /** Array of media items to display */
    media: MediaItem[]
    /** Label overlay text */
    label?: string
    /** Duration for images in milliseconds (default: 3000ms) */
    imageDuration?: number
}

// =============================================
// Component: Stacked Vertical Blur-Wipe Reveal
// Infinite loop - ảnh mới che dần ảnh cũ từ dưới lên
// =============================================

export function HeroGallery({
    media,
    label = 'Latest Music',
    imageDuration = 3000
}: HeroGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [animationKey, setAnimationKey] = useState(0) // Force re-trigger animation
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Animation duration matching CSS
    const animationDuration = 1200

    // Go to next item (infinite loop)
    const goToNext = useCallback(() => {
        if (media.length <= 1) return
        setCurrentIndex((prev) => (prev + 1) % media.length)
        setAnimationKey((prev) => prev + 1) // Trigger new animation
    }, [media.length])

    // Schedule next slide for images
    useEffect(() => {
        if (media.length <= 1) return

        const currentMedia = media[currentIndex]
        
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // For images: wait animation + display duration, then go next
        if (currentMedia?.type === 'image') {
            timeoutRef.current = setTimeout(() => {
                goToNext()
            }, animationDuration + imageDuration)
        }
        // For videos: handled by onEnded event

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [currentIndex, animationKey, media, imageDuration, animationDuration, goToNext])

    // Handle video ended
    const handleVideoEnded = useCallback(() => {
        goToNext()
    }, [goToNext])

    // If no media, show placeholder
    if (!media || media.length === 0) {
        return (
            <div className="body-container__left">
                <div className="hero-gallery-placeholder">
                    <p style={{ color: 'var(--text-color-muted)' }}>Hero Image</p>
                </div>
                <div className="select-work">
                    <p className="meta">{label}</p>
                </div>
            </div>
        )
    }

    // Calculate previous index for the "underneath" layer
    const prevIndex = currentIndex === 0 ? media.length - 1 : currentIndex - 1
    const currentMedia = media[currentIndex]
    const prevMedia = media[prevIndex]

    // Single image - no animation needed
    if (media.length === 1) {
        return (
            <div className="body-container__left">
                <div className="hero-gallery">
                    <div className="hero-gallery-item hero-gallery-base">
                        {currentMedia.type === 'image' ? (
                            <img
                                src={currentMedia.url}
                                alt={currentMedia.name}
                                className="hero-gallery-media"
                            />
                        ) : (
                            <video
                                src={currentMedia.url}
                                className="hero-gallery-media"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        )}
                    </div>
                </div>
                <div className="select-work">
                    <p className="meta">{label}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="body-container__left">
            <div className="hero-gallery">
                {/* Previous image (underneath layer - static) */}
                <div
                    className="hero-gallery-item hero-gallery-base"
                    style={{ zIndex: 1 }}
                >
                    {prevMedia.type === 'image' ? (
                        <img
                            src={prevMedia.url}
                            alt={prevMedia.name}
                            className="hero-gallery-media"
                        />
                    ) : (
                        <video
                            src={prevMedia.url}
                            className="hero-gallery-media"
                            muted
                            playsInline
                        />
                    )}
                </div>

                {/* Current image (top layer - animating wipe from bottom) */}
                <div
                    key={`media-${animationKey}`}
                    className="hero-gallery-item wipe-animating"
                    style={{ zIndex: 2 }}
                >
                    {currentMedia.type === 'image' ? (
                        <img
                            src={currentMedia.url}
                            alt={currentMedia.name}
                            className="hero-gallery-media"
                        />
                    ) : (
                        <video
                            src={currentMedia.url}
                            className="hero-gallery-media"
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleVideoEnded}
                        />
                    )}
                </div>

                {/* Dots indicator - only current is active */}
                <div className="hero-gallery-dots">
                    {media.map((_, index) => (
                        <span
                            key={index}
                            className={`hero-gallery-dot ${index === currentIndex ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Label overlay */}
            <div className="select-work">
                <p className="meta">{label}</p>
            </div>
        </div>
    )
}

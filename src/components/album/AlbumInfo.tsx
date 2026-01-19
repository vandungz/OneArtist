"use client"

import { useEffect, useRef, useState } from "react"

interface AlbumInfoProps {
    year: number
    featuredArtist: string
    type: string
}

export function AlbumInfo({ year, featuredArtist, type }: AlbumInfoProps) {
    const marqueeRef = useRef<HTMLSpanElement>(null)
    const [shouldMarquee, setShouldMarquee] = useState(false)

    useEffect(() => {
        const el = marqueeRef.current
        if (!el) return

        const container = el.parentElement
        if (!container) return

        const update = () => {
            setShouldMarquee(el.scrollWidth > container.clientWidth)
        }

        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [featuredArtist])

    return (
        <div className="album-info-cards">
            <div className="album-info-card">
                <p className="album-info-label">Year</p>
                <p className="album-info-value">{year}</p>
            </div>

            <div className="album-info-card album-info-card--featured">
                <p className="album-info-label">ft.</p>
                <div className="album-info-marquee">
                    <span
                        ref={marqueeRef}
                        className={`album-info-marquee-content${shouldMarquee ? " marquee-enabled" : ""}`}
                        data-text={featuredArtist}
                    >
                        {featuredArtist}
                    </span>
                </div>
            </div>

            <div className="album-info-card">
                <p className="album-info-label">Type</p>
                <p className="album-info-value">{type}</p>
            </div>
        </div>
    )
}

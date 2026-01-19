'use client'

import { useState } from 'react'
import { formatDuration } from '@/lib/utils'

interface Track {
    id: string
    title: string
    duration_seconds: number
    audio_file_url: string | null
    plays_count: number
}

interface AlbumPlayerProps {
    albumTitle: string
    coverUrl: string
    tracks: Track[]
}

export function AlbumPlayer({ albumTitle, coverUrl, tracks }: AlbumPlayerProps) {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const currentTrack = tracks[currentTrackIndex]

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
        // TODO: Implement actual audio playback
    }

    const handleNext = () => {
        if (currentTrackIndex < tracks.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1)
        }
    }

    const handlePrev = () => {
        if (currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1)
        }
    }

    return (
        <div className="album-player">
            {/* Player Header */}
            <div className="album-player-header">
                <div className="album-player-cover">
                    <img src={coverUrl} alt={albumTitle} />
                </div>
                <div className="album-player-info">
                    <h5>{albumTitle}</h5>
                    <p className="meta">Now Playing</p>
                    <p className="current-track-title">{currentTrack?.title || 'No track'}</p>
                </div>
            </div>

            {/* Player Controls */}
            <div className="album-player-controls">
                <button className="player-btn" onClick={handlePrev} disabled={currentTrackIndex === 0}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 20L9 12L19 4V20Z" fill="currentColor" />
                        <path d="M5 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <button className="player-btn play-btn" onClick={handlePlayPause}>
                    {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4H10V20H6V4Z" fill="currentColor" />
                            <path d="M14 4H18V20H14V4Z" fill="currentColor" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
                        </svg>
                    )}
                </button>
                <button className="player-btn" onClick={handleNext} disabled={currentTrackIndex === tracks.length - 1}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4L15 12L5 20V4Z" fill="currentColor" />
                        <path d="M19 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="album-player-progress">
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: '30%' }}></div>
                </div>
                <div className="progress-time">
                    <span>0:00</span>
                    <span>{currentTrack ? formatDuration(currentTrack.duration_seconds) : '0:00'}</span>
                </div>
            </div>

            {/* Track List */}
            <div className="album-track-list">
                <p className="meta track-list-title">Tracklist</p>
                <ul>
                    {tracks.map((track, index) => (
                        <li
                            key={track.id}
                            className={`track-item ${index === currentTrackIndex ? 'active' : ''}`}
                            onClick={() => setCurrentTrackIndex(index)}
                        >
                            <div className="track-info">
                                <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
                                <span className="track-title">{track.title}</span>
                            </div>
                            <span className="track-duration">{formatDuration(track.duration_seconds)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

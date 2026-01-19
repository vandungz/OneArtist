/**
 * Script để sync album data từ Spotify vào Supabase
 * 
 * Fetch trực tiếp từ Spotify embed page (không cần API credentials)
 * 
 * Cách dùng:
 * node scripts/sync-spotify-album.mjs <spotify-album-id> <album-slug>
 * 
 * Ví dụ:
 * node scripts/sync-spotify-album.mjs 0pA0C8xjH9FDn3tDJQlvpH N0L4B3L
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load .env.local
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Fetch album data từ Spotify embed page
 * API này public, không cần credentials
 */
async function fetchSpotifyData(spotifyAlbumId) {
    const embedUrl = `https://open.spotify.com/embed/album/${spotifyAlbumId}`
    
    // Fetch embed page HTML
    const response = await fetch(embedUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    })
    
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
    }
    
    const html = await response.text()
    
    // Extract JSON data từ __NEXT_DATA__ script tag
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)
    if (!match) {
        throw new Error('Could not find __NEXT_DATA__ in embed page')
    }
    
    const nextData = JSON.parse(match[1])
    const entity = nextData?.props?.pageProps?.state?.data?.entity
    
    if (!entity) {
        throw new Error('Could not extract entity data - album may not exist')
    }
    
    return entity
}

async function syncSpotifyAlbum(spotifyAlbumId, albumSlug) {
    console.log('🎵 Fetching Spotify data...')
    console.log(`   Album ID: ${spotifyAlbumId}`)
    console.log(`   Target Slug: ${albumSlug}`)
    
    try {
        const data = await fetchSpotifyData(spotifyAlbumId)
        
        const albumName = data.name || 'Unknown'
        const albumType = data.type || 'album'
        const releaseDate = data.releaseDate?.isoString || ''
        const trackList = data.trackList || []
        
        console.log(`\n Found: ${albumName}`)
        console.log(`   Type: ${albumType}`)
        console.log(`   Tracks: ${trackList.length}`)
        console.log(`   Release: ${releaseDate}`)
        
        // Parse release year
        const releaseYear = parseInt(releaseDate.split('-')[0]) || new Date().getFullYear()
        
        // Capitalize album type
        const formattedType = albumType.charAt(0).toUpperCase() + albumType.slice(1).toLowerCase()
        
        // Prepare tracks
        const tracks = trackList.map((track, index) => {
            const durationMs = track.duration || 0
            // subtitle format: "Main Artist, Featured1, Featured2"
            const subtitle = track.subtitle || ''
            const artistNames = subtitle.split(', ')
            // Lấy featured artists (bỏ artist đầu tiên - main artist)
            const featuredArtists = artistNames.slice(1).join(', ') || null
            
            return {
                title: track.title || track.name || `Track ${index + 1}`,
                track_number: index + 1,
                duration_seconds: Math.round(durationMs / 1000),
                featured_artists: featuredArtists
            }
        })
        
        console.log('\n📝 Tracks:')
        tracks.forEach(t => {
            const mins = Math.floor(t.duration_seconds / 60)
            const secs = t.duration_seconds % 60
            const feat = t.featured_artists ? ` (ft. ${t.featured_artists})` : ''
            console.log(`   ${t.track_number}. ${t.title} - ${mins}:${secs.toString().padStart(2, '0')}${feat}`)
        })
        
        // Generate SQL
        console.log('\n' + '='.repeat(60))
        console.log('📄 SQL (copy & paste vào Supabase SQL Editor):')
        console.log('='.repeat(60) + '\n')
        
        console.log('-- Update album')
        console.log(`UPDATE albums SET`)
        console.log(`    spotify_album_id = '${spotifyAlbumId}',`)
        console.log(`    release_year = ${releaseYear},`)
        console.log(`    album_type = '${formattedType}'`)
        console.log(`WHERE slug = '${albumSlug}';`)
        
        console.log('\n-- Delete old tracks')
        console.log(`DELETE FROM tracks WHERE album_id = (SELECT id FROM albums WHERE slug = '${albumSlug}');`)
        
        if (tracks.length > 0) {
            console.log('\n-- Insert new tracks')
            console.log(`INSERT INTO tracks (album_id, title, track_number, duration_seconds, featured_artists) VALUES`)
            tracks.forEach((t, i) => {
                const albumIdQuery = `(SELECT id FROM albums WHERE slug = '${albumSlug}')`
                const title = t.title.replace(/'/g, "''")
                const featuredStr = t.featured_artists ? `'${t.featured_artists.replace(/'/g, "''")}'` : 'NULL'
                const comma = i < tracks.length - 1 ? ',' : ';'
                console.log(`    (${albumIdQuery}, '${title}', ${t.track_number}, ${t.duration_seconds}, ${featuredStr})${comma}`)
            })
        }
        
        console.log('\n' + '='.repeat(60))
        
        // Direct sync option
        if (SUPABASE_URL && SUPABASE_SERVICE_KEY && process.argv.includes('--sync')) {
            console.log('\n🚀 Syncing to Supabase...')
            
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            
            // Update album
            const { error: albumError } = await supabase
                .from('albums')
                .update({
                    spotify_album_id: spotifyAlbumId,
                    release_year: releaseYear,
                    album_type: formattedType
                })
                .eq('slug', albumSlug)
            
            if (albumError) {
                console.error('❌ Album update error:', albumError.message)
                return
            }
            
            // Get album ID
            const { data: albumData } = await supabase
                .from('albums')
                .select('id')
                .eq('slug', albumSlug)
                .single()
            
            if (!albumData) {
                console.error('❌ Album not found:', albumSlug)
                return
            }
            
            // Delete old tracks
            await supabase
                .from('tracks')
                .delete()
                .eq('album_id', albumData.id)
            
            // Insert new tracks
            if (tracks.length > 0) {
                const { error: tracksError } = await supabase
                    .from('tracks')
                    .insert(tracks.map(t => ({
                        album_id: albumData.id,
                        title: t.title,
                        track_number: t.track_number,
                        duration_seconds: t.duration_seconds,
                        featured_artists: t.featured_artists
                    })))
                
                if (tracksError) {
                    console.error('❌ Tracks insert error:', tracksError.message)
                    return
                }
            }
            
            console.log('✅ Synced successfully!')
        } else if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
            console.log('\n💡 Thêm --sync để sync trực tiếp vào Supabase')
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message || error)
    }
}

// CLI
const args = process.argv.slice(2).filter(a => !a.startsWith('--'))
if (args.length < 2) {
    console.log('🎵 Spotify Album Sync Tool')
    console.log('')
    console.log('Usage:')
    console.log('  node scripts/sync-spotify-album.mjs <spotify-album-id> <album-slug> [--sync]')
    console.log('')
    console.log('Examples:')
    console.log('  node scripts/sync-spotify-album.mjs 0pA0C8xjH9FDn3tDJQlvpH N0L4B3L')
    console.log('  node scripts/sync-spotify-album.mjs 0pA0C8xjH9FDn3tDJQlvpH N0L4B3L --sync')
    console.log('')
    console.log('Spotify Album ID lấy từ URL:')
    console.log('  https://open.spotify.com/album/0pA0C8xjH9FDn3tDJQlvpH')
    console.log('                              ^^^^^^^^^^^^^^^^^^^^^^')
    process.exit(1)
}

// Extract ID từ URL nếu user paste cả URL
let albumId = args[0]
if (albumId.includes('spotify.com/album/')) {
    albumId = albumId.split('/album/')[1]?.split('?')[0] || albumId
}

syncSpotifyAlbum(albumId, args[1])

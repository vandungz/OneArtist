/**
 * Script để sync album data từ Spotify vào Supabase
 * 
 * Sử dụng package spotify-url-info (không cần API credentials)
 * 
 * Cách dùng:
 * 1. npm install spotify-url-info
 * 2. npx ts-node scripts/sync-spotify-album.ts <spotify-album-url> <album-slug>
 * 
 * Ví dụ:
 * npx ts-node scripts/sync-spotify-album.ts https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3 N0L4B3L
 */

import { getData, getPreview } from 'spotify-url-info'
import { createClient } from '@supabase/supabase-js'

// Supabase config - lấy từ .env.local
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service key để write

interface SpotifyTrack {
    name: string
    duration_ms: number
    track_number: number
    artists: { name: string }[]
}

interface SpotifyAlbumData {
    name: string
    release_date: string
    album_type: string
    total_tracks: number
    artists: { name: string }[]
    tracks: {
        items: SpotifyTrack[]
    }
    images: { url: string }[]
    id: string
}

async function syncSpotifyAlbum(spotifyUrl: string, albumSlug: string) {
    console.log('🎵 Fetching Spotify data...')
    
    try {
        // Lấy data từ Spotify (không cần API key)
        const data = await getData(spotifyUrl) as SpotifyAlbumData
        
        console.log(`✅ Found: ${data.name}`)
        console.log(`   Type: ${data.album_type}`)
        console.log(`   Tracks: ${data.total_tracks}`)
        console.log(`   Release: ${data.release_date}`)
        
        // Extract Spotify Album ID từ URL hoặc data
        const spotifyAlbumId = data.id || spotifyUrl.split('/album/')[1]?.split('?')[0]
        
        // Parse release year
        const releaseYear = parseInt(data.release_date.split('-')[0])
        
        // Get album type (capitalize)
        const albumType = data.album_type.charAt(0).toUpperCase() + data.album_type.slice(1)
        
        // Get main artist và featured artists
        const mainArtist = data.artists[0]?.name || 'Unknown'
        
        // Prepare tracks data
        const tracks = data.tracks.items.map((track, index) => ({
            title: track.name,
            track_number: track.track_number || index + 1,
            duration_seconds: Math.round(track.duration_ms / 1000),
            featured_artists: track.artists
                .slice(1) // Bỏ main artist
                .map(a => a.name)
                .join(', ') || null
        }))
        
        console.log('\n📝 Tracks:')
        tracks.forEach(t => {
            const mins = Math.floor(t.duration_seconds / 60)
            const secs = t.duration_seconds % 60
            console.log(`   ${t.track_number}. ${t.title} (${mins}:${secs.toString().padStart(2, '0')})${t.featured_artists ? ` ft. ${t.featured_artists}` : ''}`)
        })
        
        // Generate SQL
        console.log('\n📄 Generated SQL:\n')
        console.log('-- Update album with Spotify data')
        console.log(`UPDATE albums SET`)
        console.log(`    spotify_album_id = '${spotifyAlbumId}',`)
        console.log(`    release_year = ${releaseYear},`)
        console.log(`    album_type = '${albumType}'`)
        console.log(`WHERE slug = '${albumSlug}';`)
        
        console.log('\n-- Delete old tracks and insert new ones')
        console.log(`DELETE FROM tracks WHERE album_id = (SELECT id FROM albums WHERE slug = '${albumSlug}');`)
        console.log('')
        console.log(`INSERT INTO tracks (album_id, title, track_number, duration_seconds, featured_artists)`)
        console.log(`SELECT id, title, track_number, duration_seconds, featured_artists`)
        console.log(`FROM albums, (VALUES`)
        tracks.forEach((t, i) => {
            const featuredStr = t.featured_artists ? `'${t.featured_artists}'` : 'NULL'
            const comma = i < tracks.length - 1 ? ',' : ''
            console.log(`    ('${t.title.replace(/'/g, "''")}', ${t.track_number}, ${t.duration_seconds}, ${featuredStr})${comma}`)
        })
        console.log(`) AS t(title, track_number, duration_seconds, featured_artists)`)
        console.log(`WHERE albums.slug = '${albumSlug}';`)
        
        // Option: Insert directly to Supabase
        if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
            console.log('\n🚀 Syncing to Supabase...')
            
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            
            // Update album
            const { error: albumError } = await supabase
                .from('albums')
                .update({
                    spotify_album_id: spotifyAlbumId,
                    release_year: releaseYear,
                    album_type: albumType
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
            
            console.log('✅ Synced successfully!')
        }
        
    } catch (error) {
        console.error('❌ Error:', error)
    }
}

// CLI
const args = process.argv.slice(2)
if (args.length < 2) {
    console.log('Usage: npx ts-node scripts/sync-spotify-album.ts <spotify-url> <album-slug>')
    console.log('Example: npx ts-node scripts/sync-spotify-album.ts https://open.spotify.com/album/xxx N0L4B3L')
    process.exit(1)
}

syncSpotifyAlbum(args[0], args[1])

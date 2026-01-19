// Debug script để xem cấu trúc data từ Spotify embed
const albumId = '2hgVMYqpIpRgvCEYNa3N7i' // N0L4B3L real ID

fetch(`https://open.spotify.com/embed/album/${albumId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
})
.then(r => r.text())
.then(html => {
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)
    if (!match) {
        console.log('No __NEXT_DATA__ found')
        // Try to find any JSON-like data
        const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g)
        console.log('Found scripts:', scripts?.length)
        return
    }
    
    const data = JSON.parse(match[1])
    console.log('pageProps keys:', Object.keys(data.props?.pageProps || {}))
    
    // Look for entity in different paths
    const pp = data.props?.pageProps
    if (pp) {
        console.log('\nSearching for entity data...')
        const findEntity = (obj, path = '') => {
            if (!obj || typeof obj !== 'object') return
            if (obj.name && obj.trackList) {
                console.log(`Found at ${path}:`, { name: obj.name, tracks: obj.trackList?.length })
            }
            if (obj.name && obj.tracks) {
                console.log(`Found at ${path}:`, { name: obj.name, tracks: obj.tracks?.items?.length || obj.tracks?.length })
            }
            for (const key of Object.keys(obj)) {
                findEntity(obj[key], `${path}.${key}`)
            }
        }
        findEntity(pp)
        
        // Print full structure for analysis
        console.log('\nFull pageProps structure:')
        console.log(JSON.stringify(pp, null, 2).slice(0, 3000))
    }
})
.catch(err => console.error('Error:', err))

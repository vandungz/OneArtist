-- =============================================
-- ALBUMS TABLE - Hybrid Supabase + Spotify
-- =============================================
-- Chạy SQL này trong Supabase Dashboard > SQL Editor

-- Drop existing tables if you want to start fresh (BE CAREFUL!)
-- DROP TABLE IF EXISTS album_tracks CASCADE;
-- DROP TABLE IF EXISTS albums CASCADE;

-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Spotify integration
    spotify_album_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Custom data (manual input)
    bio TEXT,                                    -- Mô tả album do bạn viết
    custom_cover_url TEXT,                       -- Override cover từ Spotify (optional)
    youtube_video_id VARCHAR(20),                -- Video bài hát nổi bật
    
    -- Display settings
    is_featured BOOLEAN DEFAULT false,           -- Hiển thị trên homepage
    display_order INTEGER DEFAULT 0,             -- Thứ tự hiển thị
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_albums_spotify_id ON albums(spotify_album_id);
CREATE INDEX IF NOT EXISTS idx_albums_featured ON albums(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_albums_display_order ON albums(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read albums (public website)
CREATE POLICY "Albums are publicly readable" 
ON albums FOR SELECT 
USING (true);

-- Policy: Only authenticated users can modify (for future admin panel)
CREATE POLICY "Only authenticated users can insert albums" 
ON albums FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update albums" 
ON albums FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete albums" 
ON albums FOR DELETE 
TO authenticated 
USING (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_albums_updated_at ON albums;
CREATE TRIGGER update_albums_updated_at
    BEFORE UPDATE ON albums
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT SAMPLE DATA (MCK's Albums)
-- =============================================
-- Bạn có thể thay đổi spotify_album_id bằng ID thật của MCK

INSERT INTO albums (spotify_album_id, bio, youtube_video_id, is_featured, display_order) VALUES
(
    '4VWqZjNrPgVan0fTUvgPsD',  -- Thay bằng Spotify Album ID thật
    'Album đánh dấu sự trở lại mạnh mẽ với những bản rap đậm chất cá nhân, kể về hành trình âm nhạc độc lập không nhãn hàng.',
    'dQw4w9WgXcQ',              -- Thay bằng YouTube video ID thật
    true,
    1
),
(
    '2noRn2Aes5aoNVsU6iWThc',  -- Thay bằng Spotify Album ID thật
    'Một hành trình âm nhạc đầy cảm xúc, đưa người nghe vào thế giới mộng mơ với những giai điệu du dương và lời rap sâu lắng.',
    'dQw4w9WgXcQ',              -- Thay bằng YouTube video ID thật
    true,
    2
)
ON CONFLICT (spotify_album_id) DO NOTHING;

-- =============================================
-- VERIFY: Check inserted data
-- =============================================
-- SELECT * FROM albums;

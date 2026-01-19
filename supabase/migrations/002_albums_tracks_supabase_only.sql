-- =============================================
-- ALBUMS & TRACKS TABLES - Supabase Only
-- =============================================
-- Chạy SQL này trong Supabase Dashboard > SQL Editor

-- Drop existing tables to recreate with new schema
-- QUAN TRỌNG: Chạy dòng này nếu bảng cũ đã tồn tại
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS albums CASCADE;

-- =============================================
-- ALBUMS TABLE
-- =============================================
CREATE TABLE albums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,          -- URL-friendly identifier
    bio TEXT,                                    -- Mô tả album
    
    -- Release Info
    release_year INTEGER NOT NULL,
    album_type VARCHAR(50) DEFAULT 'Album',     -- Album, Single, EP, Mixtape
    genre VARCHAR(100),                          -- Hip-Hop, R&B, Pop, etc.
    
    -- Featured Artists
    featured_artists TEXT,                       -- Comma-separated: "Obito, Lil Wuyn"
    
    -- Media
    cover_url TEXT,                              -- Ảnh cover từ Supabase Storage
    youtube_video_id VARCHAR(20),                -- Video bài hát nổi bật
    spotify_album_id VARCHAR(30),                -- Spotify Album ID cho embed player
    spotify_url TEXT,                            -- Link đến Spotify (optional)
    
    -- Display Settings
    is_featured BOOLEAN DEFAULT false,           -- Hiển thị trên homepage
    display_order INTEGER DEFAULT 0,             -- Thứ tự hiển thị
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRACKS TABLE
-- =============================================
CREATE TABLE tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    
    -- Track Info
    title VARCHAR(255) NOT NULL,
    track_number INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    
    -- Featured Artists (nếu khác với album)
    featured_artists TEXT,
    
    -- Media (optional - nếu có audio preview)
    audio_preview_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint: mỗi album chỉ có 1 track với số thứ tự nhất định
    UNIQUE(album_id, track_number)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_albums_slug ON albums(slug);
CREATE INDEX IF NOT EXISTS idx_albums_featured ON albums(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_albums_display_order ON albums(display_order);
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_order ON tracks(album_id, track_number);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Albums are publicly readable" ON albums FOR SELECT USING (true);
CREATE POLICY "Tracks are publicly readable" ON tracks FOR SELECT USING (true);

-- Authenticated write access (for future admin panel)
CREATE POLICY "Auth users can insert albums" ON albums FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update albums" ON albums FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete albums" ON albums FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert tracks" ON tracks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update tracks" ON tracks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete tracks" ON tracks FOR DELETE TO authenticated USING (true);

-- =============================================
-- AUTO UPDATE TIMESTAMP
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_albums_updated_at ON albums;
CREATE TRIGGER update_albums_updated_at
    BEFORE UPDATE ON albums
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA - MCK Albums
-- =============================================
-- 4 Albums chính: N0L4B3L, 99%, MONGYU, TAIVISAO

INSERT INTO albums (title, slug, bio, release_year, album_type, genre, featured_artists, youtube_video_id, is_featured, display_order) VALUES
(
    'N0L4B3L',
    'N0L4B3L',
    'Album thể hiện tinh thần độc lập, không cần nhãn hàng. MCK khẳng định cá tính âm nhạc riêng biệt.',
    2023,
    'Album',
    'Hip-Hop / Rap',
    NULL,
    NULL,
    true,
    1
),
(
    '99%',
    '99-percent',
    'Album thể hiện 99% những gì còn dang dở, những suy nghĩ chưa trọn vẹn nhưng đầy chân thực.',
    2021,
    'Album',
    'Hip-Hop / Rap',
    'Wxrdie, tlinh',
    NULL,
    true,
    2
),
(
    'MỘNG YU',
    'MONGYU',
    'Một hành trình âm nhạc đầy cảm xúc, đưa người nghe vào thế giới mộng mơ với những giai điệu du dương.',
    2022,
    'Album',
    'Hip-Hop / R&B',
    'Obito, Lil Wuyn',
    NULL,
    true,
    3
),
(
    'TẠI VÌ SAO',
    'TAIVISAO',
    'Những câu hỏi không có lời đáp, những trăn trở của tuổi trẻ được thể hiện qua từng câu rap đầy ý nghĩa.',
    2020,
    'Single',
    'Hip-Hop / Rap',
    NULL,
    NULL,
    true,
    4
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SAMPLE TRACKS
-- =============================================
-- Thêm tracks cho 4 albums: N0L4B3L, 99%, MONGYU, TAIVISAO

DO $$
DECLARE
    album_n0l4b3l_id UUID;
    album_99_id UUID;
    album_mongyu_id UUID;
    album_taivisao_id UUID;
BEGIN
    -- Lấy ID của albums
    SELECT id INTO album_n0l4b3l_id FROM albums WHERE slug = 'N0L4B3L';
    SELECT id INTO album_99_id FROM albums WHERE slug = '99-percent';
    SELECT id INTO album_mongyu_id FROM albums WHERE slug = 'MONGYU';
    SELECT id INTO album_taivisao_id FROM albums WHERE slug = 'TAIVISAO';
    
    -- Insert tracks cho album N0L4B3L
    IF album_n0l4b3l_id IS NOT NULL THEN
        INSERT INTO tracks (album_id, title, track_number, duration_seconds, featured_artists) VALUES
        (album_n0l4b3l_id, 'Intro', 1, 60, NULL),
        (album_n0l4b3l_id, 'N0L4B3L', 2, 210, NULL),
        (album_n0l4b3l_id, 'Độc Lập', 3, 195, NULL),
        (album_n0l4b3l_id, 'Không Cần Ai', 4, 240, NULL),
        (album_n0l4b3l_id, 'Outro', 5, 90, NULL)
        ON CONFLICT (album_id, track_number) DO NOTHING;
    END IF;
    
    -- Insert tracks cho album 99%
    IF album_99_id IS NOT NULL THEN
        INSERT INTO tracks (album_id, title, track_number, duration_seconds, featured_artists) VALUES
        (album_99_id, 'Intro 99%', 1, 45, NULL),
        (album_99_id, '99%', 2, 230, NULL),
        (album_99_id, 'Crying Over You', 3, 215, 'tlinh'),
        (album_99_id, 'Cuối Cùng', 4, 200, NULL)
        ON CONFLICT (album_id, track_number) DO NOTHING;
    END IF;

    -- Insert tracks cho album MỘNG YU
    IF album_mongyu_id IS NOT NULL THEN
        INSERT INTO tracks (album_id, title, track_number, duration_seconds, featured_artists) VALUES
        (album_mongyu_id, 'Mộng Yu', 1, 220, NULL),
        (album_mongyu_id, 'Giấc Mơ', 2, 200, 'Obito'),
        (album_mongyu_id, 'Đêm Nay', 3, 195, 'Lil Wuyn')
        ON CONFLICT (album_id, track_number) DO NOTHING;
    END IF;

    -- Insert tracks cho album TẠI VÌ SAO (Single - 1 track)
    IF album_taivisao_id IS NOT NULL THEN
        INSERT INTO tracks (album_id, title, track_number, duration_seconds, featured_artists) VALUES
        (album_taivisao_id, 'Tại Vì Sao', 1, 240, NULL)
        ON CONFLICT (album_id, track_number) DO NOTHING;
    END IF;
END $$;

-- =============================================
-- VERIFY DATA
-- =============================================
-- SELECT * FROM albums;
-- SELECT a.title as album, t.track_number, t.title as track FROM albums a JOIN tracks t ON a.id = t.album_id ORDER BY a.title, t.track_number;

-- =============================================
-- Migration: Low G Data - Clean Setup
-- =============================================
-- Chạy SQL này trong Supabase Dashboard > SQL Editor
-- Migration này sẽ:
-- 1. Xóa table tracks (không cần thiết khi có Spotify embed)
-- 2. Xóa data albums cũ (MCK)
-- 3. Insert data mới cho Low G

-- =============================================
-- STEP 1: DROP TRACKS TABLE
-- =============================================
-- Table tracks không cần thiết vì:
-- - Đã có Spotify embed hiển thị toàn bộ tracks
-- - Giảm complexity cho database
DROP TABLE IF EXISTS tracks CASCADE;

-- =============================================
-- STEP 2: CLEAR OLD ALBUM DATA
-- =============================================
DELETE FROM albums;

-- =============================================
-- STEP 3: CLEAR OLD ARTIST DATA & INSERT LOW G
-- =============================================
DELETE FROM artists;

INSERT INTO artists (name, bio, avatar_url) VALUES (
    'Low G',
    'Low G is a rapper, songwriter and dancer. His real name is Nguyen Hoang Long. He was born in 1997 in Hanoi, Vietnam. First, he was a dancer from Last Fire Crew, a very popular dance crew in the Vietnamese hip-hop community. Then, he tried rapping for fun and released his songs on Youtube. One day, they became viral on the Internet, which made Low G become famous and start his career as a rapper. Now he is in two rap teams named "Rap Nhà Làm" and "Nhà Hoá Học Đống Đa"; and he is the most renowned member.

Low G is well-known for being flexible to many different genres from Pop to Hip-hop. He is also good at mixing US & UK rap style with Vietnamese culture, making it interesting to listeners. People love his unique vocal, smooth rap flows and creative lyricism. His bars are catchy, funny; his wordplays are unpredictable; and his beats are fresh to Vietnamese audience. All of these factors give him a unique personality in music and make his songs go viral.',
    'avatars/profile.jpg'
);

-- =============================================
-- STEP 4: INSERT LOW G ALBUMS/EP/SINGLES
-- =============================================
-- Sử dụng chung table albums cho tất cả: Album, EP, Single
-- Phân biệt bằng field album_type

INSERT INTO albums (
    title, 
    slug, 
    bio, 
    release_year, 
    album_type, 
    genre, 
    featured_artists, 
    cover_url,
    youtube_video_id, 
    spotify_album_id,
    spotify_url,
    is_featured, 
    display_order
) VALUES 
-- 1. L2K (Album - 2025)
(
    'L2K',
    'l2k',
    'Album đầu tay của Low G, đánh dấu bước chuyển mình trong sự nghiệp âm nhạc. L2K là viết tắt của "Low 2K" - thể hiện sự kết hợp giữa cá tính Low G và thế hệ 2K.',
    2025,
    'Album',
    'Hip-Hop/R&B',
    '52Hz, tlinh, My Anh, Hoàng Tôn, JustaTee',
    'covers/l2k.jpg',
    'tj4k33OMkC4',
    '1x5AiQ50WfsWCryL3zvdLx',
    'https://open.spotify.com/album/1x5AiQ50WfsWCryL3zvdLx',
    true,
    1
),
-- 2. Đừng Để Tiền Rơi Special Version (Single - 2025)
(
    'Đừng Để Tiền Rơi (Special Version)',
    'dung-de-tien-roi-special',
    'Phiên bản đặc biệt của hit viral "Đừng Để Tiền Rơi", kết hợp cùng Anh Phan mang đến làn gió mới cho bản nhạc.',
    2025,
    'Single',
    'Hip-Hop',
    'Anh Phan',
    'covers/dung-de-tien-roi.jpg',
    'IGHBSyXKZ8Y',
    '49tSv7hKDXNgNB9fgR5WIR',
    'https://open.spotify.com/album/49tSv7hKDXNgNB9fgR5WIR',
    true,
    2
),
-- 3. Tán Gái Phòng Trà (EP - 2023)
(
    'Tán Gái Phòng Trà',
    'tan-gai-phong-tra',
    'EP mang phong cách vintage, lấy cảm hứng từ những quán phòng trà Hà Nội xưa. Low G thể hiện khả năng linh hoạt khi kết hợp nhạc retro với rap hiện đại.',
    2023,
    'EP',
    'Retro/Hip-Hop',
    NULL,
    'covers/tan-gai-phong-tra.jpg',
    'IfH9POevkC4',
    '2t03OenCM8hPX9sCDvII6h',
    'https://open.spotify.com/album/2t03OenCM8hPX9sCDvII6h',
    true,
    3
),
-- 4. Càng Cua (Single - 2022)
(
    'Càng Cua',
    'cang-cua',
    'Single viral đánh dấu tên tuổi Low G trong cộng đồng Hip-Hop Việt Nam. Bài hát với beat catchy và lyrics hài hước đã thu hút hàng triệu lượt nghe.',
    2022,
    'Single',
    'Hip-Hop',
    NULL,
    'covers/cang-cua.jpg',
    'yZW8jzWb5yA',
    '3qVvdnE9SRtwvl5PQPmJFm',
    'https://open.spotify.com/album/3qVvdnE9SRtwvl5PQPmJFm',
    true,
    4
);

-- =============================================
-- VERIFY DATA
-- =============================================
SELECT 'Artists:' as info;
SELECT id, name FROM artists;

SELECT 'Albums/EPs/Singles:' as info;
SELECT title, album_type, release_year, spotify_album_id, is_featured, display_order 
FROM albums 
ORDER BY display_order;

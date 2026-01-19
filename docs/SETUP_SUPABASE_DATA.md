# Hướng dẫn Setup Supabase-Only Data System

## 1. Chạy SQL Migration trên Supabase

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)
4. Click **"New query"**
5. Copy nội dung từ file `supabase/migrations/002_albums_tracks_supabase_only.sql`
6. Paste vào editor và click **"Run"**

## 2. Cấu trúc Database

### Bảng `albums`
| Cột | Mô tả |
|-----|-------|
| `id` | UUID tự động |
| `title` | Tên album |
| `slug` | URL-friendly (vd: `99-percent`) |
| `bio` | Mô tả album |
| `release_year` | Năm phát hành |
| `album_type` | Album, Single, EP, Mixtape |
| `genre` | Thể loại nhạc |
| `featured_artists` | Nghệ sĩ feat (comma-separated) |
| `cover_url` | URL ảnh cover |
| `youtube_video_id` | ID video YouTube |
| `spotify_url` | Link Spotify (optional) |
| `is_featured` | Hiển thị trên homepage |
| `display_order` | Thứ tự hiển thị |

### Bảng `tracks`
| Cột | Mô tả |
|-----|-------|
| `id` | UUID tự động |
| `album_id` | FK đến albums |
| `title` | Tên bài hát |
| `track_number` | Số thứ tự trong album |
| `duration_seconds` | Thời lượng (giây) |
| `featured_artists` | Nghệ sĩ feat (nếu có) |
| `audio_preview_url` | URL audio preview (optional) |

## 3. Thêm Album mới

### Bước 1: Thêm album vào Supabase

Chạy SQL trong Supabase SQL Editor:

```sql
INSERT INTO albums (title, slug, bio, release_year, album_type, genre, featured_artists, youtube_video_id, is_featured, display_order) 
VALUES (
    'Tên Album',                    -- title
    'ten-album',                    -- slug (URL-friendly, không dấu, dùng dấu -)
    'Mô tả về album...',           -- bio
    2024,                           -- release_year
    'Album',                        -- album_type: Album, Single, EP, Mixtape
    'Hip-Hop / Rap',               -- genre
    'Obito, tlinh',                -- featured_artists (hoặc NULL)
    'abc123xyz',                    -- youtube_video_id (phần sau v= trong URL YouTube)
    true,                           -- is_featured (hiển thị trên homepage)
    1                               -- display_order (thứ tự)
);
```

### Bước 2: Thêm tracks

```sql
-- Lấy ID của album vừa tạo
DO $$
DECLARE
    album_id UUID;
BEGIN
    SELECT id INTO album_id FROM albums WHERE slug = 'ten-album';
    
    INSERT INTO tracks (album_id, title, track_number, duration_seconds, featured_artists) VALUES
    (album_id, 'Intro', 1, 60, NULL),
    (album_id, 'Bài hát 2', 2, 210, 'Obito'),
    (album_id, 'Bài hát 3', 3, 195, NULL),
    (album_id, 'Outro', 4, 90, NULL);
END $$;
```

## 4. Upload ảnh Cover

1. Vào Supabase Dashboard → **Storage**
2. Tạo bucket `artist_assets` (nếu chưa có)
3. Upload ảnh vào folder `covers/`
4. Copy public URL và cập nhật vào album:

```sql
UPDATE albums 
SET cover_url = 'https://your-project.supabase.co/storage/v1/object/public/artist_assets/covers/album-cover.jpg'
WHERE slug = 'ten-album';
```

## 5. Cách lấy YouTube Video ID

Link YouTube: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
→ Video ID: `dQw4w9WgXcQ` (phần sau `v=`)

## 6. Test

1. Chạy dev server: `npm run dev`
2. Truy cập: `http://localhost:3000/albums/ten-album`

## 7. Cấu trúc URL

- Homepage: `/`
- Album detail: `/albums/{slug}`

Ví dụ:
- `/albums/nger`
- `/albums/99-percent`
- `/albums/chim-sau`

## Troubleshooting

### Album không hiển thị
1. Kiểm tra `is_featured = true` trong database
2. Kiểm tra console browser có lỗi gì không
3. Kiểm tra Supabase RLS policies

### Ảnh không load
1. Kiểm tra bucket Storage đã public chưa
2. Kiểm tra URL cover_url đúng chưa

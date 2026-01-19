-- =============================================
-- Migration: Add RLS Policy for Artists Table
-- =============================================
-- Chạy SQL này trong Supabase Dashboard > SQL Editor
-- Fix lỗi: "The result contains 0 rows" khi fetch artists

-- Enable RLS on artists table (nếu chưa enable)
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Add public read policy cho artists
CREATE POLICY "Artists are publicly readable" 
ON artists 
FOR SELECT 
USING (true);

-- Add authenticated write policies (cho admin panel tương lai)
CREATE POLICY "Auth users can insert artists" 
ON artists 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Auth users can update artists" 
ON artists 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Auth users can delete artists" 
ON artists 
FOR DELETE 
TO authenticated 
USING (true);

-- Verify
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'artists';

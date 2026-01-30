-- =============================================
-- Migration: Create Awards Table
-- Description: Table for storing artist awards and recognitions
-- =============================================

-- Create awards table
CREATE TABLE IF NOT EXISTS public.awards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,  -- e.g., 'Tutting', 'Gloving', 'Dance', 'Music', etc.
    year INTEGER NOT NULL,
    url TEXT,  -- Link to the award/event (YouTube, article, etc.)
    description TEXT,  -- Optional description
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_awards_artist_id ON public.awards(artist_id);
CREATE INDEX IF NOT EXISTS idx_awards_year ON public.awards(year DESC);
CREATE INDEX IF NOT EXISTS idx_awards_display_order ON public.awards(display_order);

-- Enable RLS
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for awards table
-- Policy: Allow public read access
CREATE POLICY "Allow public read access for awards"
ON public.awards
FOR SELECT
USING (true);

-- Policy: Allow authenticated users to insert/update/delete (for admin purposes)
CREATE POLICY "Allow authenticated users to manage awards"
ON public.awards
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_awards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_awards_updated_at
    BEFORE UPDATE ON public.awards
    FOR EACH ROW
    EXECUTE FUNCTION update_awards_updated_at();

-- =============================================
-- Insert Sample Data (for LowG artist)
-- =============================================

-- Get the first artist (LowG) and insert awards
DO $$
DECLARE
    v_artist_id UUID;
BEGIN
    -- Get the artist ID
    SELECT id INTO v_artist_id FROM public.artists LIMIT 1;
    
    IF v_artist_id IS NOT NULL THEN
        -- Insert sample awards
        INSERT INTO public.awards (artist_id, title, type, year, url, display_order) VALUES
        (v_artist_id, 'Sacred Dimension', 'Tutting', 2025, 'https://afamily.vn/chu-toa-rap-viet-sang-nhat-thi-choi-ma-rinh-luon-giai-vo-dich-nghe-co-nay-khong-thang-moi-la-2025040211033426.chn', 1),
        (v_artist_id, 'A COLORS SHOW', 'Youtube', 2024, 'https://www.youtube.com/watch?v=VNJsyFMUR3Y', 2),
        (v_artist_id, 'Infinity Battle (1vs1)', 'Tutting', 2019, 'https://www.youtube.com/watch?v=OLeZN-w2fRs', 3),
        (v_artist_id, 'Lights On', 'Gloving', 2018, 'https://www.youtube.com/watch?v=wH5KQ-D_HpQ', 4);
    END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON public.awards TO anon;
GRANT SELECT ON public.awards TO authenticated;
GRANT ALL ON public.awards TO service_role;

-- Comment on table
COMMENT ON TABLE public.awards IS 'Awards and recognitions for artists';
COMMENT ON COLUMN public.awards.title IS 'Award/Event name';
COMMENT ON COLUMN public.awards.type IS 'Category of award (Tutting, Gloving, Music, etc.)';
COMMENT ON COLUMN public.awards.year IS 'Year the award was received';
COMMENT ON COLUMN public.awards.url IS 'External link to the award/event';

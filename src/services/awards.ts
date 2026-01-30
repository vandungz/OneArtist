import { createClient } from '@/lib/supabase/server'

// =============================================
// Types cho Awards
// =============================================

export interface AwardData {
    id: string
    title: string
    type: string
    year: number
    url: string | null
    description: string | null
}

// =============================================
// Award Functions
// =============================================

/**
 * Lấy tất cả awards của artist chính
 * Sắp xếp theo display_order và year (mới nhất trước)
 */
export async function getAwards(): Promise<AwardData[]> {
    const supabase = await createClient()

    const { data: awards, error } = await supabase
        .from('awards')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('year', { ascending: false })

    if (error) {
        console.error('Error fetching awards:', error)
        return []
    }

    return awards.map(transformAward)
}

/**
 * Lấy awards theo artist ID
 */
export async function getAwardsByArtistId(artistId: string): Promise<AwardData[]> {
    const supabase = await createClient()

    const { data: awards, error } = await supabase
        .from('awards')
        .select('*')
        .eq('artist_id', artistId)
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('year', { ascending: false })

    if (error) {
        console.error('Error fetching awards by artist:', error)
        return []
    }

    return awards.map(transformAward)
}

/**
 * Lấy award theo ID
 */
export async function getAwardById(id: string): Promise<AwardData | null> {
    const supabase = await createClient()

    const { data: award, error } = await supabase
        .from('awards')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !award) {
        console.error('Error fetching award by id:', error)
        return null
    }

    return transformAward(award)
}

// =============================================
// Helper Functions
// =============================================

interface AwardRow {
    id: string
    artist_id: string | null
    title: string
    type: string
    year: number
    url: string | null
    description: string | null
    display_order: number
    is_featured: boolean
    created_at: string
    updated_at: string
}

/**
 * Transform database award to UI-friendly format
 */
function transformAward(award: AwardRow): AwardData {
    return {
        id: award.id,
        title: award.title,
        type: award.type,
        year: award.year,
        url: award.url,
        description: award.description
    }
}

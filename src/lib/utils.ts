import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes với clsx
 * Giúp tránh class conflicts khi kết hợp nhiều className
 * 
 * @example
 * cn('px-4 py-2', 'bg-blue-500', isActive && 'bg-blue-700')
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format thời gian từ giây sang dạng mm:ss
 * 
 * @example
 * formatDuration(125) // '2:05'
 * formatDuration(65) // '1:05'
 */
export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Format ngày tháng sang dạng readable
 * 
 * @example
 * formatDate('2024-12-25') // 'Dec 25, 2024'
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

/**
 * Tạo Supabase Storage public URL từ bucket và path
 * 
 * @example
 * getStorageUrl('artist_assets', 'covers/album1.jpg')
 */
export function getStorageUrl(bucket: string, path: string): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Truncate text với ellipsis
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}

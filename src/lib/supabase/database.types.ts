/**
 * TypeScript definitions cho Supabase Database Schema
 * Supabase-only approach - không phụ thuộc Spotify API
 * 
 * Tables:
 * - artists: Thông tin nghệ sĩ
 * - albums: Danh sách album (full data)
 * - tracks: Các bài hát trong album
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            artists: {
                Row: {
                    id: string
                    name: string
                    bio: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    bio?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    bio?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            albums: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    bio: string | null
                    release_year: number
                    album_type: string
                    genre: string | null
                    featured_artists: string | null
                    cover_url: string | null
                    youtube_video_id: string | null
                    spotify_album_id: string | null
                    spotify_url: string | null
                    is_featured: boolean
                    display_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    bio?: string | null
                    release_year: number
                    album_type?: string
                    genre?: string | null
                    featured_artists?: string | null
                    cover_url?: string | null
                    youtube_video_id?: string | null
                    spotify_album_id?: string | null
                    spotify_url?: string | null
                    is_featured?: boolean
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    bio?: string | null
                    release_year?: number
                    album_type?: string
                    genre?: string | null
                    featured_artists?: string | null
                    cover_url?: string | null
                    youtube_video_id?: string | null
                    spotify_album_id?: string | null
                    spotify_url?: string | null
                    is_featured?: boolean
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            // NOTE: Table 'tracks' đã được loại bỏ
            // Lý do: Sử dụng Spotify Embed để hiển thị tracks
            // Tất cả sản phẩm (Album, EP, Single) đều lưu trong table 'albums'
            // Phân biệt bằng field 'album_type'
            
            awards: {
                Row: {
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
                Insert: {
                    id?: string
                    artist_id?: string | null
                    title: string
                    type: string
                    year: number
                    url?: string | null
                    description?: string | null
                    display_order?: number
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    artist_id?: string | null
                    title?: string
                    type?: string
                    year?: number
                    url?: string | null
                    description?: string | null
                    display_order?: number
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "awards_artist_id_fkey"
                        columns: ["artist_id"]
                        isOneToOne: false
                        referencedRelation: "artists"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Alias types for easier usage
export type Artist = Database['public']['Tables']['artists']['Row']
export type Album = Database['public']['Tables']['albums']['Row']
export type Award = Database['public']['Tables']['awards']['Row']

export type InsertArtist = Database['public']['Tables']['artists']['Insert']
export type InsertAlbum = Database['public']['Tables']['albums']['Insert']
export type InsertAward = Database['public']['Tables']['awards']['Insert']

export type UpdateArtist = Database['public']['Tables']['artists']['Update']
export type UpdateAlbum = Database['public']['Tables']['albums']['Update']
export type UpdateAward = Database['public']['Tables']['awards']['Update']

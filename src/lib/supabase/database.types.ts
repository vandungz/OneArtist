/**
 * TypeScript definitions cho Supabase Database Schema
 * Được generate dựa trên ERD trong Architecture Design Document
 * 
 * Tables:
 * - artists: Thông tin nghệ sĩ
 * - albums: Danh sách album
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
                    artist_id: string
                    title: string
                    release_date: string | null
                    cover_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    artist_id: string
                    title: string
                    release_date?: string | null
                    cover_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    artist_id?: string
                    title?: string
                    release_date?: string | null
                    cover_url?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'albums_artist_id_fkey'
                        columns: ['artist_id']
                        isOneToOne: false
                        referencedRelation: 'artists'
                        referencedColumns: ['id']
                    }
                ]
            }
            tracks: {
                Row: {
                    id: string
                    album_id: string
                    title: string
                    duration_seconds: number
                    audio_file_url: string | null
                    plays_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    album_id: string
                    title: string
                    duration_seconds: number
                    audio_file_url?: string | null
                    plays_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    album_id?: string
                    title?: string
                    duration_seconds?: number
                    audio_file_url?: string | null
                    plays_count?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'tracks_album_id_fkey'
                        columns: ['album_id']
                        isOneToOne: false
                        referencedRelation: 'albums'
                        referencedColumns: ['id']
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
export type Track = Database['public']['Tables']['tracks']['Row']

export type InsertArtist = Database['public']['Tables']['artists']['Insert']
export type InsertAlbum = Database['public']['Tables']['albums']['Insert']
export type InsertTrack = Database['public']['Tables']['tracks']['Insert']

export type UpdateArtist = Database['public']['Tables']['artists']['Update']
export type UpdateAlbum = Database['public']['Tables']['albums']['Update']
export type UpdateTrack = Database['public']['Tables']['tracks']['Update']

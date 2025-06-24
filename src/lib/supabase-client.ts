import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})

// Database types (will be auto-generated later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          google_id: string
          plan: 'free' | 'basic' | 'pro'
          plan_expires_at: string | null
          onboarding_completed: boolean
          selected_industry: string | null
          selected_tone: string | null
          selected_topics: string[] | null
          monthly_posts_used: number
          monthly_posts_limit: number
          usage_reset_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          google_id: string
          plan?: 'free' | 'basic' | 'pro'
          plan_expires_at?: string | null
          onboarding_completed?: boolean
          selected_industry?: string | null
          selected_tone?: string | null
          selected_topics?: string[] | null
          monthly_posts_used?: number
          monthly_posts_limit?: number
          usage_reset_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          google_id?: string
          plan?: 'free' | 'basic' | 'pro'
          plan_expires_at?: string | null
          onboarding_completed?: boolean
          selected_industry?: string | null
          selected_tone?: string | null
          selected_topics?: string[] | null
          monthly_posts_used?: number
          monthly_posts_limit?: number
          usage_reset_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          template_id: string | null
          content: string
          hashtags: string[] | null
          platform: 'twitter' | 'threads' | 'linkedin'
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_at: string | null
          published_at: string | null
          likes_count: number
          comments_count: number
          shares_count: number
          impressions_count: number
          external_post_id: string | null
          external_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id?: string | null
          content: string
          hashtags?: string[] | null
          platform?: 'twitter' | 'threads' | 'linkedin'
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_at?: string | null
          published_at?: string | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          impressions_count?: number
          external_post_id?: string | null
          external_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string | null
          content?: string
          hashtags?: string[] | null
          platform?: 'twitter' | 'threads' | 'linkedin'
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_at?: string | null
          published_at?: string | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          impressions_count?: number
          external_post_id?: string | null
          external_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      industries: {
        Row: {
          id: string
          name: string
          name_ko: string
          description: string | null
          description_ko: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ko: string
          description?: string | null
          description_ko?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ko?: string
          description?: string | null
          description_ko?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      tones: {
        Row: {
          id: string
          name: string
          name_ko: string
          description: string | null
          description_ko: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ko: string
          description?: string | null
          description_ko?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ko?: string
          description?: string | null
          description_ko?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Industry = Database['public']['Tables']['industries']['Row']
export type Tone = Database['public']['Tables']['tones']['Row']
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url?: string
          created_at: string
          updated_at: string
          plan: 'basic' | 'pro'
          subscription_status: 'active' | 'inactive' | 'canceled'
          subscription_id?: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
          plan?: 'basic' | 'pro'
          subscription_status?: 'active' | 'inactive' | 'canceled'
          subscription_id?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
          plan?: 'basic' | 'pro'
          subscription_status?: 'active' | 'inactive' | 'canceled'
          subscription_id?: string
        }
      }
      social_accounts: {
        Row: {
          id: string
          user_id: string
          platform: 'twitter' | 'threads'
          platform_user_id: string
          username: string
          access_token: string
          refresh_token?: string
          token_expires_at?: string
          is_connected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'twitter' | 'threads'
          platform_user_id: string
          username: string
          access_token: string
          refresh_token?: string
          token_expires_at?: string
          is_connected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'twitter' | 'threads'
          platform_user_id?: string
          username?: string
          access_token?: string
          refresh_token?: string
          token_expires_at?: string
          is_connected?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_posts: {
        Row: {
          id: string
          user_id: string
          social_account_id: string
          platform_post_id: string
          content: string
          created_at: string
          engagement_score?: number
          likes_count?: number
          replies_count?: number
          retweets_count?: number
        }
        Insert: {
          id?: string
          user_id: string
          social_account_id: string
          platform_post_id: string
          content: string
          created_at?: string
          engagement_score?: number
          likes_count?: number
          replies_count?: number
          retweets_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          social_account_id?: string
          platform_post_id?: string
          content?: string
          created_at?: string
          engagement_score?: number
          likes_count?: number
          replies_count?: number
          retweets_count?: number
        }
      }
      tone_profiles: {
        Row: {
          id: string
          user_id: string
          tone_analysis: Record<string, any>
          writing_style: Record<string, any>
          common_topics: string[]
          personality_traits: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tone_analysis: Record<string, any>
          writing_style: Record<string, any>
          common_topics: string[]
          personality_traits: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tone_analysis?: Record<string, any>
          writing_style?: Record<string, any>
          common_topics?: string[]
          personality_traits?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      generated_content: {
        Row: {
          id: string
          user_id: string
          content: string
          platform: 'twitter' | 'threads'
          status: 'draft' | 'scheduled' | 'published'
          scheduled_at?: string
          published_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          platform: 'twitter' | 'threads'
          status?: 'draft' | 'scheduled' | 'published'
          scheduled_at?: string
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          platform?: 'twitter' | 'threads'
          status?: 'draft' | 'scheduled' | 'published'
          scheduled_at?: string
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      scheduled_posts: {
        Row: {
          id: string
          user_id: string
          content_id: string
          social_account_id: string
          scheduled_at: string
          status: 'pending' | 'processing' | 'published' | 'failed'
          error_message?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          social_account_id: string
          scheduled_at: string
          status?: 'pending' | 'processing' | 'published' | 'failed'
          error_message?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          social_account_id?: string
          scheduled_at?: string
          status?: 'pending' | 'processing' | 'published' | 'failed'
          error_message?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'basic' | 'pro'
          status: 'active' | 'inactive' | 'canceled' | 'trial'
          current_period_start: string
          current_period_end: string
          payment_provider: 'lemonsqueezy'
          provider_subscription_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'basic' | 'pro'
          status?: 'active' | 'inactive' | 'canceled' | 'trial'
          current_period_start: string
          current_period_end: string
          payment_provider: 'lemonsqueezy'
          provider_subscription_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'basic' | 'pro'
          status?: 'active' | 'inactive' | 'canceled' | 'trial'
          current_period_start?: string
          current_period_end?: string
          payment_provider?: 'lemonsqueezy'
          provider_subscription_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string
          resource_id?: string
          metadata: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource_type: string
          resource_id?: string
          metadata: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string
          metadata?: Record<string, any>
          created_at?: string
        }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
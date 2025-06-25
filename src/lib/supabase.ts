import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-client'

// Check if Supabase is properly configured
export const isSupabaseConfigured = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'

// Only create client if properly configured
const supabaseUrl = isSupabaseConfigured 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL!
  : 'https://placeholder.supabase.co'

const supabaseAnonKey = isSupabaseConfigured
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers - OAuth is now handled by auth.tsx

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Database helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const createUserProfile = async (userData: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(userData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Posts helpers
export const getUserPosts = async (userId: string, limit = 10, offset = 0) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data
}

export const createPost = async (postData: any) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Usage tracking
export const getUserUsage = async (userId: string) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const { data, error } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())
  
  if (error) throw error
  
  const postsCount = data.filter(log => log.action === 'post_created').length
  return { postsCount }
}

export const trackUsage = async (userId: string, action: string, metadata?: any) => {
  const { error } = await supabase
    .from('usage_logs')
    .insert({
      user_id: userId,
      action,
      metadata
    })
  
  if (error) throw error
}

// Subscription helpers
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // Ignore not found error
  return data
}
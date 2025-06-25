'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserProfile } from './supabase'

interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  plan: 'free' | 'basic' | 'pro'
  monthly_posts_used: number
  monthly_posts_limit: number
  onboarding_completed: boolean
  selected_industry_id?: string
  selected_tone_id?: string
  selected_topics?: string[]
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setSupabaseUser(session.user)
        await fetchUserProfile(session.user.id)
      }
      
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          setSupabaseUser(null)
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error)
        return
      }

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar_url: profile.avatar_url,
          plan: profile.plan,
          monthly_posts_used: profile.monthly_posts_used,
          monthly_posts_limit: profile.monthly_posts_limit,
          onboarding_completed: profile.onboarding_completed,
          selected_industry_id: profile.selected_industry_id,
          selected_tone_id: profile.selected_tone_id,
          selected_topics: profile.selected_topics
        })
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  const getUserFromProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !profile) {
        return null
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
        plan: profile.plan,
        monthly_posts_used: profile.monthly_posts_used,
        monthly_posts_limit: profile.monthly_posts_limit,
        onboarding_completed: profile.onboarding_completed,
        selected_industry_id: profile.selected_industry_id,
        selected_tone_id: profile.selected_tone_id,
        selected_topics: profile.selected_topics
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }


  const login = async () => {
    try {
      setIsLoading(true)
      
      return new Promise<void>((resolve, reject) => {
        // Use Supabase OAuth with popup
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            skipBrowserRedirect: true,
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        }).then(({ data, error }) => {
          if (error) {
            console.error('OAuth initialization error:', error)
            setIsLoading(false)
            reject(error)
            return
          }

          if (data?.url) {
            // Open OAuth URL in popup
            const popup = window.open(
              data.url,
              'oauth',
              'width=500,height=600,scrollbars=yes,resizable=yes,top=50,left=50'
            )
            
            if (!popup) {
              setIsLoading(false)
              reject(new Error('팝업이 차단되었습니다. 팝업을 허용해주세요.'))
              return
            }

            popup.focus()

            // Listen for success message from callback
            const messageHandler = (event: MessageEvent) => {
              if (event.origin !== window.location.origin) return
              
              if (event.data.type === 'SUPABASE_AUTH_SUCCESS') {
                console.log('Received auth success message')
                cleanup()
                setIsLoading(false)
                resolve()
              }
            }
            
            // Cleanup function
            const cleanup = () => {
              window.removeEventListener('message', messageHandler)
              if (timeoutId) clearTimeout(timeoutId)
            }
            
            window.addEventListener('message', messageHandler)

            // 5분 타임아웃
            const timeoutId = setTimeout(() => {
              cleanup()
              setIsLoading(false)
              reject(new Error('로그인 시간이 초과되었습니다.'))
            }, 300000)
          }
        })
      })
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
      throw error
    }
  }

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
        
        // If this is a popup window, close it and let parent handle redirect
        if (window.opener) {
          // Send success message to parent window to close modal
          window.opener.postMessage({
            type: 'SUPABASE_AUTH_SUCCESS',
            user: session.user
          }, window.location.origin)
          window.close()
          return
        }
        
        // Otherwise redirect normally
        const redirectUrl = user?.onboarding_completed ? '/dashboard' : '/dashboard/onboarding'
        window.location.href = redirectUrl
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // 바로 리다이렉트 (UI 변화 없이)
      window.location.href = '/'
      
      // 백그라운드에서 로그아웃 처리
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
    } catch (error) {
      console.error('Logout failed:', error)
      // 에러가 있어도 메인 페이지로 리다이렉트
      window.location.href = '/'
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar_url,
          onboarding_completed: updates.onboarding_completed,
          selected_industry_id: updates.selected_industry_id,
          selected_tone_id: updates.selected_tone_id,
          selected_topics: updates.selected_topics,
        })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      setUser({ ...user, ...updates })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser, 
      isLoading, 
      login, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
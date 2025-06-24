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
            redirectTo: `${window.location.origin}/auth/callback`
          }
        }).then(({ data, error }) => {
          if (error) {
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

            // Monitor popup for completion (safer method)
            const checkClosed = setInterval(() => {
              try {
                if (popup.closed) {
                  clearInterval(checkClosed)
                  setIsLoading(false)
                  reject(new Error('로그인이 취소되었습니다.'))
                }
              } catch (e) {
                // Ignore Cross-Origin-Opener-Policy errors
                console.log('Popup closed check blocked by COOP policy')
              }
            }, 1000)

            // Poll for Supabase session changes
            const authCheckInterval = setInterval(async () => {
              try {
                const { data: { session } } = await supabase.auth.getSession()
                
                if (session?.user) {
                  clearInterval(checkClosed)
                  clearInterval(authCheckInterval)
                  popup.close()
                  
                  // Set user data
                  setSupabaseUser(session.user)
                  
                  // Create user profile if it doesn't exist
                  try {
                    const { data: profile } = await supabase
                      .from('user_profiles')
                      .select('id')
                      .eq('id', session.user.id)
                      .single()
                    
                    if (!profile) {
                      // Create new user profile
                      await supabase
                        .from('user_profiles')
                        .insert({
                          id: session.user.id,
                          email: session.user.email || '',
                          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email || 'User',
                          avatar_url: session.user.user_metadata?.avatar_url,
                          plan: 'free',
                          monthly_posts_used: 0,
                          monthly_posts_limit: 10,
                          onboarding_completed: false
                        })
                    }
                  } catch (profileError) {
                    console.error('Profile creation error:', profileError)
                  }
                  
                  await fetchUserProfile(session.user.id)
                  
                  // Navigate to appropriate page
                  const currentUser = user || await getUserFromProfile(session.user.id)
                  const redirectUrl = currentUser?.onboarding_completed ? '/dashboard' : '/dashboard/onboarding'
                  window.location.href = redirectUrl
                  
                  setIsLoading(false)
                  resolve()
                }
              } catch (error) {
                console.error('Session check error:', error)
              }
            }, 1000)
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
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      
      setUser(null)
      setSupabaseUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
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
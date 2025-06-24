'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase, getUser, signOut as supabaseSignOut } from './supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const currentUser = await getUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          
          // Check if user needs onboarding
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('industry, tone')
              .eq('id', session.user.id)
              .single()

            if (!profile?.industry || !profile?.tone) {
              router.push('/dashboard/onboarding')
            } else {
              router.push('/dashboard')
            }
          } catch (error) {
            // If user doesn't exist, create profile and go to onboarding
            await supabase.from('users').insert({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email!.split('@')[0],
              plan: 'free'
            })
            router.push('/dashboard/onboarding')
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Protect routes
  useEffect(() => {
    const publicPaths = ['/', '/login', '/signup', '/auth/callback']
    const isPublicPath = publicPaths.includes(pathname)
    
    if (!loading && !user && !isPublicPath) {
      router.push('/login')
    }
  }, [user, loading, pathname, router])

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    await supabaseSignOut()
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
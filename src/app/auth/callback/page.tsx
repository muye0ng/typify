'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import { AlertCircle, Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const { t } = useLanguage()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle PKCE callback
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const urlParams = new URLSearchParams(window.location.search)
        
        // Check for error first
        const error = hashParams.get('error') || urlParams.get('error')
        const errorDescription = hashParams.get('error_description') || urlParams.get('error_description')
        
        if (error) {
          console.error('OAuth Error:', { error, errorDescription, hash: window.location.hash, search: window.location.search })
          
          // If it's a database error, we can still try to continue
          if (error === 'server_error' && errorDescription?.includes('Database error saving new user')) {
            console.warn('Database error detected, attempting to continue with OAuth...')
            // Don't throw error, continue with OAuth flow
          } else {
            throw new Error(errorDescription || error)
          }
        }

        // Handle Supabase OAuth callback
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(window.location.href)
        
        if (sessionError) {
          console.error('Session Error:', sessionError)
          throw sessionError
        }

        if (data?.session?.user) {
          setStatus('success')
          
          // For popup: just close the window
          // The main window will detect the session via polling
          setTimeout(() => {
            window.close()
          }, 1000)
        } else {
          throw new Error('No session found after authentication')
        }
        
      } catch (err) {
        console.error('Auth callback error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        console.log('Full error details:', {
          error: err,
          url: window.location.href,
          hash: window.location.hash,
          search: window.location.search
        })
        setError(errorMessage)
        setStatus('error')

        // For popup error: just close the window
        setTimeout(() => {
          window.close()
        }, 2000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="noise absolute inset-0" />
      
      <div className="relative z-10 text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-accent-secondary rounded-2xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-2xl font-bold">{t('auth.completing')}</h1>
            <p className="text-foreground-secondary">{t('auth.pleaseWait')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-2xl font-bold text-green-600">{t('auth.signInSuccessful')}</h1>
            <p className="text-foreground-secondary">{t('auth.redirecting')}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-red-600">{t('auth.signInFailed')}</h1>
            <p className="text-foreground-secondary">{error}</p>
            <button
              onClick={() => window.close()}
              className="mt-4 px-4 py-2 bg-surface hover:bg-surface-hover rounded-lg transition-colors"
            >
              {t('auth.closeWindow')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
        <div className="noise absolute inset-0" />
        <div className="relative z-10 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-foreground-secondary">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
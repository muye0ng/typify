'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import { AlertCircle, Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    
    const handleCallback = async () => {
      try {
        console.log('=== AUTH CALLBACK STARTED ===')
        console.log('Current URL:', window.location.href)
        
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        
        console.log('URL search params:', urlParams.toString())
        console.log('Error param:', error)
        
        if (error) {
          console.log('Error found in URL:', error)
          throw new Error(urlParams.get('error_description') || error)
        }

        // URL에서 code 가져오기
        const code = urlParams.get('code')
        console.log('Auth code found:', !!code)
        console.log('Code value:', code?.substring(0, 20) + '...')
        
        if (code && isMounted) {
          console.log('Auth code found - setting up auth listener')
          
          // 바로 세션 변화 감지 시작 (getSession 호출 제거)
          let resolved = false
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, !!session)
            
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !resolved) {
              resolved = true
              console.log('Login successful!')
              setStatus('success')
              
              if (window.opener) {
                window.opener.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, window.location.origin)
                setTimeout(() => window.close(), 100)
              } else {
                window.close()
              }
              
              subscription.unsubscribe()
            }
          })
          
          // 3초 후에도 로그인 안되면 에러
          setTimeout(() => {
            if (!resolved) {
              console.log('Auth timeout - no session detected')
              subscription.unsubscribe()
              setError('로그인 시간이 초과되었습니다.')
              setStatus('error')
            }
          }, 3000)
          
          return
        }

        // code가 없거나 실패한 경우
        throw new Error('No authorization code found')
        
      } catch (err) {
        console.log('=== CAUGHT ERROR IN CALLBACK ===')
        console.error('Auth callback error:', err)
        console.error('Error type:', typeof err)
        console.error('Error details:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Authentication failed')
          setStatus('error')
        }
      }
    }

    handleCallback()
    
    return () => {
      isMounted = false
    }
  }, [])

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
            <h1 className="text-2xl font-bold text-green-600">로그인 성공!</h1>
            <p className="text-foreground-secondary">로그인이 완료되었습니다!</p>
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
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              창 닫기
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
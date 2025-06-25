'use client'

import { useState } from 'react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'
import { ArrowRight, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup?: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { login } = useAuth()
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError('')
      await login()
      // 로그인 성공 - 모달은 메시지 리스너에 의해 자동으로 닫힘
    } catch (err) {
      console.error('Login error:', err)
      setIsLoading(false)
      // 실제 에러만 표시 (팝업 취소는 에러가 아님)
      if (err instanceof Error && !err.message.includes('취소')) {
        setError(err.message)
      }
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // 특정 영역만 블러 처리
  React.useEffect(() => {
    if (isOpen) {
      // 헤더 제외한 메인 콘텐츠 영역만 블러
      const mainContent = document.querySelector('main')
      const footer = document.querySelector('footer')
      
      if (mainContent) {
        mainContent.style.filter = 'blur(4px)'
        mainContent.style.pointerEvents = 'none'
      }
      if (footer) {
        footer.style.filter = 'blur(4px)'
        footer.style.pointerEvents = 'none'
      }
    } else {
      const mainContent = document.querySelector('main')
      const footer = document.querySelector('footer')
      
      if (mainContent) {
        mainContent.style.filter = 'none'
        mainContent.style.pointerEvents = 'auto'
      }
      if (footer) {
        footer.style.filter = 'none'
        footer.style.pointerEvents = 'auto'
      }
    }

    return () => {
      const mainContent = document.querySelector('main')
      const footer = document.querySelector('footer')
      
      if (mainContent) {
        mainContent.style.filter = 'none'
        mainContent.style.pointerEvents = 'auto'
      }
      if (footer) {
        footer.style.filter = 'none'
        footer.style.pointerEvents = 'auto'
      }
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop with glassmorphism */}
          <div
            onClick={handleBackdropClick}
            className="fixed top-0 left-0 right-0 bottom-0 z-[10000] bg-black/60 flex items-center justify-center p-4 min-h-screen"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md min-w-[320px]"
            >
              {/* Glassmorphism card with original design */}
              <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-background/90 via-background-secondary/90 to-background/90 border border-white/10 shadow-2xl">
                {/* Noise texture */}
                <div className="noise absolute inset-0 opacity-30" />
                
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onClose()
                  }}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-surface/50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
                
                {/* Content with original styling */}
                <div className="relative z-10 p-8 space-y-6">
                  {/* Logo */}
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                      </div>
                      <span className="text-2xl font-bold">Typify</span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-foreground">
                      {t('auth.welcomeBack')}
                    </h1>
                    <p className="text-foreground-secondary">
                      {t('auth.signInContinue')}
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Social Login */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full relative group min-h-[48px] text-sm sm:text-base whitespace-nowrap"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-foreground-secondary border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      {isLoading 
                        ? t('auth.signingIn')
                        : t('auth.continueWithGoogle')
                      }
                      {!isLoading && (
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      )}
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-surface px-2 text-foreground-tertiary">
                        {t('auth.or')}
                      </span>
                    </div>
                  </div>

                  {/* Sign up link */}
                  <p className="text-center text-sm text-foreground-secondary">
                    {t('auth.noAccount')}{' '}
                    <button 
                      onClick={() => {
                        onClose()
                        onSwitchToSignup?.()
                      }}
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      {t('auth.signUpFree')}
                    </button>
                  </p>

                  {/* Terms */}
                  <p className="text-xs text-center text-foreground-tertiary">
                    {t('auth.byContinuing')}{' '}
                    <Link href="/terms" className="text-foreground-secondary hover:text-foreground">
                      {t('auth.termsOfService')}
                    </Link>{' '}
                    {t('auth.and')}{' '}
                    <Link href="/privacy" className="text-foreground-secondary hover:text-foreground">
                      {t('auth.privacyPolicy')}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
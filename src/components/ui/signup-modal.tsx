'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'
import { ArrowRight, Check, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const { login } = useAuth()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true)
      setError('')
      await login()
      // onClose() - 로그인 성공시 모달은 OAuth 완료 후 자동으로 닫힘
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const benefits = [
    t('auth.freePostsMonth'),
    t('auth.allTemplates'),
    t('auth.autoScheduling'),
    t('auth.basicAnalytics')
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Glassmorphism card with original design */}
              <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-background/90 via-background-secondary/90 to-background/90 border border-white/10 shadow-2xl">
                {/* Noise texture */}
                <div className="noise absolute inset-0 opacity-30" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-surface/50 transition-colors"
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
                      {t('auth.startForFree')}
                    </h1>
                    <p className="text-foreground-secondary">
                      {t('auth.joinThousands')}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-gradient-to-br from-surface/50 via-surface-hover/50 to-surface/50 border border-white/5 p-4 space-y-2">
                    <p className="text-sm font-medium text-foreground mb-3">
                      {t('auth.freePlanIncludes')}
                    </p>
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-foreground-secondary">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Social Signup */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full relative group bg-gradient-to-r from-accent to-accent-secondary hover:from-accent/90 hover:to-accent-secondary/90"
                      onClick={handleGoogleSignup}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      {isLoading 
                        ? t('auth.creatingAccount')
                        : t('auth.signUpWithGoogle')
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

                  {/* Sign in link */}
                  <p className="text-center text-sm text-foreground-secondary">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <button 
                      onClick={() => {
                        onClose()
                        onSwitchToLogin?.()
                      }}
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      {t('auth.signIn')}
                    </button>
                  </p>

                  {/* Terms */}
                  <p className="text-xs text-center text-foreground-tertiary">
                    {t('auth.bySigningUp')}{' '}
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
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoginModal } from '@/components/ui/login-modal'
import { SignupModal } from '@/components/ui/signup-modal'
import { Menu, X, Globe, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const { t, language, setLanguage, isHydrated } = useLanguage()
  const { user, logout, isLoading: authLoading } = useAuth()

  useEffect(() => {
    // Listen for auth success from OAuth popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === 'SUPABASE_AUTH_SUCCESS') {
        console.log('Auth success message received')
        setIsLoginModalOpen(false)
        setIsSignupModalOpen(false)
        // 로그인 성공 시 즉시 대시보드로 리다이렉트
        window.location.href = '/dashboard'
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-dropdown') && !target.closest('.user-dropdown')) {
        setIsLangOpen(false)
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.reviews'), href: '#testimonials' },
  ]

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1) // Remove #
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const headerHeight = 80 // 헤더 높이 + 여백
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <header
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, width: '100%' }}
      className={`fixed backdrop-blur-2xl bg-background/80 border-b border-border`}
    >
      <div className="container-wide mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-lg group-hover:bg-accent/30 transition-colors" />
              <div className="relative h-8 w-8 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
            </div>
            <span className="font-semibold text-lg">Typify</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative language-dropdown">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">
                  {language === 'ko' ? '한국어' : 'English'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {isLangOpen && (
                <div
                  className="absolute top-full mt-2 right-0 w-32 card p-2 bg-surface border border-border z-50"
                >
                    <button
                      onClick={() => {
                        setLanguage('en')
                        setIsLangOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-surface-hover transition-colors ${
                        language === 'en' ? 'text-foreground bg-surface-hover' : 'text-foreground-secondary'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ko')
                        setIsLangOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-surface-hover transition-colors ${
                        language === 'ko' ? 'text-foreground bg-surface-hover' : 'text-foreground-secondary'
                      }`}
                    >
                      한국어
                    </button>
                </div>
              )}
            </div>
            
            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {user && !authLoading ? (
              // 로그인된 상태: 사용자 정보 + 대시보드 버튼
              <>
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {t('header.dashboard')}
                  </Button>
                </Link>
                
                <div className="relative user-dropdown">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="gap-2"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{user.name || user.email?.split('@')[0] || 'User'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div
                      className="absolute top-full mt-2 right-0 w-48 card p-2 bg-surface border border-border z-50"
                    >
                        <div className="px-3 py-2 border-b border-border mb-2">
                          <p className="text-sm font-medium">{user.name || user.email?.split('@')[0] || 'User'}</p>
                          <p className="text-xs text-foreground-secondary">{user.email}</p>
                        </div>
                        <button
                          onClick={async () => {
                            setIsUserMenuOpen(false)
                            await logout()
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-surface-hover rounded transition-colors text-red-500"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('auth.signOut')}
                        </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 로그아웃 상태: 로그인/회원가입 버튼
              <>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  {t('header.signin')}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setIsSignupModalOpen(true)}
                >
                  {t('header.freetrial')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Language + Menu Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Language Selector */}
            <div className="relative language-dropdown">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="relative"
              >
                <Globe className="h-5 w-5" />
              </Button>
              
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 w-32 rounded-lg border border-border bg-background/95 backdrop-blur-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsLangOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      language === 'en' ? 'text-foreground bg-surface-hover' : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ko')
                      setIsLangOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      language === 'ko' ? 'text-foreground bg-surface-hover' : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
                    }`}
                  >
                    한국어
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden border-t border-border backdrop-blur-2xl bg-background/98"
        >
            <div className="container px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-sm text-foreground-secondary hover:text-foreground py-2 cursor-pointer"
                  onClick={(e) => {
                    handleAnchorClick(e, item.href)
                    setIsMenuOpen(false)
                  }}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {/* 모바일: 로그인 상태에 따른 조건부 렌더링 */}
                {user && !authLoading ? (
                  // 로그인된 상태
                  <>
                    <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name || user.email?.split('@')[0] || 'User'}</p>
                        <p className="text-xs text-foreground-secondary">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        {t('header.dashboard')}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        setIsMenuOpen(false)
                        await logout()
                      }}
                      className="w-full gap-2 text-red-500 hover:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('auth.signOut')}
                    </Button>
                  </>
                ) : (
                  // 로그아웃 상태
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setIsLoginModalOpen(true)
                        setIsMenuOpen(false)
                      }}
                    >
                      {t('header.signin')}
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setIsSignupModalOpen(true)
                        setIsMenuOpen(false)
                      }}
                    >
                      {t('header.freetrial')}
                    </Button>
                  </>
                )}
              </div>
            </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false)
          setIsSignupModalOpen(true)
        }}
      />
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />
    </header>
  )
}
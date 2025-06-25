'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Zap,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  name: string
  href: string
  icon: any
}

interface User {
  name: string
  email: string
  plan: 'free' | 'basic' | 'pro'
  avatar?: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user: authUser, logout, isLoading: authLoading } = useAuth()
  const { language, setLanguage, t, isHydrated } = useLanguage()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  
  // 인증 체크
  useEffect(() => {
    if (!authLoading && !authUser) {
      // 로그인되지 않은 상태면 메인 페이지로 리다이렉트
      router.push('/')
      return
    }
    
    if (authUser && !authUser.onboarding_completed && pathname !== '/dashboard/onboarding') {
      // 온보딩이 완료되지 않은 경우 온보딩 페이지로 리다이렉트
      router.push('/dashboard/onboarding')
      return
    }
  }, [authUser, authLoading, router, pathname])

  // 로딩 중이거나 인증되지 않은 경우 로딩 화면 표시
  if (authLoading || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-accent-secondary rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <p className="text-foreground-secondary">
            {authLoading ? t('dashboard.loading') : t('auth.redirecting')}
          </p>
        </div>
      </div>
    )
  }
  
  // Use authenticated user data or show loading
  const user: User = authUser ? {
    name: authUser.name,
    email: authUser.email,
    plan: authUser.plan
  } : {
    name: authLoading 
      ? (isHydrated ? t('dashboard.loading') : 'Loading...')
      : (isHydrated ? t('common.guest') : 'Guest'),
    email: 'guest@example.com',
    plan: 'free'
  }


  const navItems: NavItem[] = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.generate'), href: '/dashboard/generate', icon: Sparkles },
    { name: t('nav.schedule'), href: '/dashboard/schedule', icon: Calendar },
    { name: t('nav.analytics'), href: '/dashboard/analytics', icon: BarChart3 },
    { name: t('nav.posts'), href: '/dashboard/posts', icon: FileText },
    { name: t('nav.settings'), href: '/dashboard/settings', icon: Settings },
  ]

  const handleSignOut = () => {
    logout()
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-500/10 text-gray-500'
      case 'basic':
        return 'bg-blue-500/10 text-blue-500'
      case 'pro':
        return 'bg-purple-500/10 text-purple-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-background/95 backdrop-blur-xl border-l border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:bg-surface lg:backdrop-blur-none lg:border-l-0 lg:border-r lg:left-0 lg:right-auto ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-border">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-lg">Typify</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-accent text-white' 
                      : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Language Selector */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="w-full justify-start gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">
                  {language === 'ko' ? '한국어' : 'English'}
                </span>
                <ChevronDown className="h-3 w-3 ml-auto" />
              </Button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full mb-2 left-0 right-0 card p-2 bg-surface border border-border"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getPlanBadgeColor(user.plan)}`}>
                    {user.plan}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-foreground-tertiary" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full mb-2 left-0 right-0 card p-2 bg-surface border border-border"
                  >
                    <button
                      onClick={() => router.push('/dashboard/settings')}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-surface-hover rounded transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      {t('nav.settings')}
                    </button>
                    {user.plan === 'free' && (
                      <button
                        onClick={() => router.push('/pricing')}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-surface-hover rounded transition-colors text-accent"
                      >
                        <Zap className="w-4 h-4" />
                        {t('dashboard.upgrade')}
                      </button>
                    )}
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-surface-hover rounded transition-colors text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('auth.signOut')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-xl">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent-secondary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-semibold">Typify</span>
          </button>
          
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-surface-hover"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

    </div>
  )
}
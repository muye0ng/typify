'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const { t, language, setLanguage, isHydrated } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hydration이 완료되지 않았을 때는 기본값 사용
  const navItems = [
    { name: isHydrated ? t('nav.features') : 'Features', href: '#features' },
    { name: isHydrated ? t('nav.pricing') : 'Pricing', href: '#pricing' },
    { name: isHydrated ? t('nav.reviews') : 'Reviews', href: '#testimonials' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-2xl bg-background/80 border-b border-border' : ''
      }`}
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
                className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">
                  {isHydrated 
                    ? (language === 'ko' ? '한국어' : 'English')
                    : 'English'
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Button variant="secondary" size="sm">
              {isHydrated ? t('header.signin') : 'Sign In'}
            </Button>
            <Button size="sm">
              {isHydrated ? t('header.freetrial') : 'Free Trial'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border backdrop-blur-2xl bg-background/95"
          >
            <div className="container px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-sm text-foreground-secondary hover:text-foreground py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button variant="secondary" size="sm" className="w-full">
                  {isHydrated ? t('header.signin') : 'Sign In'}
                </Button>
                <Button size="sm" className="w-full">
                  {isHydrated ? t('header.freetrial') : 'Free Trial'}
                </Button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsMenuOpen(false)
                    }}
                    className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                      language === 'en' ? 'bg-surface-hover text-foreground' : 'text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ko')
                      setIsMenuOpen(false)
                    }}
                    className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                      language === 'ko' ? 'bg-surface-hover text-foreground' : 'text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    한국어
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
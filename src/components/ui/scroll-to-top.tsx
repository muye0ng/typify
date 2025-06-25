'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from './button'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(true) // 초기부터 표시

  useEffect(() => {
    const toggleVisibility = () => {
      // 항상 표시 (사용자 요구사항에 따라)
      setIsVisible(true)
    }

    // 초기 체크
    toggleVisibility()

    window.addEventListener('scroll', toggleVisibility)
    window.addEventListener('resize', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
      window.removeEventListener('resize', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={scrollToTop}
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl bg-background/95 backdrop-blur-xl border border-border hover:bg-surface-hover transition-all duration-200"
            variant="secondary"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  )
}
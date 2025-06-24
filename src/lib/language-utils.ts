export type Language = 'ko' | 'en'

export const LANGUAGE_COOKIE = 'typify-language'
export const DEFAULT_LANGUAGE: Language = 'ko'

// 브라우저 언어 감지
export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('ko')) {
    return 'ko'
  }
  return 'en'
}

// 쿠키 설정
export function setLanguageCookie(language: Language) {
  if (typeof document !== 'undefined') {
    document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  }
}

// 로컬스토리지에서 언어 가져오기 (fallback)
export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(LANGUAGE_COOKIE) as Language
    if (stored && (stored === 'ko' || stored === 'en')) {
      return stored
    }
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error)
  }
  
  return null
}
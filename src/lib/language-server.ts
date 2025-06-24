import { cookies } from 'next/headers'

export type Language = 'ko' | 'en'

export const LANGUAGE_COOKIE = 'typify-language'
export const DEFAULT_LANGUAGE: Language = 'ko'

// 서버에서 언어 감지
export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies()
  const language = cookieStore.get(LANGUAGE_COOKIE)?.value as Language
  
  if (language && (language === 'ko' || language === 'en')) {
    return language
  }
  
  return DEFAULT_LANGUAGE
}
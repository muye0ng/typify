import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/lib/auth";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { getServerLanguage } from "@/lib/language-server";

export const metadata: Metadata = {
  title: "Typify - AI 기반 소셜미디어 관리",
  description: "AI가 당신의 소셜미디어를 24시간 관리합니다. 개인 브랜딩부터 비즈니스 마케팅까지 콘텐츠 생성과 발행을 자동화하세요.",
  keywords: "AI, 소셜미디어, 자동화, 콘텐츠 생성, 마케팅, 트위터, 쓰레드",
  authors: [{ name: "Typify Team" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'google-site-verification-code', // 실제 사용시 구글 콘솔에서 발급받은 코드 입력
  },
  openGraph: {
    title: "Typify - AI 기반 소셜미디어 관리",
    description: "AI가 당신의 소셜미디어를 24시간 관리합니다. 콘텐츠 생성과 발행을 자동화하세요.",
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: "Typify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typify - AI-Powered Social Media Management",
    description: "AI manages your social media 24/7. Automate content creation and publishing from personal branding to business marketing.",
    creator: "@typify",
  },
  alternates: {
    canonical: "/",
    languages: {
      'ko': '/',
      'en': '/?lang=en',
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 언어 감지
  const initialLanguage = await getServerLanguage();
  
  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <head>
        {/* SEO: hreflang 태그 추가 */}
        <link rel="alternate" hrefLang="ko" href="/?lang=ko" />
        <link rel="alternate" hrefLang="en" href="/?lang=en" />
        <link rel="alternate" hrefLang="x-default" href="/" />
        
        {/* JSON-LD 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Typify",
              "description": "AI-powered social media management platform that automates content creation and publishing for personal branding and business marketing.",
              "url": "https://typify.im",
              "applicationCategory": "SocialNetworkingApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "category": "SaaS",
                "priceCurrency": "USD",
                "price": "19",
                "priceValidUntil": "2025-12-31"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "500"
              }
            })
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <LanguageProvider initialLanguage={initialLanguage}>
          <AuthProvider>
            {children}
            <ScrollToTop />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

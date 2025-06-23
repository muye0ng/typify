import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export const metadata: Metadata = {
  title: "Typify - AI 기반 소셜미디어 관리",
  description: "AI가 당신의 소셜미디어를 24시간 관리합니다. 개인 브랜딩부터 비즈니스 마케팅까지 콘텐츠 생성과 발행을 자동화하세요.",
  keywords: "AI, 소셜미디어, 자동화, 콘텐츠 생성, 마케팅, 트위터, 쓰레드",
  authors: [{ name: "Typify Team" }],
  openGraph: {
    title: "Typify - AI 기반 소셜미디어 관리",
    description: "AI가 당신의 소셜미디어를 24시간 관리합니다. 콘텐츠 생성과 발행을 자동화하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          {children}
          <ScrollToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}

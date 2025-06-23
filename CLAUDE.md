# Typify - Claude Code Project Memory

이 파일은 Claude Code가 프로젝트 컨텍스트를 유지하기 위한 메모리 파일입니다.

## 프로젝트 개요
- **프로젝트명**: Typify
- **목적**: AI 기반 x, 쓰레드 자동 게시 서비스
- **타겟**: 개인 브랜딩부터 비즈니스 마케팅까지
- **주요 기능**: X(Twitter), Threads 자동 콘텐츠 생성 및 발행

## 기술 스택
- **프론트엔드**: Next.js 15.3.4, TypeScript, Tailwind CSS v4
- **백엔드**: Supabase (Database & Auth)
- **인증**: NextAuth with Google OAuth
- **애니메이션**: Framer Motion
- **상태관리**: Context API (Language)
- **결제**: LemonSqueezy (예정)
- **관리자**: React-Admin (예정)

## 현재 개발 상태
### ✅ 완료된 기능
- [x] 프로젝트 초기 설정 (Next.js 15 + TypeScript)
- [x] Tailwind CSS v4 설정 및 디자인 시스템
- [x] 랜딩페이지 전체 구조 (8개 섹션)
- [x] 다국어 지원 시스템 (한국어 ↔ 영어)
- [x] 반응형 디자인 및 모바일 최적화
- [x] 글래스모피즘 디자인 적용
- [x] 무한 스크롤 마키 (추천 섹션)
- [x] 스크롤 투 탑 버튼

### 🔧 현재 작업 중
- [ ] 언어 번역 시스템 최종 검증
- [ ] 성능 최적화 및 빌드 테스트

## 개발 명령어
```bash
# 개발 서버 실행
npm run dev

# 빌드 및 타입 체크
npm run build
npm run lint
npm run typecheck
```

## 중요 파일 구조
```
src/
├── app/
│   ├── globals.css (Tailwind v4 설정)
│   └── page.tsx (메인 랜딩페이지)
├── components/
│   ├── layout/ (Header, Footer)
│   ├── landing/ (8개 랜딩 섹션)
│   └── ui/ (재사용 컴포넌트)
├── contexts/
│   └── language-context.tsx (다국어 시스템)
└── lib/ (유틸리티)
```

## 가격 정책
- **Basic**: $19/month (1개 플랫폼, 100개 포스트)
- **Pro**: $39/month (2개 플랫폼, 500개 포스트, 고급 기능)
- **무료 체험**: 14일 (신용카드 불필요)(무료체험은 basic 플랜만 가능)

## 다음 세션에서 작업할 내용
1. 대시보드 레이아웃 구현
2. 온보딩 플로우 개발
3. SNS 연결 모듈 구현
4. AI 학습 모듈 개발

자세한 내용은 다른 문서 파일들을 참조하세요.
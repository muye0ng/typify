# Typify - Claude Code Project Memory

이 파일은 Claude Code가 프로젝트 컨텍스트를 유지하기 위한 메모리 파일입니다.

## 프로젝트 개요
- **프로젝트명**: Typify
- **목적**: AI 기반 소셜미디어 자동 게시 서비스 (비즈니스 모델 단순화됨)
- **타겟**: 개인 브랜딩부터 비즈니스 마케팅까지
- **주요 기능**: 업종/톤별 템플릿 기반 콘텐츠 생성 (개인화 AI 학습 제거)

## 기술 스택
- **프론트엔드**: Next.js 15.3.4, TypeScript, Tailwind CSS v4
- **인증**: Supabase Auth + 구글 OAuth
- **백엔드**: Supabase PostgreSQL
- **관리자**: React Admin
- **애니메이션**: Framer Motion
- **상태관리**: Context API (Language, Auth)
- **결제**: LemonSqueezy (예정)

## 현재 개발 상태
### ✅ 완료된 기능
- [x] 프로젝트 초기 설정 (Next.js 15 + TypeScript)
- [x] Tailwind CSS v4 설정 및 디자인 시스템
- [x] 랜딩페이지 전체 구조 (8개 섹션)
- [x] 다국어 지원 시스템 (한국어 ↔ 영어)
- [x] 반응형 디자인 및 모바일 최적화
- [x] 글래스모피즘 디자인 적용
- [x] 구글 OAuth 팝업 로그인 시스템
- [x] JWT 기반 인증 시스템
- [x] 로그인/회원가입 페이지
- [x] 4단계 온보딩 플로우 (업종 → 톤 → 주제 → 플랫폼 선택)
- [x] 대시보드 레이아웃 (사이드바 네비게이션)
- [x] 메인 대시보드 (사용량 통계, 빠른 액션, 최근 포스트)
- [x] Free 플랜 (10 posts/month) + Basic/Pro 티어

### 🔧 현재 작업 중
- [x] Supabase 데이터베이스 연동 완료
- [x] React Admin 관리자 페이지 구축
- [x] 더미 데이터를 실제 DB 연동으로 교체
- [x] AI 콘텐츠 생성 페이지 구현
- [x] 사용량 추적 및 제한 시스템 완성
- [x] 모든 대시보드 페이지 구현 (Posts, Generate, Schedule, Analytics, Settings)
- [x] Supabase OAuth 팝업 로그인 시스템 구현
- [x] Database error saving new user 문제 해결 (supabase-fix_1.sql 실행)
- [x] 온보딩 데이터 저장 문제 해결 (supabase.ts 테이블명 수정)
- [x] 플랫폼 선택 시스템 구현 (일주일 잠금, supabase-fix_2.sql 필요)
- [x] 콘텐츠 생성 페이지에서 선택된 플랫폼 반영
- [x] DB 스키마 오류 수정 (supabase-fix_3.sql - UUID→문자열 필드 변경)
- [x] Threads 아이콘을 공식 @ 모양으로 변경
- [x] 온보딩/대시보드 한국어↔영어 번역 완성
- [x] 플랫폼 미선택 시 온보딩 강제 리다이렉트
- [x] 구글 OAuth 사용자 이름 표시 수정 (supabase-fix_4.sql - Google metadata에서 full_name 사용)
- [x] 설정 페이지에서 사용자 이름 수정 기능 연결
- [x] 콘텐츠 생성 페이지 플랫폼 실시간 변경 UX 개선 (initialPlatformSet 상태 추가)
- [x] 브랜드명(X, Threads) 한국어 번역 제거 (브랜드명은 번역하지 않음)
- [x] 온보딩 플랫폼 선택 시 Pro 플랜 안내 문구 추가 (두 플랫폼 사용 가능 안내)
- [ ] 실제 API 엔드포인트 연결

## 인증 시스템
### Supabase OAuth 설정
- **팝업 방식**: skipBrowserRedirect: true 사용
- **콜백 URL**: `http://localhost:3000/auth/callback`
- **Supabase 세션 관리**: JWT 자동 처리
- **Google Cloud Console**: `https://wrguqxtuupwjnmisbcgs.supabase.co/auth/v1/callback` 등록

### 환경 변수 (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wrguqxtuupwjnmisbcgs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 데이터베이스 스크립트
- **complete-supabase-setup.sql**: 전체 데이터베이스 스키마
- **supabase-fix_1.sql**: RLS 정책 및 트리거 수정 (Database error 해결)

## 개발 명령어
```bash
# 개발 서버 실행
npm run dev

# 패키지 설치 (JWT 포함)
npm install jsonwebtoken @types/jsonwebtoken

# 빌드 및 타입 체크
npm run build
npm run lint
```

## 파일 구조
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx (사이드바 네비게이션)
│   │   ├── dashboard/page.tsx (메인 대시보드)
│   │   ├── posts/page.tsx (게시물 관리)
│   │   ├── generate/page.tsx (AI 콘텐츠 생성)
│   │   ├── schedule/page.tsx (스케줄 관리)
│   │   ├── analytics/page.tsx (분석 대시보드)
│   │   ├── settings/page.tsx (설정)
│   │   └── onboarding/page.tsx (3단계 온보딩)
│   ├── auth/callback/page.tsx (OAuth 콜백)
│   ├── api/auth/ (인증 API 엔드포인트)
│   └── globals.css
├── components/
│   ├── layout/ (Header, Footer)
│   ├── landing/ (8개 랜딩 섹션)
│   └── ui/ (재사용 컴포넌트)
├── contexts/
│   └── language-context.tsx (다국어 시스템)
├── hooks/
│   └── use-dashboard-data.ts (대시보드 데이터 훅)
└── lib/
    └── auth.tsx (구글 OAuth + JWT 인증 시스템)
```

## 가격 정책 (업데이트됨)
- **Free**: $0/month (10 posts/month, 기본 템플릿)
- **Basic**: $19/month (100 posts/month, 모든 템플릿, 예약 발행)
- **Pro**: $39/month (500 posts/month, 고급 분석, 팀 협업)

## 비즈니스 모델 변경사항
1. **개인화 AI 학습 제거**: X API 비용($200/month) 때문에 제거
2. **템플릿 기반 시스템**: 업종별/톤별 미리 정의된 템플릿 사용
3. **온보딩 확장**: 업종 → 톤 → 주제 → 플랫폼 선택 (4단계)
4. **플랫폼 잠금**: 선택한 플랫폼 일주일 동안 변경 불가
5. **Free 플랜 추가**: 월 10개 포스트로 진입 장벽 낮춤

## 데이터베이스 스크립트
1. **supabase-fiix.sql**: 초기 DB 스키마 설정
2. **supabase-fix_1.sql**: RLS 정책 및 트리거 문제 해결
3. **supabase-fix_2.sql**: 플랫폼 관련 필드 추가
4. **supabase-fix_3.sql**: UUID→문자열 필드 변경 (온보딩 데이터 저장 문제 해결)
5. **supabase-fix_4.sql**: Google OAuth 사용자 이름 표시 문제 해결 (metadata.full_name 사용)

## 다음 세션에서 작업할 내용
1. 콘텐츠 생성 API (Claude/OpenAI) 연결
2. 실제 소셜미디어 플랫폼 연동
3. 예약 발행 시스템 구현
4. 분석 대시보드 데이터 연결

## 주요 완성 기능들
- ✅ 팝업 구글 로그인 (새창에서 계정 선택)
- ✅ 온보딩 플로우 (Industry → Tone → Topics → Platform)
- ✅ 대시보드 UI (사용량 표시, 업그레이드 유도)
- ✅ 모든 인증 페이지 및 플로우 완성


*한국어<->영어 변환
*작업을 진행하고 이 파일을 수정해야할 때 마다 수정하고 최신화 할 것.(.md 파일을 계속 만들 필요없음. claude.md에 최신화)
*스크립트를 만든다면 카테고리별로 동일한 이름 뒤에 _1, _2, _3 같은 형식으로 추가할 것
*디자인 포함 개발은 모듈화가 가장 중요하고 seo최적화도 중요함
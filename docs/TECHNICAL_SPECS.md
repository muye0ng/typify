# Typify AI - 기술 사양서

## 🏗️ 시스템 아키텍처

### 전체 구조
```
Frontend (Next.js 15)
    ↕️
Backend API (Next.js API Routes)
    ↕️
Database (Supabase PostgreSQL)
    ↕️
External APIs (OpenAI, X, Threads)
```

### 기술 스택

#### 프론트엔드
```typescript
{
  "framework": "Next.js 15.3.4",
  "language": "TypeScript 5.0+",
  "styling": "Tailwind CSS v4",
  "ui": "Custom Components + Lucide Icons",
  "animations": "Framer Motion",
  "state": "React Context API",
  "forms": "React Hook Form (예정)",
  "validation": "Zod (예정)"
}
```

#### 백엔드
```typescript
{
  "runtime": "Node.js 18+",
  "framework": "Next.js API Routes",
  "database": "Supabase (PostgreSQL)",
  "auth": "NextAuth.js + Supabase Auth",
  "orm": "Supabase Client",
  "caching": "Redis (예정)",
  "fileStorage": "Supabase Storage"
}
```

#### 외부 서비스
```typescript
{
  "ai": "OpenAI GPT-4, Claude 3",
  "social": "X API v2, Threads API",
  "payments": "LemonSqueezy",
  "email": "Resend (예정)",
  "monitoring": "Sentry, Vercel Analytics",
  "cdn": "Vercel Edge Network"
}
```

## 📊 데이터베이스 설계

### 사용자 관리
```sql
-- Users table (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  subscription_id TEXT,
  credits_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social media accounts
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'twitter', 'threads'
  account_id TEXT NOT NULL,
  username TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, account_id)
);
```

### 콘텐츠 관리
```sql
-- Generated posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES social_accounts(id),
  content TEXT NOT NULL,
  hashtags TEXT[],
  media_urls TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  platform_post_id TEXT, -- ID from social platform
  ai_model TEXT,
  generation_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content templates and styles
CREATE TABLE content_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  style_name TEXT NOT NULL,
  tone TEXT, -- 'professional', 'casual', 'funny', etc.
  topics TEXT[],
  hashtag_preferences TEXT[],
  sample_posts TEXT[], -- User's existing posts for learning
  ai_analysis JSONB, -- Analyzed style characteristics
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 분석 및 성과
```sql
-- Post analytics
CREATE TABLE post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  retweets_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  impressions_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,4),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 인증 및 보안

### 인증 플로우
```typescript
// NextAuth.js 설정
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async session({ session, token }) {
      // Supabase 사용자 정보와 동기화
      return session;
    },
  },
};
```

### 보안 정책
- **HTTPS Only**: 모든 통신 암호화
- **CORS 정책**: 허용된 도메인만 API 접근
- **Rate Limiting**: IP/사용자별 요청 제한
- **Input Validation**: 모든 입력값 검증 및 Sanitization
- **SQL Injection 방지**: Parameterized queries 사용
- **XSS 방지**: Content Security Policy 적용

## 🤖 AI 모듈 설계

### 콘텐츠 생성 파이프라인
```typescript
interface ContentGenerationRequest {
  userId: string;
  platform: 'twitter' | 'threads';
  style: ContentStyle;
  topics?: string[];
  customPrompt?: string;
}

interface ContentGenerationResponse {
  content: string;
  hashtags: string[];
  confidence: number;
  reasoning: string;
}

class AIContentGenerator {
  async generatePost(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    // 1. 사용자 스타일 분석 로드
    const userStyle = await this.loadUserStyle(request.userId);
    
    // 2. 플랫폼별 최적화 프롬프트 생성
    const prompt = await this.buildPrompt(request, userStyle);
    
    // 3. AI 모델 호출 (OpenAI/Claude)
    const response = await this.callAIModel(prompt);
    
    // 4. 후처리 및 검증
    return this.postProcess(response, request.platform);
  }
}
```

### 스타일 학습 알고리즘
```typescript
interface StyleAnalysis {
  tone: 'professional' | 'casual' | 'humorous' | 'technical';
  avgLength: number;
  hashtagUsage: number;
  commonWords: string[];
  topicDistribution: Record<string, number>;
  postingPattern: {
    frequency: number;
    timeOfDay: number[];
    dayOfWeek: number[];
  };
}

class UserStyleAnalyzer {
  async analyzeUserPosts(posts: UserPost[]): Promise<StyleAnalysis> {
    // 자연어 처리 기반 스타일 분석
    // 토픽 모델링, 감정 분석, 패턴 인식
  }
}
```

## 🔄 API 설계

### RESTful API 엔드포인트
```typescript
// Authentication
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session

// User Management
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/profile

// Social Accounts
GET    /api/social-accounts
POST   /api/social-accounts/connect
DELETE /api/social-accounts/:id

// Content Generation
POST /api/content/generate
GET  /api/content/posts
PUT  /api/content/posts/:id
DELETE /api/content/posts/:id

// Scheduling
POST /api/schedule/post
GET  /api/schedule/upcoming
PUT  /api/schedule/:id
DELETE /api/schedule/:id

// Analytics
GET /api/analytics/dashboard
GET /api/analytics/posts/:id
GET /api/analytics/engagement
```

### API 응답 형식
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

## 📱 컴포넌트 구조

### 폴더 구조
```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (dashboard)/       # 대시보드 페이지
│   ├── api/               # API Routes
│   └── globals.css        # 전역 스타일
├── components/
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── forms/             # 폼 컴포넌트
│   ├── charts/            # 차트/그래프 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── dashboard/         # 대시보드 전용 컴포넌트
├── lib/
│   ├── auth.ts            # 인증 헬퍼
│   ├── database.ts        # DB 연결/쿼리
│   ├── ai.ts              # AI 모델 인터페이스
│   └── utils.ts           # 유틸리티 함수
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript 타입 정의
└── styles/                # 추가 스타일 파일
```

### 상태 관리 구조
```typescript
// 전역 상태 (React Context)
interface AppState {
  user: User | null;
  socialAccounts: SocialAccount[];
  posts: Post[];
  analytics: AnalyticsData;
  ui: {
    theme: 'dark' | 'light';
    language: 'ko' | 'en';
    sidebarOpen: boolean;
  };
}

// 액션 타입
type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_SOCIAL_ACCOUNT'; payload: SocialAccount }
  | { type: 'UPDATE_POST'; payload: { id: string; data: Partial<Post> } }
  | { type: 'SET_ANALYTICS'; payload: AnalyticsData };
```

## 🚀 배포 및 인프라

### Vercel 배포 설정
```javascript
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-key"
  }
}
```

### 환경 변수 관리
```bash
# Development (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx

# Production (Vercel Environment Variables)
# 동일한 키들을 Vercel 대시보드에서 설정
```

## 📊 성능 최적화

### 코드 분할
```typescript
// 동적 임포트로 번들 크기 최적화
const DashboardChart = dynamic(() => import('@/components/charts/DashboardChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

// 페이지별 코드 분할
const AnalyticsPage = lazy(() => import('@/app/(dashboard)/analytics/page'));
```

### 캐싱 전략
```typescript
// API 응답 캐싱
export async function GET(request: Request) {
  const data = await fetchUserPosts(userId);
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
    }
  });
}

// React Query 캐싱
const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () => fetchPosts(userId),
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
});
```

---

**마지막 업데이트**: 2025-06-23  
**다음 업데이트**: 구현 진행에 따라 기술 세부사항 추가
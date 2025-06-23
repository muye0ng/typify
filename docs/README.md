# Typify AI - 문서 가이드

이 폴더에는 Typify AI 프로젝트의 모든 기획, 비즈니스, 개발 관련 문서가 포함되어 있습니다.

## 📋 문서 구조

### 🎯 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **목적**: 프로젝트 전체 기획 및 비전
- **내용**: 
  - 프로젝트 비전 및 목표
  - 핵심 기능 로드맵
  - 타겟 사용자 분석
  - 시장 전략
  - 성공 지표 (KPI)

### 💰 [BUSINESS_MODEL.md](./BUSINESS_MODEL.md)
- **목적**: 수익 모델 및 비즈니스 전략
- **내용**:
  - SaaS 구독 모델 ($19/$39 월정액)
  - 수익 예측 및 목표
  - 마케팅 전략
  - 경쟁 우위 분석
  - 성장 전략

### 🏗️ [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)
- **목적**: 개발 진행 상황 및 계획 추적
- **내용**:
  - 완료된 작업 체크리스트
  - 현재 작업 중인 항목
  - 단기/중기/장기 개발 계획
  - 기술 부채 관리
  - 성능 목표

### 🔧 [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md)
- **목적**: 기술적 구현 세부사항
- **내용**:
  - 시스템 아키텍처
  - 데이터베이스 설계
  - API 설계
  - 보안 정책
  - 성능 최적화 방안

## 🔄 문서 업데이트 규칙

### 업데이트 주기
- **DEVELOPMENT_STATUS.md**: 주간 단위 업데이트
- **PROJECT_OVERVIEW.md**: 월간 또는 주요 방향 변경 시
- **BUSINESS_MODEL.md**: 분기별 또는 비즈니스 모델 변경 시
- **TECHNICAL_SPECS.md**: 기술 스택 변경 또는 아키텍처 변경 시

### 업데이트 담당
- **기획/비즈니스 문서**: 프로덕트 오너
- **개발 관련 문서**: 개발팀 리드
- **Claude Code 세션**: 매 세션마다 자동 업데이트

### 버전 관리
- 각 문서 하단에 "마지막 업데이트: YYYY-MM-DD" 표기
- 주요 변경사항은 Git 커밋 메시지에 기록
- 중요한 결정사항은 별도 Decision Log 작성 고려

## 📊 문서 활용 방법

### 새로운 팀원 온보딩
1. **PROJECT_OVERVIEW.md** → 프로젝트 전체 이해
2. **BUSINESS_MODEL.md** → 비즈니스 모델 학습
3. **TECHNICAL_SPECS.md** → 기술 스택 파악
4. **DEVELOPMENT_STATUS.md** → 현재 상황 파악

### 개발 우선순위 결정
- **DEVELOPMENT_STATUS.md**의 "현재 작업 중" 섹션 확인
- 비즈니스 임팩트와 기술적 복잡도 고려
- 로드맵과 일치하는지 검토

### 기술적 의사결정
- **TECHNICAL_SPECS.md** 참조하여 일관성 유지
- 새로운 기술 도입 시 문서 업데이트
- 아키텍처 변경 시 팀 검토 필수

### 비즈니스 검토
- **BUSINESS_MODEL.md**의 KPI와 실제 성과 비교
- 시장 변화에 따른 전략 조정
- 경쟁사 동향 모니터링 및 대응

## 🤖 Claude Code 활용

### 자동 업데이트
Claude Code는 다음 작업 시 자동으로 문서를 업데이트합니다:
- 새로운 기능 개발 완료 시
- 기술 스택 변경 시
- 주요 마일스톤 달성 시

### 컨텍스트 유지
- **CLAUDE.md** 파일을 통해 세션 간 정보 유지
- 프로젝트 상태를 정확히 파악하여 적절한 개발 방향 제시
- 이전 결정사항과 일관성 있는 개발 진행

### 질문 및 요청
Claude Code에게 다음과 같이 요청할 수 있습니다:
- "현재 개발 상황을 정리해줘"
- "다음 우선순위 작업이 뭐야?"
- "비즈니스 모델에서 수정할 부분이 있나?"
- "기술 부채 중 긴급한 건 뭐야?"

## 🔍 추가 예정 문서

### 사용자 관련
- **USER_RESEARCH.md**: 사용자 리서치 결과
- **UX_GUIDELINES.md**: UX/UI 가이드라인
- **USER_STORIES.md**: 사용자 스토리 모음

### 운영 관련
- **DEPLOYMENT_GUIDE.md**: 배포 가이드
- **MONITORING.md**: 모니터링 및 알림 설정
- **INCIDENT_RESPONSE.md**: 장애 대응 가이드

### 마케팅 관련
- **MARKETING_PLAN.md**: 상세 마케팅 계획
- **CONTENT_STRATEGY.md**: 콘텐츠 마케팅 전략
- **PARTNERSHIP.md**: 파트너십 전략

---

**생성일**: 2025-06-23  
**관리자**: Claude Code  
**업데이트 정책**: 개발 진행에 따라 지속적 업데이트
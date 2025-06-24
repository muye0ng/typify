-- ====================================
-- Supabase 스키마 업데이트 - 플랫폼 선택 필드 추가
-- 온보딩에서 플랫폼 선택 시스템 구현
-- ====================================

-- 1. user_profiles 테이블에 플랫폼 관련 필드 추가
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS selected_platform VARCHAR(20) CHECK (selected_platform IN ('twitter', 'threads'));

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS platform_locked_until TIMESTAMP WITH TIME ZONE;

-- 2. 기존 사용자들을 위한 기본값 설정 (선택 사항)
-- UPDATE user_profiles 
-- SET selected_platform = 'twitter', 
--     platform_locked_until = NOW() + INTERVAL '7 days'
-- WHERE selected_platform IS NULL AND onboarding_completed = true;

-- 3. 확인 쿼리 (주석 해제해서 실행 가능)
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_profiles' 
-- AND column_name IN ('selected_platform', 'platform_locked_until');

-- 4. 테스트 쿼리 - 현재 user_profiles 구조 확인
-- SELECT * FROM user_profiles LIMIT 1;
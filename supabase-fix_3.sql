-- ====================================
-- Supabase 온보딩 데이터 필드 수정
-- UUID 필드를 문자열 필드로 변경 및 플랫폼 필드 추가
-- ====================================

-- 1. 기존 UUID 필드들을 삭제하고 문자열 필드로 재생성
ALTER TABLE user_profiles DROP COLUMN IF EXISTS selected_industry_id;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS selected_tone_id;

-- 2. 문자열 기반 필드들 추가
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS selected_industry VARCHAR(50);

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS selected_tone VARCHAR(50);

-- 3. 플랫폼 관련 필드 추가 (이미 있을 수 있으므로 IF NOT EXISTS 사용)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS selected_platform VARCHAR(20) CHECK (selected_platform IN ('twitter', 'threads'));

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS platform_locked_until TIMESTAMP WITH TIME ZONE;

-- 4. 기존 FK 제약조건들 제거 (있다면)
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS fk_user_profiles_industry;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS fk_user_profiles_tone;

-- 5. 확인 쿼리 (주석 해제해서 실행 가능)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_profiles' 
-- AND column_name IN ('selected_industry', 'selected_tone', 'selected_platform', 'platform_locked_until', 'selected_topics');
-- ====================================
-- Supabase RLS 정책 수정 스크립트
-- Database error saving new user 문제 해결
-- ====================================

-- 1. user_profiles INSERT 정책이 누락된 경우 추가
-- 기존 정책이 있으면 삭제 후 재생성
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. handle_new_user 함수 개선 (RLS 우회)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- RLS를 우회하여 사용자 프로필 생성
    INSERT INTO public.user_profiles (id, email, name, avatar_url, plan, monthly_posts_used, monthly_posts_limit, onboarding_completed)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User'),
        NEW.raw_user_meta_data->>'avatar_url',
        'free',
        0,
        10,
        false
    );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- 에러 발생 시 로깅하지만 auth.users 생성은 계속 진행
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 함수 소유자를 postgres로 설정
ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- 4. 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;

-- 5. 기존 트리거 재생성 (혹시 모를 문제 방지)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. 테스트용 확인 쿼리 (주석 해제해서 실행 가능)
-- SELECT 
--     t.trigger_name,
--     t.event_manipulation,
--     t.action_timing,
--     t.action_statement
-- FROM information_schema.triggers t
-- WHERE t.trigger_name = 'on_auth_user_created';

-- SELECT p.policyname, p.cmd, p.qual, p.with_check
-- FROM pg_policies p 
-- WHERE p.tablename = 'user_profiles';
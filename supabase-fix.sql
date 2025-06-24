-- ====================================
-- Typify Supabase Database Schema
-- Complete setup script for fresh Supabase project
-- ====================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. USER PROFILES TABLE
-- ====================================
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro')),
    monthly_posts_used INTEGER DEFAULT 0,
    monthly_posts_limit INTEGER DEFAULT 10,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    selected_industry_id UUID,
    selected_tone_id UUID,
    selected_topics TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 2. INDUSTRIES TABLE
-- ====================================
CREATE TABLE industries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ko TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 3. TONES TABLE
-- ====================================
CREATE TABLE tones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ko TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 4. TOPICS TABLE
-- ====================================
CREATE TABLE topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL,
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 5. CONTENT TEMPLATES TABLE
-- ====================================
CREATE TABLE content_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL,
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
    tone_id UUID REFERENCES tones(id) ON DELETE CASCADE,
    template_ko TEXT NOT NULL,
    template_en TEXT NOT NULL,
    variables JSONB, -- { "variables": ["company_name", "product_name"] }
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 6. POSTS TABLE
-- ====================================
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    platform VARCHAR(20) CHECK (platform IN ('twitter', 'threads')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    template_id UUID REFERENCES content_templates(id),
    engagement_impressions INTEGER DEFAULT 0,
    engagement_likes INTEGER DEFAULT 0,
    engagement_comments INTEGER DEFAULT 0,
    engagement_shares INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 7. PLATFORM CONNECTIONS TABLE
-- ====================================
CREATE TABLE platform_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform VARCHAR(20) CHECK (platform IN ('twitter', 'threads')),
    platform_user_id TEXT NOT NULL,
    platform_username TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- ====================================
-- 8. SCHEDULING TABLE
-- ====================================
CREATE TABLE scheduling_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform VARCHAR(20) CHECK (platform IN ('twitter', 'threads')),
    days_of_week INTEGER[] CHECK (array_length(days_of_week, 1) > 0), -- 0=Sunday, 1=Monday, etc.
    times_of_day TIME[],
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 9. USAGE ANALYTICS TABLE
-- ====================================
CREATE TABLE usage_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    posts_generated INTEGER DEFAULT 0,
    posts_published INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- ====================================
-- 10. BILLING TABLE
-- ====================================
CREATE TABLE billing_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan VARCHAR(20) CHECK (plan IN ('free', 'basic', 'pro')),
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period_start DATE,
    billing_period_end DATE,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    external_payment_id TEXT, -- LemonSqueezy payment ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 11. ADMIN LOGS TABLE
-- ====================================
CREATE TABLE admin_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_type TEXT, -- 'user', 'post', 'template', etc.
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 12. SYSTEM SETTINGS TABLE
-- ====================================
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- ====================================
-- FOREIGN KEY CONSTRAINTS
-- ====================================
ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_industry 
    FOREIGN KEY (selected_industry_id) REFERENCES industries(id);

ALTER TABLE user_profiles ADD CONSTRAINT fk_user_profiles_tone 
    FOREIGN KEY (selected_tone_id) REFERENCES tones(id);

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_for ON posts(scheduled_for);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_usage_analytics_user_date ON usage_analytics(user_id, date);
CREATE INDEX idx_platform_connections_user_platform ON platform_connections(user_id, platform);

-- ====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduling_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Posts Policies
CREATE POLICY "Users can view their own posts" ON posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON posts
    FOR DELETE USING (auth.uid() = user_id);

-- Platform Connections Policies
CREATE POLICY "Users can view their own platform connections" ON platform_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own platform connections" ON platform_connections
    FOR ALL USING (auth.uid() = user_id);

-- Scheduling Rules Policies
CREATE POLICY "Users can manage their own scheduling rules" ON scheduling_rules
    FOR ALL USING (auth.uid() = user_id);

-- Usage Analytics Policies
CREATE POLICY "Users can view their own usage analytics" ON usage_analytics
    FOR SELECT USING (auth.uid() = user_id);

-- Billing Records Policies
CREATE POLICY "Users can view their own billing records" ON billing_records
    FOR SELECT USING (auth.uid() = user_id);

-- Public read access for reference tables
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tones ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to industries" ON industries FOR SELECT USING (true);
CREATE POLICY "Public read access to tones" ON tones FOR SELECT USING (true);
CREATE POLICY "Public read access to topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read access to content templates" ON content_templates FOR SELECT USING (true);

-- ====================================
-- FUNCTIONS
-- ====================================

-- Function to handle new user creation
-- Function to handle new user creation (bypasses RLS)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions to the function
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.user_profiles TO postgres;

-- Function to increment post usage
CREATE OR REPLACE FUNCTION increment_post_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
        UPDATE user_profiles 
        SET monthly_posts_used = monthly_posts_used + 1,
            updated_at = NOW()
        WHERE id = NEW.user_id;
        
        -- Update daily analytics
        INSERT INTO usage_analytics (user_id, date, posts_published)
        VALUES (NEW.user_id, CURRENT_DATE, 1)
        ON CONFLICT (user_id, date)
        DO UPDATE SET posts_published = usage_analytics.posts_published + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update post engagement stats
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.engagement_impressions != OLD.engagement_impressions OR 
       NEW.engagement_likes != OLD.engagement_likes OR 
       NEW.engagement_comments != OLD.engagement_comments OR 
       NEW.engagement_shares != OLD.engagement_shares THEN
        
        UPDATE usage_analytics 
        SET total_impressions = (
            SELECT COALESCE(SUM(engagement_impressions), 0) 
            FROM posts 
            WHERE user_id = NEW.user_id 
            AND DATE(created_at) = CURRENT_DATE
        ),
        total_engagement = (
            SELECT COALESCE(SUM(engagement_likes + engagement_comments + engagement_shares), 0) 
            FROM posts 
            WHERE user_id = NEW.user_id 
            AND DATE(created_at) = CURRENT_DATE
        )
        WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly usage (called by cron job)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET monthly_posts_used = 0,
        updated_at = NOW()
    WHERE date_trunc('month', updated_at) < date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- TRIGGERS
-- ====================================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger for post usage tracking
CREATE TRIGGER on_post_published
    AFTER INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION increment_post_usage();

-- Trigger for post engagement updates
CREATE TRIGGER on_post_engagement_updated
    AFTER UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_post_stats();

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- INITIAL DATA
-- ====================================

-- Insert Industries
INSERT INTO industries (name_ko, name_en, description_ko, description_en) VALUES
('기술/IT', 'Technology/IT', 'IT 서비스, 소프트웨어, 하드웨어 관련', 'IT services, software, and hardware related'),
('전자상거래', 'E-commerce', '온라인 쇼핑몰, 마켓플레이스', 'Online shopping, marketplaces'),
('교육', 'Education', '온라인 강의, 교육 서비스', 'Online courses, educational services'),  
('건강/피트니스', 'Health/Fitness', '헬스케어, 웰니스, 운동', 'Healthcare, wellness, exercise'),
('음식/요리', 'Food/Cooking', '레스토랑, 요리, 음식 배달', 'Restaurants, cooking, food delivery'),
('패션/뷰티', 'Fashion/Beauty', '의류, 화장품, 스타일링', 'Clothing, cosmetics, styling'),
('여행', 'Travel', '여행사, 숙박, 관광', 'Travel agencies, accommodation, tourism'),
('금융', 'Finance', '은행, 투자, 핀테크', 'Banking, investment, fintech'),
('부동산', 'Real Estate', '부동산 매매, 임대', 'Property sales and rental'),
('예술/창작', 'Arts/Creative', '디자인, 예술, 창작 활동', 'Design, arts, creative activities');

-- Insert Tones
INSERT INTO tones (name_ko, name_en, description_ko, description_en) VALUES
('전문적', 'Professional', '비즈니스에 적합한 공식적인 톤', 'Formal tone suitable for business'),
('친근한', 'Friendly', '따뜻하고 접근하기 쉬운 톤', 'Warm and approachable tone'),
('열정적', 'Enthusiastic', '에너지 넘치고 역동적인 톤', 'Energetic and dynamic tone'),
('유머러스', 'Humorous', '재미있고 위트 있는 톤', 'Fun and witty tone'),
('교육적', 'Educational', '정보 전달에 집중한 톤', 'Focused on information delivery'),
('영감을 주는', 'Inspirational', '동기부여하고 격려하는 톤', 'Motivating and encouraging tone'),
('신뢰할 수 있는', 'Trustworthy', '믿음직하고 안정적인 톤', 'Reliable and stable tone'),
('창의적', 'Creative', '독창적이고 혁신적인 톤', 'Original and innovative tone');

-- Insert Topics for Technology/IT industry
INSERT INTO topics (name_ko, name_en, industry_id) VALUES
('인공지능', 'Artificial Intelligence', (SELECT id FROM industries WHERE name_en = 'Technology/IT')),
('클라우드 컴퓨팅', 'Cloud Computing', (SELECT id FROM industries WHERE name_en = 'Technology/IT')),
('사이버 보안', 'Cybersecurity', (SELECT id FROM industries WHERE name_en = 'Technology/IT')),
('모바일 앱 개발', 'Mobile App Development', (SELECT id FROM industries WHERE name_en = 'Technology/IT')),
('웹 개발', 'Web Development', (SELECT id FROM industries WHERE name_en = 'Technology/IT'));

-- Insert sample content templates
INSERT INTO content_templates (name_ko, name_en, industry_id, tone_id, template_ko, template_en, variables) VALUES
('기술 업데이트 공지', 'Tech Update Announcement', 
 (SELECT id FROM industries WHERE name_en = 'Technology/IT'),
 (SELECT id FROM tones WHERE name_en = 'Professional'),
 '🚀 {{product_name}}의 새로운 기능을 소개합니다! {{feature_description}} #기술혁신 #업데이트',
 '🚀 Introducing new features in {{product_name}}! {{feature_description}} #TechInnovation #Update',
 '{"variables": ["product_name", "feature_description"]}'),

('친근한 서비스 소개', 'Friendly Service Introduction',
 (SELECT id FROM industries WHERE name_en = 'E-commerce'),
 (SELECT id FROM tones WHERE name_en = 'Friendly'),
 '안녕하세요! {{company_name}}에서 {{service_name}}을 새롭게 선보입니다. {{benefit}} 지금 바로 확인해보세요! 💝',
 'Hello! {{company_name}} is excited to introduce {{service_name}}. {{benefit}} Check it out now! 💝',
 '{"variables": ["company_name", "service_name", "benefit"]}');

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('monthly_post_limits', '{"free": 10, "basic": 100, "pro": 500}', 'Monthly post limits by plan'),
('supported_platforms', '["twitter", "threads"]', 'List of supported social media platforms'),
('default_timezone', '"UTC"', 'Default timezone for scheduling'),
('maintenance_mode', 'false', 'System maintenance mode flag');

-- ====================================
-- USEFUL VIEWS
-- ====================================

-- View for user dashboard data
CREATE VIEW user_dashboard_stats AS
SELECT 
    up.id,
    up.name,
    up.plan,
    up.monthly_posts_used,
    up.monthly_posts_limit,
    COUNT(p.id) FILTER (WHERE p.created_at >= date_trunc('month', CURRENT_DATE)) as posts_this_month,
    COUNT(p.id) FILTER (WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 days') as posts_this_week,
    COALESCE(SUM(p.engagement_impressions), 0) as total_impressions,
    COALESCE(SUM(p.engagement_likes + p.engagement_comments + p.engagement_shares), 0) as total_engagement
FROM user_profiles up
LEFT JOIN posts p ON up.id = p.user_id
GROUP BY up.id, up.name, up.plan, up.monthly_posts_used, up.monthly_posts_limit;

-- View for admin dashboard
CREATE VIEW admin_user_overview AS
SELECT 
    up.id,
    up.name,
    up.email,
    up.plan,
    up.created_at as joined_at,
    COUNT(p.id) as total_posts,
    up.monthly_posts_used,
    up.onboarding_completed,
    COUNT(pc.id) as connected_platforms
FROM user_profiles up
LEFT JOIN posts p ON up.id = p.user_id
LEFT JOIN platform_connections pc ON up.id = pc.user_id AND pc.is_active = true
GROUP BY up.id, up.name, up.email, up.plan, up.created_at, up.monthly_posts_used, up.onboarding_completed;

-- ====================================
-- ADMIN FUNCTIONS
-- ====================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_posts BIGINT,
    published_posts BIGINT,
    scheduled_posts BIGINT,
    total_impressions BIGINT,
    total_engagement BIGINT,
    avg_engagement_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_posts,
        COUNT(*) FILTER (WHERE status = 'published') as published_posts,
        COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_posts,
        COALESCE(SUM(engagement_impressions), 0) as total_impressions,
        COALESCE(SUM(engagement_likes + engagement_comments + engagement_shares), 0) as total_engagement,
        CASE 
            WHEN SUM(engagement_impressions) > 0 
            THEN ROUND((SUM(engagement_likes + engagement_comments + engagement_shares)::NUMERIC / SUM(engagement_impressions)) * 100, 2)
            ELSE 0
        END as avg_engagement_rate
    FROM posts 
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade user plan
CREATE OR REPLACE FUNCTION upgrade_user_plan(user_uuid UUID, new_plan TEXT)
RETURNS void AS $$
DECLARE
    new_limit INTEGER;
BEGIN
    -- Set new post limit based on plan
    CASE new_plan
        WHEN 'free' THEN new_limit := 10;
        WHEN 'basic' THEN new_limit := 100;
        WHEN 'pro' THEN new_limit := 500;
        ELSE RAISE EXCEPTION 'Invalid plan: %', new_plan;
    END CASE;
    
    UPDATE user_profiles 
    SET plan = new_plan,
        monthly_posts_limit = new_limit,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Log the plan change
    INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details)
    VALUES (
        auth.uid(),
        'plan_upgrade',
        'user',
        user_uuid,
        json_build_object('new_plan', new_plan, 'new_limit', new_limit)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- COMMENTS
-- ====================================

COMMENT ON TABLE user_profiles IS 'Extended user profile information linked to Supabase Auth';
COMMENT ON TABLE posts IS 'Social media posts created by users';
COMMENT ON TABLE industries IS 'Business industry categories for content personalization';
COMMENT ON TABLE tones IS 'Content tone/style options';
COMMENT ON TABLE topics IS 'Content topics within each industry';
COMMENT ON TABLE content_templates IS 'Pre-defined content templates for post generation';
COMMENT ON TABLE platform_connections IS 'User social media platform connections and tokens';
COMMENT ON TABLE scheduling_rules IS 'User-defined posting schedules';
COMMENT ON TABLE usage_analytics IS 'Daily usage statistics per user';
COMMENT ON TABLE billing_records IS 'Payment and subscription records';
COMMENT ON TABLE admin_logs IS 'Admin action audit trail';
COMMENT ON TABLE system_settings IS 'Application-wide configuration settings';

-- ====================================
-- COMPLETION MESSAGE
-- ====================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Typify Database Setup Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: 12';
    RAISE NOTICE 'Triggers created: 4';
    RAISE NOTICE 'Functions created: 6';
    RAISE NOTICE 'RLS policies: Enabled for all user tables';
    RAISE NOTICE 'Initial data: Industries, tones, topics, templates';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Configure Supabase Auth providers';
    RAISE NOTICE '2. Set up environment variables in your app';
    RAISE NOTICE '3. Test user registration and profile creation';
    RAISE NOTICE '========================================';
END $$;
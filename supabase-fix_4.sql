-- ====================================
-- Fix Google OAuth User Names
-- Updates users whose names are email addresses to use their Google display names
-- ====================================

-- This is a utility script to help fix existing users who have email addresses as names
-- Run this script after the auth.tsx fix is deployed

-- The following query would need to be run manually in the Supabase dashboard
-- since we can't access Google metadata from SQL directly

-- To identify users who need name updates (names that look like emails):
-- SELECT id, name, email 
-- FROM user_profiles 
-- WHERE name LIKE '%@%' AND name = email;

-- To manually update a specific user's name:
-- UPDATE user_profiles 
-- SET name = 'User Display Name', updated_at = NOW()
-- WHERE id = 'user-uuid-here';

-- Note: The main fix is in the auth.tsx file which will handle new logins correctly.
-- Existing users can update their names through the Settings page.

-- Add a comment to track this fix
COMMENT ON TABLE user_profiles IS 'Updated 2024: Fixed Google OAuth name extraction to use full_name metadata';
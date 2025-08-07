-- Check if token tables exist and their structure
-- Run this in your Supabase SQL Editor

-- Check if user_tokens table exists
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_tokens' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if token_claims table exists
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'token_claims' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('user_tokens', 'token_claims');

-- Check if there are any user_tokens records
SELECT COUNT(*) as user_tokens_count FROM public.user_tokens;

-- Check if there are any token_claims records
SELECT COUNT(*) as token_claims_count FROM public.token_claims;

-- Check current user's token record (replace with your user ID)
-- SELECT * FROM public.user_tokens WHERE user_id = 'your-user-id-here'; 
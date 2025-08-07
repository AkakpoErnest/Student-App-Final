-- Fix token tables and policies for StuFind
-- Run this in your Supabase SQL Editor

-- 1. Ensure user_tokens table exists and has correct structure
CREATE TABLE IF NOT EXISTS public.user_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Ensure token_claims table exists and has correct structure
CREATE TABLE IF NOT EXISTS public.token_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  claim_type TEXT NOT NULL,
  tokens_earned INTEGER NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 3. Enable RLS on both tables
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_claims ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can insert their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can view their own claims" ON public.token_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.token_claims;

-- 5. Create new policies
CREATE POLICY "Users can view their own tokens" 
  ON public.user_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens" 
  ON public.user_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" 
  ON public.user_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own claims" 
  ON public.token_claims 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claims" 
  ON public.token_claims 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 6. Add unique constraint to prevent duplicate daily claims
ALTER TABLE public.token_claims DROP CONSTRAINT IF EXISTS unique_daily_claim;
ALTER TABLE public.token_claims ADD CONSTRAINT unique_daily_claim 
  UNIQUE (user_id, claim_type, claim_date);

-- 7. Create function to initialize user tokens
CREATE OR REPLACE FUNCTION public.initialize_user_tokens()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user_tokens record already exists
  IF NOT EXISTS (SELECT 1 FROM public.user_tokens WHERE user_id = NEW.id) THEN
    INSERT INTO public.user_tokens (user_id, balance, created_at, updated_at)
    VALUES (NEW.id, 0, now(), now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created_initialize_tokens ON auth.users;
CREATE TRIGGER on_auth_user_created_initialize_tokens
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_tokens();

-- 9. Initialize tokens for existing users who don't have them
INSERT INTO public.user_tokens (user_id, balance, created_at, updated_at)
SELECT id, 0, now(), now()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_tokens);

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_tokens TO authenticated;
GRANT ALL ON public.token_claims TO authenticated; 
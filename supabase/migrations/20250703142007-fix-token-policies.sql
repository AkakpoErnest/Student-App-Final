-- Fix token table RLS policies to ensure they work correctly
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can insert their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON public.user_tokens;
DROP POLICY IF EXISTS "Users can view their own claims" ON public.token_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.token_claims;

-- Recreate policies with better conditions
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

-- Ensure the trigger function exists and works
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

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created_initialize_tokens ON auth.users;
CREATE TRIGGER on_auth_user_created_initialize_tokens
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_tokens();

-- Add a function to manually initialize tokens for existing users
CREATE OR REPLACE FUNCTION public.initialize_existing_user_tokens(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if user_tokens record already exists
  IF NOT EXISTS (SELECT 1 FROM public.user_tokens WHERE user_id = user_uuid) THEN
    INSERT INTO public.user_tokens (user_id, balance, created_at, updated_at)
    VALUES (user_uuid, 0, now(), now());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
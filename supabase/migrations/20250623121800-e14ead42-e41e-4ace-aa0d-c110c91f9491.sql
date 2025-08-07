
-- Create table to track user tokens
CREATE TABLE public.user_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track token claims and rewards
CREATE TABLE public.token_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  claim_type TEXT NOT NULL, -- 'signup', 'daily', 'email_verification', etc.
  tokens_earned INTEGER NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Add Row Level Security
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_claims ENABLE ROW LEVEL SECURITY;

-- Create policies for user_tokens
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

-- Create policies for token_claims
CREATE POLICY "Users can view their own claims" 
  ON public.token_claims 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claims" 
  ON public.token_claims 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate daily claims
ALTER TABLE public.token_claims ADD CONSTRAINT unique_daily_claim 
  UNIQUE (user_id, claim_type, claim_date);

-- Create function to initialize user tokens on signup
CREATE OR REPLACE FUNCTION public.initialize_user_tokens()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_tokens (user_id, balance)
  VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize tokens when user signs up
CREATE TRIGGER on_auth_user_created_initialize_tokens
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_tokens();

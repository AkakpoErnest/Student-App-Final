
-- Add verification fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id TEXT;

-- Add check constraint for verification status
ALTER TABLE public.profiles ADD CONSTRAINT verification_status_check 
CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON public.profiles(verification_status);

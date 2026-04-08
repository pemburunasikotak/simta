-- Add dosen_pembimbing_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dosen_pembimbing_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

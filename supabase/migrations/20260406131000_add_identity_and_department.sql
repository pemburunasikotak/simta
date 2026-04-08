-- Migration: Add identity_number and department to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS identity_number TEXT,
ADD COLUMN IF NOT EXISTS department TEXT;

-- Update existing data if needed (optional)
-- For example, pulling from specialized tables
UPDATE public.profiles p
SET identity_number = m.nim
FROM public.mahasiswa m
WHERE p.id = m.id AND p.identity_number IS NULL;

UPDATE public.profiles p
SET identity_number = d.nip
FROM public.dosen d
WHERE p.id = d.id AND p.identity_number IS NULL;

UPDATE public.profiles p
SET identity_number = a.nip
FROM public.akademik a
WHERE p.id = a.id AND p.identity_number IS NULL;

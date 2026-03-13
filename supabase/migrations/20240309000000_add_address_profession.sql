-- Add address and profession columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN address TEXT,
ADD COLUMN profession TEXT;

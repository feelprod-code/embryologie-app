-- Add address and profession columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession TEXT;

-- Update the trigger function to capture these fields on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, address, profession)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'profession'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add location and address columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Update the handle_new_user function to capture location/address
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, profession, location, address)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'profession',
    COALESCE(NEW.raw_user_meta_data->>'location', NEW.raw_user_meta_data->>'address', NEW.raw_user_meta_data->>'city'),
    COALESCE(NEW.raw_user_meta_data->>'address', NEW.raw_user_meta_data->>'location', NEW.raw_user_meta_data->>'city')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function that prevents non-admins from modifying 'is_premium'
CREATE OR REPLACE FUNCTION public.protect_is_premium_column()
RETURNS trigger AS $$
BEGIN
  -- If the user modifying the row is an authenticated user (client side)
  IF auth.role() = 'authenticated' THEN
    -- Is it an admin?
    IF auth.email() IN (
      'guillaumephilippe1968@gmail.com',
      'philippe.guillaume@icloud.com',
      'ludovicg13@gmail.com',
      'guillaumephilippe@me.com',
      'sabrinakhanouche@gmail.com'
    ) THEN
      RETURN NEW;
    END IF;

    -- Not an admin: securely force is_premium to default/unchanged status
    IF TG_OP = 'INSERT' THEN
      NEW.is_premium = false;
    ELSIF TG_OP = 'UPDATE' THEN
      NEW.is_premium = OLD.is_premium;
    END IF;
  END IF;
  
  -- Service Role (Webhooks), Superuser, and Admins can update it fine
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the trigger to profiles
DROP TRIGGER IF EXISTS protect_is_premium_trigger ON public.profiles;
CREATE TRIGGER protect_is_premium_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_is_premium_column();

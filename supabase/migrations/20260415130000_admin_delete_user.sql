-- Function to allow administrators to completely delete a test user (including from auth.users)
CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Allows the function to bypass RLS and delete from auth.users
AS $$
BEGIN
  -- Strict check: ensure the caller is an admin
  IF (auth.jwt()->>'email' IN ('guillaumephilippe1968@gmail.com', 'marc@damoiseaux.be', 'vip@feelprod.com')) THEN
    -- Delete from profiles first to avoid any foreign key locking issues
    DELETE FROM public.profiles WHERE id = target_user_id;
    -- Delete the core identity from Supabase Auth so they can register again fresh
    DELETE FROM auth.users WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Non autorisé. Seul un administrateur peut supprimer un compte.';
  END IF;
END;
$$;

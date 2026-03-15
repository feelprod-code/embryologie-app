-- Add is_premium column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Disable RLS for now to ensure Webhook can update it, or add a proper policy
-- Since the webhook will use the Service Role key, it bypasses RLS anyway.

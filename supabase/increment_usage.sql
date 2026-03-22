-- Run this AFTER schema.sql in your Supabase SQL Editor
-- Atomic usage increment to prevent race conditions

CREATE OR REPLACE FUNCTION increment_usage(key_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE api_keys
  SET requests_used = requests_used + 1,
      updated_at = now()
  WHERE id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Content Repurpose API — Schema Migration v2
-- Run this in your Supabase SQL Editor AFTER the initial schema
-- Adds user_id column to link api_keys with Supabase Auth users
-- ============================================================

-- 1. Add user_id column (nullable for backwards compat with existing rows)
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Index for fast lookups by user_id
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- 3. Update RLS to allow authenticated users to read their own api_keys
-- Drop old "block public" policy first if it blocks authenticated users
DROP POLICY IF EXISTS "Block public access on api_keys" ON api_keys;

-- Allow authenticated users to read their own rows
CREATE POLICY "Users can read own api_keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Keep service role full access
-- (already created in schema.sql, but safe to re-run)
DROP POLICY IF EXISTS "Service role full access on api_keys" ON api_keys;
CREATE POLICY "Service role full access on api_keys"
  ON api_keys FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Block non-authenticated, non-service-role access
CREATE POLICY "Block anon access on api_keys"
  ON api_keys FOR ALL
  USING (auth.role() = 'service_role' OR auth.uid() = user_id);

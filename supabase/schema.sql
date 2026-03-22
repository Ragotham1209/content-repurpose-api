-- ============================================================
-- Content Repurpose API — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'scale', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  requests_used INTEGER NOT NULL DEFAULT 0,
  requests_limit INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast key lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys (key);
CREATE INDEX IF NOT EXISTS idx_api_keys_email ON api_keys (email);
CREATE INDEX IF NOT EXISTS idx_api_keys_stripe_customer ON api_keys (stripe_customer_id);

-- 2. Usage logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  tokens_used INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'rate_limited')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_api_key ON usage_logs (api_key_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs (created_at);

-- 3. Monthly usage reset function (run via Supabase cron or pg_cron)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE api_keys SET requests_used = 0, updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on api_keys"
  ON api_keys FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on usage_logs"
  ON usage_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Block public/anon access
CREATE POLICY "Block public access on api_keys"
  ON api_keys FOR ALL
  USING (false);

CREATE POLICY "Block public access on usage_logs"
  ON usage_logs FOR ALL
  USING (false);

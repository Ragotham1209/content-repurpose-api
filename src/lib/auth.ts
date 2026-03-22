import { supabase } from './supabase';
import crypto from 'crypto';

export interface ApiKeyRecord {
  id: string;
  key: string;
  email: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  requests_used: number;
  requests_limit: number;
  created_at: string;
}

// Plan limits
export const PLAN_LIMITS: Record<string, { requests: number; platforms: string[] }> = {
  free: { requests: 100, platforms: ['twitter', 'linkedin', 'reddit'] },
  starter: { requests: 1000, platforms: ['twitter', 'linkedin', 'reddit', 'email', 'instagram'] },
  pro: { requests: 5000, platforms: ['twitter', 'linkedin', 'reddit', 'email', 'instagram'] },
  scale: { requests: 25000, platforms: ['twitter', 'linkedin', 'reddit', 'email', 'instagram'] },
  enterprise: { requests: 100000, platforms: ['twitter', 'linkedin', 'reddit', 'email', 'instagram'] },
};

/**
 * Generate a new API key
 */
export function generateApiKey(): string {
  const prefix = 'rp_live_';
  const random = crypto.randomBytes(24).toString('base64url');
  return `${prefix}${random}`;
}

/**
 * Validate an API key from the x-api-key header.
 * Returns the key record if valid, or null.
 */
export async function validateApiKey(
  apiKey: string | null
): Promise<{ valid: true; record: ApiKeyRecord } | { valid: false; error: string; status: number }> {
  if (!apiKey) {
    return { valid: false, error: 'Missing x-api-key header', status: 401 };
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key', apiKey)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Invalid API key', status: 401 };
  }

  const record = data as ApiKeyRecord;

  if (record.requests_used >= record.requests_limit) {
    return {
      valid: false,
      error: `Rate limit exceeded. ${record.requests_used}/${record.requests_limit} requests used this month. Upgrade at ${process.env.NEXT_PUBLIC_APP_URL}/docs#pricing`,
      status: 429,
    };
  }

  return { valid: true, record };
}

/**
 * Increment usage count and log the request
 */
export async function trackUsage(
  apiKeyId: string,
  endpoint: string,
  platforms: string[],
  tokensUsed: number,
  latencyMs: number,
  status: 'success' | 'error' | 'rate_limited' = 'success'
): Promise<void> {
  // Increment counter
  await supabase.rpc('', {}).catch(() => {});
  await supabase
    .from('api_keys')
    .update({
      requests_used: supabase.rpc ? undefined : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', apiKeyId);

  // Use a raw SQL increment to avoid race conditions
  await supabase.from('api_keys').update({
    updated_at: new Date().toISOString(),
  }).eq('id', apiKeyId);

  // Simpler: just increment via raw query
  const { error: incrementError } = await supabase.rpc('increment_usage', {
    key_id: apiKeyId,
  }).catch(() => ({ error: null })) as any;

  // If RPC doesn't exist, do a manual read-increment-write
  if (incrementError) {
    const { data: current } = await supabase
      .from('api_keys')
      .select('requests_used')
      .eq('id', apiKeyId)
      .single();

    if (current) {
      await supabase
        .from('api_keys')
        .update({ requests_used: current.requests_used + 1, updated_at: new Date().toISOString() })
        .eq('id', apiKeyId);
    }
  }

  // Log usage
  await supabase.from('usage_logs').insert({
    api_key_id: apiKeyId,
    endpoint,
    platforms,
    tokens_used: tokensUsed,
    latency_ms: latencyMs,
    status,
  });
}

/**
 * Check if a platform is allowed for the user's plan
 */
export function getAllowedPlatforms(plan: string): string[] {
  return PLAN_LIMITS[plan]?.platforms || PLAN_LIMITS.free.platforms;
}

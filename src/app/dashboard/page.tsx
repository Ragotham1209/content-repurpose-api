import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';
import { supabase as adminSupabase } from '@/lib/supabase';
import { PLAN_LIMITS } from '@/lib/auth';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's API key record
  let { data: apiKey } = await adminSupabase
    .from('api_keys')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fallback: match by email for pre-auth signups
  if (!apiKey && user.email) {
    const { data: emailMatch } = await adminSupabase
      .from('api_keys')
      .select('*')
      .eq('email', user.email)
      .single();

    if (emailMatch) {
      // Backfill user_id
      await adminSupabase
        .from('api_keys')
        .update({ user_id: user.id })
        .eq('id', emailMatch.id);
      apiKey = emailMatch;
    }
  }

  // Fetch recent usage logs
  let recentLogs: any[] = [];
  if (apiKey) {
    const { data: logs } = await adminSupabase
      .from('usage_logs')
      .select('endpoint, platforms, tokens_used, latency_ms, status, created_at')
      .eq('api_key_id', apiKey.id)
      .order('created_at', { ascending: false })
      .limit(10);
    recentLogs = logs || [];
  }

  const plan = apiKey?.plan || 'free';
  const planLimits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  return (
    <DashboardClient
      user={{ email: user.email || '' }}
      apiKey={apiKey ? {
        key: apiKey.key,
        plan: apiKey.plan,
        requests_used: apiKey.requests_used,
        requests_limit: apiKey.requests_limit,
        created_at: apiKey.created_at,
      } : null}
      allowedPlatforms={planLimits.platforms}
      recentLogs={recentLogs}
    />
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

interface DashboardProps {
  user: { email: string };
  apiKey: {
    key: string;
    plan: string;
    requests_used: number;
    requests_limit: number;
    created_at: string;
  } | null;
  allowedPlatforms: string[];
  recentLogs: Array<{
    endpoint: string;
    platforms: string[];
    tokens_used: number;
    latency_ms: number;
    status: string;
    created_at: string;
  }>;
}

// placeholder — filled in below
export default function DashboardClient({ user, apiKey, allowedPlatforms, recentLogs }: DashboardProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <DashboardNav email={user.email} />
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-16 space-y-8">
        {apiKey ? (
          <>
            <PlanBanner plan={apiKey.plan} used={apiKey.requests_used} limit={apiKey.requests_limit} />
            <ApiKeySection apiKeyValue={apiKey.key} />
            <UsageSection used={apiKey.requests_used} limit={apiKey.requests_limit} platforms={allowedPlatforms} />
            <UpgradeSection currentPlan={apiKey.plan} />
            <RecentRequests logs={recentLogs} />
          </>
        ) : (
          <NoKeyState />
        )}
      </div>
    </main>
  );
}

/* ---- NAV ---- */
function DashboardNav({ email }: { email: string }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="border-b border-[#222] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
      <a href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#00ff9d] flex items-center justify-center text-black font-bold text-sm">R</div>
        <span className="font-semibold text-white">Repurpose API</span>
      </a>
      <div className="flex items-center gap-4 text-sm">
        <a href="/docs" className="text-[#888] hover:text-white transition-colors">Docs</a>
        <span className="text-[#555]">{email}</span>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="bg-[#222] hover:bg-[#333] text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          {signingOut ? '...' : 'Sign Out'}
        </button>
      </div>
    </nav>
  );
}

/* ---- PLAN BANNER ---- */
function PlanBanner({ plan, used, limit }: { plan: string; used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const isWarning = pct > 80;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#888] text-sm mt-1">
          {used.toLocaleString()} / {limit.toLocaleString()} requests used this month
        </p>
      </div>
      <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold uppercase ${
        plan === 'free' ? 'bg-[#222] text-[#888]' :
        plan === 'starter' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
        plan === 'pro' ? 'bg-[#0a1a10] text-[#00ff9d] border border-[#00ff9d]/20' :
        'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      }`}>
        {plan}
      </div>
    </div>
  );
}

/* ---- API KEY ---- */
function ApiKeySection({ apiKeyValue }: { apiKeyValue: string }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  function copy() {
    navigator.clipboard.writeText(apiKeyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const masked = apiKeyValue.slice(0, 12) + '••••••••••••••••' + apiKeyValue.slice(-4);

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold">API Key</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setRevealed(!revealed)}
            className="bg-[#222] hover:bg-[#333] text-white text-xs px-3 py-1.5 rounded transition-colors"
          >
            {revealed ? 'Hide' : 'Reveal'}
          </button>
          <button
            onClick={copy}
            className="bg-[#222] hover:bg-[#333] text-white text-xs px-3 py-1.5 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 font-mono text-sm text-[#00ff9d] break-all">
        {revealed ? apiKeyValue : masked}
      </div>
    </div>
  );
}

/* ---- USAGE ---- */
function UsageSection({ used, limit, platforms }: { used: number; limit: number; platforms: string[] }) {
  const pct = Math.min((used / limit) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <h3 className="text-sm text-[#888] mb-3">Usage This Month</h3>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold text-white">{used.toLocaleString()}</span>
          <span className="text-[#888] text-sm mb-1">/ {limit.toLocaleString()}</span>
        </div>
        <div className="w-full bg-[#222] rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${pct > 80 ? 'bg-red-500' : 'bg-[#00ff9d]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-[#555] mt-2">{Math.max(limit - used, 0).toLocaleString()} requests remaining</p>
      </div>
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <h3 className="text-sm text-[#888] mb-3">Available Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <span key={p} className="bg-[#222] text-white text-xs px-3 py-1.5 rounded-full font-mono">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- UPGRADE ---- */
const PLANS = [
  { key: 'starter', name: 'Starter', price: '$29/mo', calls: '1,000 calls/mo', features: 'All platforms' },
  { key: 'pro', name: 'Pro', price: '$79/mo', calls: '5,000 calls/mo', features: 'All + bulk endpoint' },
  { key: 'scale', name: 'Scale', price: '$199/mo', calls: '25,000 calls/mo', features: 'All + webhooks' },
];

function UpgradeSection({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout');
      }
    } catch {
      alert('Network error');
    } finally {
      setLoading(null);
    }
  }

  const planOrder = ['free', 'starter', 'pro', 'scale', 'enterprise'];
  const currentIndex = planOrder.indexOf(currentPlan);

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
      <h2 className="text-white font-semibold mb-4">Upgrade Plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLANS.map(p => {
          const isActive = p.key === currentPlan;
          const isLower = planOrder.indexOf(p.key) <= currentIndex;

          return (
            <div key={p.key} className={`border rounded-xl p-4 ${isActive ? 'border-[#00ff9d]/30 bg-[#0a1a10]' : 'border-[#222]'}`}>
              <div className="text-xs font-mono text-[#888] mb-1">{p.name}</div>
              <div className="text-xl font-bold text-white mb-2">{p.price}</div>
              <div className="text-xs text-[#888] space-y-1 mb-4">
                <div>{p.calls}</div>
                <div>{p.features}</div>
              </div>
              {isActive ? (
                <div className="text-center py-2 rounded-lg text-xs font-medium bg-[#00ff9d]/10 text-[#00ff9d]">
                  Current Plan
                </div>
              ) : isLower ? (
                <div className="text-center py-2 rounded-lg text-xs font-medium bg-[#222] text-[#555]">
                  Included
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(p.key)}
                  disabled={loading === p.key}
                  className="w-full py-2 rounded-lg text-xs font-medium bg-[#00ff9d] text-black hover:bg-[#00e68a] transition-colors disabled:opacity-50"
                >
                  {loading === p.key ? 'Loading...' : 'Upgrade'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- RECENT REQUESTS ---- */
function RecentRequests({ logs }: { logs: DashboardProps['recentLogs'] }) {
  if (logs.length === 0) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 text-center">
        <p className="text-[#888] text-sm">No requests yet. Make your first API call to see activity here.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#222]">
        <h2 className="text-white font-semibold">Recent Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#222] text-[#888] text-xs">
              <th className="text-left px-6 py-3 font-medium">Time</th>
              <th className="text-left px-6 py-3 font-medium">Platforms</th>
              <th className="text-left px-6 py-3 font-medium">Tokens</th>
              <th className="text-left px-6 py-3 font-medium">Latency</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-[#222] last:border-0">
                <td className="px-6 py-3 text-[#888] font-mono text-xs">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-1">
                    {log.platforms.map(p => (
                      <span key={p} className="bg-[#222] text-[#ccc] text-xs px-2 py-0.5 rounded font-mono">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-3 text-[#888] font-mono text-xs">{log.tokens_used}</td>
                <td className="px-6 py-3 text-[#888] font-mono text-xs">{log.latency_ms}ms</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-mono ${log.status === 'success' ? 'text-[#00ff9d]' : 'text-red-400'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- NO KEY STATE ---- */
function NoKeyState() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-white mb-4">No API Key Found</h2>
      <p className="text-[#888] mb-6">It looks like your account doesn&apos;t have an API key yet.</p>
      <a href="/signup" className="bg-[#00ff9d] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#00e68a] transition-colors">
        Generate API Key
      </a>
    </div>
  );
}

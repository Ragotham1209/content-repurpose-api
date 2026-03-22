'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setApiKey('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setApiKey(data.api_key);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#222] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00ff9d] flex items-center justify-center text-black font-bold text-sm">R</div>
          <span className="font-semibold text-white">Repurpose API</span>
        </a>
        <div className="flex items-center gap-6 text-sm text-[#888]">
          <a href="/docs" className="hover:text-white transition-colors">Docs</a>
          <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Get Your API Key</h1>
        <p className="text-[#888] text-center mb-8">Enter your email to get a free API key with 100 calls/month.</p>

        {!apiKey ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-[#888] mb-2">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#00ff9d] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00ff9d] text-black font-semibold py-3 rounded-lg hover:bg-[#00e68a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Get Free API Key'}
            </button>

            <p className="text-xs text-[#555] text-center">
              Free tier: 100 API calls/month. No credit card required.
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#0a1a10] border border-[#00ff9d]/30 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#00ff9d]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#00ff9d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">API Key Created</h2>
              <p className="text-sm text-[#888] mb-4">Save this key — it won&apos;t be shown again.</p>
            </div>

            <div className="relative">
              <div className="bg-[#111] border border-[#222] rounded-lg px-4 py-3 font-mono text-sm text-[#00ff9d] break-all pr-20">
                {apiKey}
              </div>
              <button
                onClick={copyKey}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#222] hover:bg-[#333] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-xl p-4">
              <p className="text-xs text-[#888] mb-3">Test it now:</p>
              <pre className="text-xs font-mono text-[#c8d6e5] overflow-x-auto whitespace-pre-wrap">
{`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/repurpose \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "content": "Hello world post",
    "platforms": ["twitter", "linkedin"]
  }'`}
              </pre>
            </div>

            <div className="flex gap-3">
              <a href="/docs" className="flex-1 text-center bg-[#111] border border-[#222] text-white font-medium py-3 rounded-lg hover:border-[#333] transition-colors text-sm">
                Read Docs
              </a>
              <a href="/" className="flex-1 text-center bg-[#00ff9d] text-black font-medium py-3 rounded-lg hover:bg-[#00e68a] transition-colors text-sm">
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

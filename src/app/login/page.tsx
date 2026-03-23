'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabaseBrowser();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : authError.message);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#222] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Repurpose API" className="w-8 h-8" />
          <span className="font-semibold text-white">Repurpose API</span>
        </a>
        <div className="flex items-center gap-6 text-sm text-[#888]">
          <a href="/docs" className="hover:text-white transition-colors">Docs</a>
          <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h1>
        <p className="text-[#888] text-center mb-8">Log in to access your dashboard and API key.</p>

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

          <div>
            <label htmlFor="password" className="block text-sm text-[#888] mb-2">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
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
            {loading ? 'Signing in...' : 'Log In'}
          </button>

          <p className="text-sm text-[#555] text-center">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-[#00ff9d] hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </main>
  );
}

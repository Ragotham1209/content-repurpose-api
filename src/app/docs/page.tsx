export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* NAV */}
      <nav className="border-b border-[#222] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Repurpose API" className="w-8 h-8" />
          <span className="font-semibold text-white">Repurpose API</span>
        </a>
        <div className="flex items-center gap-6 text-sm text-[#888]">
          <a href="/docs" className="text-white">Docs</a>
          <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">API Documentation</h1>
        <p className="text-[#888] mb-12">Everything you need to integrate the Repurpose API.</p>

        {/* GETTING STARTED */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4" id="getting-started">Getting Started</h2>
          <div className="space-y-4 text-[#ccc] text-sm leading-relaxed">
            <p><strong className="text-white">1. Get your API key</strong> by signing up:</p>
            <pre className="bg-[#111] border border-[#222] rounded-lg p-4 font-mono text-sm overflow-x-auto">
{`curl -X POST https://your-app.vercel.app/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"email": "you@example.com"}'`}
            </pre>
            <p>This returns your API key. Store it securely &mdash; it won&apos;t be shown again.</p>
            <p><strong className="text-white">2. Make your first request:</strong></p>
            <pre className="bg-[#111] border border-[#222] rounded-lg p-4 font-mono text-sm overflow-x-auto">
{`curl -X POST https://your-app.vercel.app/api/v1/repurpose \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: rp_live_your_key_here" \\
  -d '{
    "content": "Your blog post or article text here...",
    "platforms": ["twitter", "linkedin"],
    "tone": "professional"
  }'`}
            </pre>
          </div>
        </section>

        {/* AUTHENTICATION */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4" id="auth">Authentication</h2>
          <p className="text-[#ccc] text-sm mb-4">Include your API key in the <code className="bg-[#222] px-1.5 py-0.5 rounded text-[#00ff9d] text-xs">x-api-key</code> header with every request.</p>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222] bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Header</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Value</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Required</th>
                </tr>
              </thead>
              <tbody className="text-[#ccc]">
                <tr className="border-b border-[#222]">
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">x-api-key</td>
                  <td className="px-4 py-3">Your API key (rp_live_...)</td>
                  <td className="px-4 py-3 text-[#00ff9d]">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">Content-Type</td>
                  <td className="px-4 py-3">application/json</td>
                  <td className="px-4 py-3 text-[#00ff9d]">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ENDPOINT */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4" id="repurpose">POST /api/v1/repurpose</h2>
          <p className="text-[#ccc] text-sm mb-6">Transform content into platform-specific posts.</p>

          <h3 className="text-lg font-semibold text-white mb-3">Request Body</h3>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222] bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Field</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Type</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Required</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Description</th>
                </tr>
              </thead>
              <tbody className="text-[#ccc]">
                <tr className="border-b border-[#222]">
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">content</td>
                  <td className="px-4 py-3 font-mono text-[#888]">string</td>
                  <td className="px-4 py-3">*</td>
                  <td className="px-4 py-3">The source content to repurpose (10-50,000 chars)</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">source_url</td>
                  <td className="px-4 py-3 font-mono text-[#888]">string</td>
                  <td className="px-4 py-3">*</td>
                  <td className="px-4 py-3">URL to extract content from (alternative to content)</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">platforms</td>
                  <td className="px-4 py-3 font-mono text-[#888]">string[]</td>
                  <td className="px-4 py-3 text-[#00ff9d]">Yes</td>
                  <td className="px-4 py-3">Array of: twitter, linkedin, reddit, email, instagram</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">tone</td>
                  <td className="px-4 py-3 font-mono text-[#888]">string</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">professional, casual, witty, authoritative, friendly (default: professional)</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">language</td>
                  <td className="px-4 py-3 font-mono text-[#888]">string</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">ISO language code (default: en)</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">hashtags</td>
                  <td className="px-4 py-3 font-mono text-[#888]">boolean</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">Include hashtags in output (default: true)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-[#00ff9d]">thread</td>
                  <td className="px-4 py-3 font-mono text-[#888]">boolean</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">Generate Twitter thread instead of single tweet (default: false)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#888] mb-8">* Either <code className="bg-[#222] px-1 py-0.5 rounded text-[#00ff9d]">content</code> or <code className="bg-[#222] px-1 py-0.5 rounded text-[#00ff9d]">source_url</code> must be provided.</p>

          <h3 className="text-lg font-semibold text-white mb-3">Response</h3>
          <pre className="bg-[#111] border border-[#222] rounded-lg p-4 font-mono text-sm overflow-x-auto text-[#c8d6e5] mb-8">
{`{
  "success": true,
  "data": {
    "twitter": "string | string[]",
    "linkedin": "string",
    "reddit": { "title": "string", "body": "string" },
    "email": { "subject": "string", "preview_text": "string", "body": "string" },
    "instagram": "string"
  },
  "meta": {
    "platforms": ["twitter", "linkedin"],
    "tone": "professional",
    "tokens_used": 847,
    "latency_ms": 1203,
    "requests_remaining": 99
  }
}`}
          </pre>
        </section>

        {/* ERROR CODES */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4" id="errors">Error Codes</h2>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222] bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Status</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Code</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Description</th>
                </tr>
              </thead>
              <tbody className="text-[#ccc]">
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-mono">400</td><td className="px-4 py-3 font-mono text-[#f59e0b]">BAD_REQUEST</td><td className="px-4 py-3">Invalid JSON body</td></tr>
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-mono">400</td><td className="px-4 py-3 font-mono text-[#f59e0b]">VALIDATION_ERROR</td><td className="px-4 py-3">Request body validation failed</td></tr>
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-mono">401</td><td className="px-4 py-3 font-mono text-[#ff2d78]">UNAUTHORIZED</td><td className="px-4 py-3">Missing or invalid API key</td></tr>
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-mono">403</td><td className="px-4 py-3 font-mono text-[#ff2d78]">PLAN_RESTRICTED</td><td className="px-4 py-3">Platform not available on your plan</td></tr>
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-mono">422</td><td className="px-4 py-3 font-mono text-[#f59e0b]">URL_FETCH_ERROR</td><td className="px-4 py-3">Failed to fetch content from source URL</td></tr>
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-mono">429</td><td className="px-4 py-3 font-mono text-[#ff2d78]">RATE_LIMITED</td><td className="px-4 py-3">Monthly request limit exceeded</td></tr>
                <tr><td className="px-4 py-3 font-mono">500</td><td className="px-4 py-3 font-mono text-[#ff2d78]">INTERNAL_ERROR</td><td className="px-4 py-3">Server error</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* RATE LIMITS */}
        <section className="mb-16" id="pricing">
          <h2 className="text-2xl font-bold text-white mb-4">Rate Limits</h2>
          <p className="text-[#ccc] text-sm mb-4">Rate limits are tracked via response headers:</p>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222] bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Header</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Description</th>
                </tr>
              </thead>
              <tbody className="text-[#ccc]">
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-mono text-[#00ff9d]">X-RateLimit-Limit</td><td className="px-4 py-3">Your monthly request limit</td></tr>
                <tr><td className="px-4 py-3 font-mono text-[#00ff9d]">X-RateLimit-Remaining</td><td className="px-4 py-3">Requests remaining this month</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222] bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Plan</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Requests/mo</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Platforms</th>
                  <th className="text-left px-4 py-3 text-[#888] font-mono text-xs">Price</th>
                </tr>
              </thead>
              <tbody className="text-[#ccc]">
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-medium text-white">Free</td><td className="px-4 py-3">100</td><td className="px-4 py-3">Twitter, LinkedIn, Reddit</td><td className="px-4 py-3">$0</td></tr>
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-medium text-white">Starter</td><td className="px-4 py-3">1,000</td><td className="px-4 py-3">All platforms</td><td className="px-4 py-3">$29/mo</td></tr>
                <tr className="border-b border-[#222]"><td className="px-4 py-3 font-medium text-white">Pro</td><td className="px-4 py-3">5,000</td><td className="px-4 py-3">All + bulk</td><td className="px-4 py-3">$79/mo</td></tr>
                <tr><td className="px-4 py-3 font-medium text-white">Scale</td><td className="px-4 py-3">25,000</td><td className="px-4 py-3">All + webhooks</td><td className="px-4 py-3">$199/mo</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#222] py-8 text-center">
        <p className="text-xs text-[#555] font-mono">Repurpose API &mdash; Documentation</p>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* NAV */}
      <nav className="border-b border-[#222] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00ff9d] flex items-center justify-center text-black font-bold text-sm">R</div>
          <span className="font-semibold text-white">Repurpose API</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#888]">
          <a href="/docs" className="hover:text-white transition-colors">Docs</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="/api/auth/signup" className="bg-[#00ff9d] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#00e68a] transition-colors">Get API Key</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#222] bg-[#111] text-xs font-mono text-[#00ff9d]">
          Now in Public Beta &mdash; 100 free API calls / month
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6">
          One API call.<br />
          <span className="text-[#00ff9d]">Every platform.</span>
        </h1>
        <p className="text-lg text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed">
          Send a blog post, transcript, or any content. Get back ready-to-post content
          for Twitter, LinkedIn, Reddit, email newsletters, and Instagram &mdash; all
          optimized for each platform.
        </p>

        {/* Code example */}
        <div className="max-w-2xl mx-auto text-left bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0d] border-b border-[#222]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
            <span className="ml-2 text-xs text-[#555] font-mono">curl</span>
          </div>
          <pre className="p-4 text-sm font-mono overflow-x-auto text-[#c8d6e5]">
{`curl -X POST https://your-app.vercel.app/api/v1/repurpose \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: rp_live_your_key_here" \\
  -d '{
    "source_url": "https://blog.example.com/my-post",
    "platforms": ["twitter", "linkedin", "reddit"],
    "tone": "professional"
  }'`}
          </pre>
        </div>
      </section>

      {/* RESPONSE EXAMPLE */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-[#00ff9d]">RESPONSE</span>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#0d0d0d] border-b border-[#222] flex justify-between items-center">
            <span className="text-xs text-[#555] font-mono">200 OK</span>
            <span className="text-xs text-[#00ff9d] font-mono">~1.2s</span>
          </div>
          <pre className="p-4 text-sm font-mono overflow-x-auto text-[#c8d6e5]">
{`{
  "success": true,
  "data": {
    "twitter": "We just shipped a feature that cut our deploy time by 80%.\\n\\nHere's what we changed and why it matters for your CI/CD pipeline.\\n\\n#DevOps #Engineering",
    "linkedin": "We cut our deployment time by 80%.\\n\\nHere's the full breakdown of what we changed...\\n\\n→ Switched from Docker multi-stage to...\\n→ Implemented parallel test execution...\\n→ Added intelligent caching...\\n\\nThe result? 12 minutes → 2.4 minutes.\\n\\n#DevOps #CICD #Engineering",
    "reddit": {
      "title": "We cut our deploy time by 80% - here's exactly how",
      "body": "## TL;DR\\nWent from 12 min to 2.4 min deploys..."
    }
  },
  "meta": {
    "platforms": ["twitter", "linkedin", "reddit"],
    "tone": "professional",
    "tokens_used": 847,
    "latency_ms": 1203,
    "requests_remaining": 99
  }
}`}
          </pre>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-[#222] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Built for developers and AI agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Platform-Native Output', desc: 'Each platform gets content optimized for its specific format, character limits, and audience expectations.' },
              { title: 'API Key Auth', desc: 'Simple x-api-key header authentication. No OAuth flows. Get your key and start making requests in seconds.' },
              { title: 'Usage-Based Pricing', desc: 'Pay per API call. Free tier for testing. Scale pricing as you grow. No hidden fees or minimums.' },
              { title: '5 Platforms', desc: 'Twitter/X, LinkedIn, Reddit, email newsletters, Instagram. Request any combination in a single call.' },
              { title: 'Tone Control', desc: 'Professional, casual, witty, authoritative, or friendly. Match your brand voice across all platforms.' },
              { title: 'MCP Compatible', desc: 'Works with Claude, GPT, LangChain, n8n, Make, Zapier. Any AI agent can call this API as a tool.' },
            ].map((f, i) => (
              <div key={i} className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#333] transition-colors">
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="border-t border-[#222] py-20" id="pricing">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Simple, usage-based pricing</h2>
          <p className="text-center text-[#888] mb-12">Start free. Upgrade when you need more.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Free', price: '$0', period: 'forever', calls: '100 / mo', platforms: '3 platforms', highlight: false },
              { name: 'Starter', price: '$29', period: '/month', calls: '1,000 / mo', platforms: 'All platforms', highlight: false },
              { name: 'Pro', price: '$79', period: '/month', calls: '5,000 / mo', platforms: 'All + bulk endpoint', highlight: true },
              { name: 'Scale', price: '$199', period: '/month', calls: '25,000 / mo', platforms: 'All + webhooks', highlight: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-xl p-6 border transition-colors ${plan.highlight ? 'bg-[#0a1a10] border-[#00ff9d]/30' : 'bg-[#111] border-[#222] hover:border-[#333]'}`}>
                <div className={`text-xs font-mono mb-2 ${plan.highlight ? 'text-[#00ff9d]' : 'text-[#888]'}`}>{plan.name}</div>
                <div className="text-3xl font-bold text-white mb-1">{plan.price}<span className="text-base text-[#888] font-normal">{plan.period}</span></div>
                <div className="text-sm text-[#888] mt-4 space-y-2">
                  <div>{plan.calls}</div>
                  <div>{plan.platforms}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#222] py-8 text-center">
        <p className="text-xs text-[#555] font-mono">Repurpose API &mdash; Content repurposing for developers and AI agents</p>
      </footer>
    </main>
  );
}

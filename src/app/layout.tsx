import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://content-repurpose-api.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Repurpose API — Content Repurposing API for Developers & AI Agents',
    template: '%s | Repurpose API',
  },
  description:
    'The API that transforms any content into platform-ready posts for Twitter, LinkedIn, Reddit, email newsletters, and Instagram. One API call, every platform. Built for developers, AI agents, and content automation workflows.',
  keywords: [
    'content repurposing API',
    'repurpose content API',
    'social media API',
    'content transformation API',
    'AI content API',
    'multi-platform content',
    'twitter API',
    'linkedin API',
    'reddit API',
    'content automation',
    'developer API',
    'AI agent tools',
    'MCP tool',
    'content marketing API',
    'blog to social media',
  ],
  authors: [{ name: 'Repurpose API' }],
  creator: 'Repurpose API',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Repurpose API — One API Call. Every Platform.',
    description:
      'Send a blog post, transcript, or any content. Get back ready-to-post content for Twitter, LinkedIn, Reddit, email, and Instagram — all optimized for each platform.',
    url: siteUrl,
    siteName: 'Repurpose API',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repurpose API — One API Call. Every Platform.',
    description:
      'Send any content, get back platform-ready posts for Twitter, LinkedIn, Reddit, email, and Instagram. Free tier: 100 calls/month.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

// JSON-LD structured data for Google
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Repurpose API',
  description:
    'API that transforms any content into platform-ready posts for Twitter, LinkedIn, Reddit, email newsletters, and Instagram in a single API call.',
  url: siteUrl,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      description: '100 API calls per month, 3 platforms',
    },
    {
      '@type': 'Offer',
      name: 'Starter',
      price: '29',
      priceCurrency: 'USD',
      description: '1,000 API calls per month, all platforms',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '79',
      priceCurrency: 'USD',
      description: '5,000 API calls per month, all platforms + bulk endpoint',
    },
    {
      '@type': 'Offer',
      name: 'Scale',
      price: '199',
      priceCurrency: 'USD',
      description: '25,000 API calls per month, all platforms + webhooks',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

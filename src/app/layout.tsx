import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Repurpose API — Content Repurposing for Developers',
  description: 'The API that transforms any content into platform-ready posts for Twitter, LinkedIn, Reddit, email, and Instagram. One API call. Every platform.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Repurpose API',
    description: 'Content repurposing API for developers and AI agents.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

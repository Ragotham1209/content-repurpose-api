/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow larger payloads for bulk repurposing
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;

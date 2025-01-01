// @ts-check
import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['./app', './data', './constants', './dbConfig', './helpers', './models', './public', './utils'],
  },
  images: {
    remotePatterns: [
      { hostname: 'upload.wikimedia.org' },
      { hostname: 'commons.wikimedia.org' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'i.pravatar.cc' },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Use module.exports for Node.js/Next.js compatibility
module.exports = process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;

// This export is just for TypeScript type checking
export default nextConfig;

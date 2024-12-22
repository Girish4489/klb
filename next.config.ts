// @ts-check
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    dirs: ['src', 'data'],
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

export default nextConfig;

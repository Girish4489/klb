/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: ['upload.wikimedia.org', 'commons.wikimedia.org', 'images.unsplash.com'],
  },
};

export default nextConfig;

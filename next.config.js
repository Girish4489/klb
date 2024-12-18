/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  images: {
    remotePatterns: [
      { hostname: 'upload.wikimedia.org' },
      { hostname: 'commons.wikimedia.org' },
      { hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;

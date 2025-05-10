/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./next-intl.config.ts');

const nextConfig = {
  env: {
    // Backend URL - replace in production
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  },
  // Settings to allow communication with the backend
  async headers() {
    return [
      {
        // CORS configuration for backend requests
        source: '/api/:path*',
        headers: [
          // In production, specify the exact origin for better security
          {
            key: 'Access-Control-Allow-Origin',
            value:
              process.env.NODE_ENV === 'production'
                ? process.env.ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_BACKEND_URL
                : '*',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'ngrok-skip-browser-warning', value: 'any' },
        ],
      },
    ];
  },
  // Configuration to allow video streaming
  experimental: {
    serverComponentsExternalPackages: ['fluent-ffmpeg'],
  },
  reactStrictMode: false, // Disable strict mode to avoid double rendering during development
  images: {
    domains: ['via.placeholder.com', 'i.ytimg.com', 'img.youtube.com'],
  },
};

module.exports = withNextIntl(nextConfig);

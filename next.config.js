/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization for better SEO
  trailingSlash: false,
  
  // Image optimization for better Core Web Vitals
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Enable compression
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

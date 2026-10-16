import type { NextConfig } from "next";

// Applied to every response. CSP is limited to directives that cannot break
// scripts/styles (GTM, Cloudinary, three.js) while still blocking clickjacking,
// plugin embeds and base-tag injection.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // The vercel.app domain serves the same content as lsmotos.com: keep it out of Google
        source: '/:path*',
        has: [{ type: 'host', value: 'lsmotos.vercel.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },


};

export default nextConfig;

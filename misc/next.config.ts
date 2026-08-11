import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cms.oswinply.com" },
      { protocol: "https", hostname: "oswinply.com" },
      { protocol: "https", hostname: "www.oswinply.com" },
      { protocol: "https", hostname: "oswin.ibees.in" },
      { protocol: "https", hostname: "oswin-cms.ibees.in" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    const csp = `
            default-src 'self';
            connect-src 'self'
              https://oswin-cms.ibees.in
              https://www.youtube.com
              ${isDev ? process.env.BACKEDN_SITE_URL : ''}
              ${isDev ? "ws: wss:" : ""};
            img-src 'self' data: blob: https: https://i.ytimg.com;
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' data: https://fonts.gstatic.com;
            frame-src 'self'
              https://www.youtube.com
              https://www.youtube-nocookie.com;
            frame-ancestors 'self';
          `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/:path*',
        headers: [
          // {
          //   key: 'Content-Security-Policy',
          //   value: csp,
          // },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(self), camera=(self), microphone=(self)',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/plywood",
        destination: "/plywood/oswin-ply-club",
        permanent: true,
      },
      {
        source: "/doors",
        destination: "/doors/oswin-flush-door",
        permanent: true,
      },
      {
        source: "/prelam",
        destination: "/prelam/solids",
        permanent: true,
      },
      {
        source: "/block-board",
        destination: "/block-board/oswin-block-board",
        permanent: true,
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


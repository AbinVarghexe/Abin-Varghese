import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'slelguoygbfzlpylpxfs.supabase.co',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'instagram.fccu12-1.fna.fbcdn.net',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'scontent.cdninstagram.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'lookaside.instagram.com',
          pathname: '/**',
        },
      ],
    },
};

export default nextConfig;

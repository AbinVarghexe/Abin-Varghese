import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.supabase.co',
          pathname: '/storage/v1/object/**',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'i.pinimg.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'cdn.pixabay.com',
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
        {
          protocol: 'https',
          hostname: 'opengraph.githubassets.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'user-images.githubusercontent.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'camo.githubusercontent.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'github.com',
          pathname: '/**',
        },
      ],
    },
};

export default nextConfig;

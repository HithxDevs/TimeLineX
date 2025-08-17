import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // This ignores ESLint errors too
  },
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com'], // Add Google's user image host
  },
  
};

export default nextConfig;

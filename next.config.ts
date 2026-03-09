import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@libsql/isomorphic-ws",
    "@libsql/client",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.useyapi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.catbox.moe",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tiktokcdn-us.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tiktokcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tiktokv.us",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tiktokv.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

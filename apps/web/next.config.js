import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Cross-Origin Opener Policy (COOP) for isolation
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          // Cross-Origin Embedder Policy (COEP) for isolation
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          // Strict-Transport-Security (HSTS) - always enabled for security
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "production"
                ? "https://yourdomain.com"
                : "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, x-csrf-token",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
  transpilePackages: [
    "@acmecorp/ui",
    "@acmecorp/env",
    "@acmecorp/db",
    "@acmecorp/auth",
    "@acmecorp/users",
    "@acmecorp/orgs",
    "@acmecorp/router",
    "@acmecorp/api",
  ],
  webpack: (config) => {
    // Enable symlinks resolution for pnpm workspaces
    config.resolve.symlinks = false;

    // Add workspace packages to resolve alias
    config.resolve.alias = {
      ...config.resolve.alias,
      "@acmecorp/ui": path.resolve(
        __dirname,
        "../../packages/@acmecorp/ui/src"
      ),
      "@acmecorp/env": path.resolve(
        __dirname,
        "../../packages/@acmecorp/env/src"
      ),
      "@acmecorp/db": path.resolve(
        __dirname,
        "../../packages/@acmecorp/db/src"
      ),
      "@acmecorp/auth": path.resolve(
        __dirname,
        "../../packages/@acmecorp/auth/src"
      ),
      "@acmecorp/users": path.resolve(
        __dirname,
        "../../packages/@acmecorp/users/src"
      ),
      "@acmecorp/orgs": path.resolve(
        __dirname,
        "../../packages/@acmecorp/orgs/src"
      ),
      "@acmecorp/router": path.resolve(
        __dirname,
        "../../packages/@acmecorp/router/src"
      ),
      "@acmecorp/api": path.resolve(
        __dirname,
        "../../packages/@acmecorp/api/src"
      ),
      "@acmecorp/icons": path.resolve(
        __dirname,
        "../../packages/@acmecorp/icons/src"
      ),
    };

    // Configure SVGR for SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      {
        protocol: "https",
        hostname: "yourdomain.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Enable image optimization
    formats: ["image/webp", "image/avif"],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache TTL for optimized images
    minimumCacheTTL: 60,
    // Disable image optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
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
    };

    return config;
  },
};

export default nextConfig;

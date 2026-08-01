import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["react-router-dom"] = path.resolve(__dirname, "src/utils/react-router-dom-compat.js");
    return config;
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    return [
      {
        source: '/api/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;


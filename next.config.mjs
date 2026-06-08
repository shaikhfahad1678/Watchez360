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
    return [
      {
        source: '/api/api/:path*',
        destination: 'http://140.245.10.48:8000/api/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://140.245.10.48:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;


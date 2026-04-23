import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/calendar/events',
        destination: 'http://localhost:3005/api/calendar/events',
      },
    ];
  },
};

export default nextConfig;

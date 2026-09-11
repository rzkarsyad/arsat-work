import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The canonical host is the bare domain; www hands off to it.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.arsat.work" }],
        destination: "https://arsat.work/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

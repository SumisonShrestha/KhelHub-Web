/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.73.4.149",
        port: "8088",
        pathname: "/uploads/**",
      },
    ],
    // 👇 IMPORTANT fallback for dev/internal IPs
    unoptimized: true,
  },
};

module.exports = nextConfig;
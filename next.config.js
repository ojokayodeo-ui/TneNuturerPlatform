/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
  },
  images: {
    domains: ["avatars.githubusercontent.com", "api.dicebear.com"],
  },
};

module.exports = nextConfig;

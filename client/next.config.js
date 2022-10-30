const withTM = require('next-transpile-modules')(['backend']);
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withTM(nextConfig);

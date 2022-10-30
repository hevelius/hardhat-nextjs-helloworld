const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  'backend',
]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPlugins([
  withTM
], nextConfig);
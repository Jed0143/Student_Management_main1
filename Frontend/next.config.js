const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false, // Ensure it's false if using pages directory
  },
  // Change the location of the Next.js pages directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  dir: path.join(__dirname, 'Frontend'), 
};

module.exports = nextConfig;

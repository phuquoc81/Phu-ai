/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PHUTOKENVERCEL: process.env.PHUTOKENVERCEL,
  },
}

module.exports = nextConfig

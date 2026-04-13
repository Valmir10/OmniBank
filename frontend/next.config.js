/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/OmniBank" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/OmniBank/" : "",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["chart.js", "react-chartjs-2"],
};

module.exports = nextConfig;

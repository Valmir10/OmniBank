/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["chart.js", "react-chartjs-2"],
};

module.exports = nextConfig;

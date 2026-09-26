import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One static page: no server to run, deployable to any static host.
  output: "export",
};

export default nextConfig;

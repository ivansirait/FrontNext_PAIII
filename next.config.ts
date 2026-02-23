import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@prisma/client"], 
  
experimental: {
  // @ts-ignore
  allowedDevOrigins: ['192.168.56.1', 'localhost:3000'],
},
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración para mejor rendimiento y Netlify
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Optimizaciones de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Configuración para Netlify
  output: 'standalone',
  trailingSlash: false,
  // Optimizaciones para Netlify
  swcMinify: true,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración para mejor rendimiento
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
  // Optimizaciones de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Configuración para Netlify
  output: 'export',
  trailingSlash: true,
  // Deshabilitar optimizaciones que causan problemas en Netlify
  swcMinify: false,
};

export default nextConfig;

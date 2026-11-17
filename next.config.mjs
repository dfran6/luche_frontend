/** @type {import('next').NextConfig} */
const r2ImageHost = process.env.NEXT_PUBLIC_R2_IMAGE_HOST

const nextConfig = {
  experimental: {
    serverActions: {
      // Product create/edit submits the main image and variant images together.
      // The backend still validates each individual image (5 MB maximum).
      bodySizeLimit: '50mb',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: r2ImageHost || '**.r2.dev',
      },
    ],
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Image optimization ON — Vercel pe WebP/AVIF serve hogi automatically
    // hero-arch.png (3.4MB) → ~300KB WebP, scroll-down-2.png (1.1MB) → ~100KB WebP
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    // Hero images are large, allow bigger sizes
    deviceSizes: [360, 414, 768, 1080, 1280, 1920],
    imageSizes: [170, 256, 384],
  },
};

module.exports = nextConfig;

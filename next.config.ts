import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/SV-Archiv' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_GOOGLE_SCRIPT_URL:
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbwqSwKQhLhDbBxAa8x74UC_bwfJHk7WhdLeF16EcJfh4DZ-AiYOX_sPs96O0SfO7TrH/exec',
  },
};

export default nextConfig;

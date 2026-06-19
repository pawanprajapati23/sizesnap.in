import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async rewrites() {
    return [
      {
        // Pretty URL shown to users / Search Console
        source: '/stories/ssc-photo-rejection',
        // Actual static file served untouched from /public
        destination: '/stories/ssc-photo-rejection.html',
      },
      {
        source: '/resize-image-to-50kb',
        destination: '/resize-image/to-50kb',
      },
      {
        source: '/resize-image-to-20kb',
        destination: '/resize-image/to-20kb',
      },
      {
        source: '/resize-image-to-100kb',
        destination: '/resize-image/to-100kb',
      },
      {
        source: '/resize-image-to-200kb',
        destination: '/resize-image/to-200kb',
      },
      {
        source: '/resize-image-to-50kb-for-form',
        destination: '/resize-image/to-50kb-for-form',
      },
      {
        source: '/resize-image-to-50kb-for-whatsapp',
        destination: '/resize-image/to-50kb-for-whatsapp',
      },
      {
        source: '/resize-image-to-50kb-for-ssc-exam',
        destination: '/resize-image/to-50kb-for-ssc-exam',
      },
      {
        source: '/resize-image-to-50kb-without-losing-quality',
        destination: '/resize-image/to-50kb-without-losing-quality',
      },
      {
        source: '/compress-image-without-losing-quality',
        destination: '/compress-image/without-losing-quality',
      },
      {
        source: '/reduce-image-size-without-blur',
        destination: '/resize-image/reduce-without-blur',
      },
      {
        source: '/compress-image-to-50kb',
        destination: '/compress-image/to-50kb',
      },
      {
        source: '/image-size-for-ssc-form',
        destination: '/passport-photo/ssc-exam',
      },
      {
        source: '/photo-size-for-upsc-form',
        destination: '/passport-photo/upsc-exam',
      }
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  async headers() {
    return [
      {
        source: '/((?!stories|favicon.ico|logo.png|favicon.png).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://cdn.ampproject.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.ampproject.org; img-src 'self' data: https://images.unsplash.com https://picsum.photos https://pagead2.googlesyndication.com https://www.googletagmanager.com https://ad.doubleclick.net; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com; object-src 'none';",
          }
        ]
      },
      {
        source: '/stories/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      {
        // Pretty URL shown to users / Search Console
        source: '/stories/ssc-photo-rejection',
        // Actual static file served untouched from /public
        destination: '/stories/ssc-photo-rejection.html',
      },
      {
        source: '/stories/resize-to-50kb',
        destination: '/stories/resize-to-50kb.html',
      },
      {
        source: '/stories/passport-photo-fix',
        destination: '/stories/passport-photo-fix.html',
      },
      {
        source: '/stories/signature-reject-fix',
        destination: '/stories/signature-reject-fix.html',
      },
      {
        source: '/image-size-for-neet-form',
        destination: '/passport-photo/neet-exam',
      },
      {
        source: '/image-size-for-jee-main',
        destination: '/passport-photo/jee-main',
      },
      {
        source: '/image-size-for-ibps-exam',
        destination: '/passport-photo/ibps-exam',
      },
      {
        source: '/resize-signature-for-neet',
        destination: '/signature-resize/neet-signature',
      },
      {
        source: '/resize-signature-for-jee',
        destination: '/signature-resize/jee-signature',
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

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
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
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/convert-image',
        destination: '/image-tools',
        permanent: true,
      },
      {
        source: '/compress-pdf',
        destination: '/tools/compress-pdf',
        permanent: true,
      },
      {
        source: '/passport-photo/delhi-police-photo',
        destination: '/exams/delhi-police-photo-resizer',
        permanent: true,
      },
      {
        source: '/resize-image/without-losing-quality',
        destination: '/tools/reduce-image-size-in-kb',
        permanent: true,
      },
      {
        source: '/watermark-image/add-text',
        destination: '/tools/image-watermark',
        permanent: true,
      },
      {
        source: '/compress-pdf/to-200kb',
        destination: '/tools/compress-pdf',
        permanent: true,
      },
      {
        source: '/stories/passport-photo-fix',
        destination: '/tools/passport-photo-maker',
        permanent: true,
      },
      {
        source: '/document-enhancer',
        destination: '/tools/ai-photo-enhancer',
        permanent: true,
      },
      {
        source: '/exam-pack-generator',
        destination: '/exams/exam-application-kit',
        permanent: true,
      },
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      {
        source: '/rotate-and-reorder-pdf-pages',
        destination: '/tools/rotate-pdf',
        permanent: true,
      },
      {
        source: '/add-page-numbers-to-pdf-online',
        destination: '/tools/add-page-numbers-pdf',
        permanent: true,
      },
      {
        source: '/combine-photo-and-signature-for-exam',
        destination: '/exams/exam-application-kit',
        permanent: true,
      },
      {
        source: '/crop-image-to-square',
        destination: '/tools/crop-image',
        permanent: true,
      },
      {
        source: '/password-protect-pdf',
        destination: '/pdf-tools',
        permanent: true,
      },
      {
        source: '/make-signature-transparent-and-convert-ink',
        destination: '/tools/generate-signature',
        permanent: true,
      },
      {
        source: '/&',
        destination: '/',
        permanent: true,
      },
      {
        source: '/hi',
        destination: '/',
        permanent: true,
      },
      {
        source: '/merge-marksheet-and-aadhaar-card-pdf',
        destination: '/tools/merge-pdf',
        permanent: true,
      },
      {
        source: '/tools/password-generator',
        destination: '/developer-tools',
        permanent: true,
      },
      {
        source: '/tools/reduce-image-size-kb',
        destination: '/tools/reduce-image-size-in-kb',
        permanent: true,
      },
      {
        source: '/file-sharing',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/how-to-compress-pdf-for-government-exams',
        destination: '/blog/how-to-compress-pdf-to-100kb-140kb-for-govt-portals',
        permanent: true,
      },
      {
        source: '/blog/how-to-resize-image-to-20kb',
        destination: '/blog/how-to-reduce-image-size-in-kb-without-losing-quality',
        permanent: true,
      },
      {
        source: '/blog/document-scanner-app-alternative',
        destination: '/tools/ai-photo-enhancer',
        permanent: true,
      },
      // Crawl Budget Optimization: 301 Permanent Redirects for duplicate alias routes
      {
        source: '/tools/11kb-photo-size',
        destination: '/tools/compress-image-to-11kb',
        permanent: true,
      },
      {
        source: '/tools/12kb-photo-size',
        destination: '/tools/compress-image-to-12kb',
        permanent: true,
      },
      {
        source: '/tools/13kb-photo-size',
        destination: '/tools/compress-image-to-13kb',
        permanent: true,
      },
      {
        source: '/tools/150kb-photo-size',
        destination: '/tools/compress-image-to-150kb',
        permanent: true,
      },
      {
        source: '/tools/15kb-photo-size',
        destination: '/tools/compress-image-to-15kb',
        permanent: true,
      },
      {
        source: '/tools/28kb-photo-size',
        destination: '/tools/compress-image-to-28kb',
        permanent: true,
      },
      {
        source: '/tools/5kb-photo-size',
        destination: '/tools/compress-image-to-5kb',
        permanent: true,
      },
      {
        source: '/tools/compress-image-10kb-to-20kb',
        destination: '/tools/compress-image-between-10kb-to-20kb',
        permanent: true,
      },
      {
        source: '/tools/compress-jpeg-between-20kb-to-50kb',
        destination: '/tools/compress-image-between-20kb-to-50kb',
        permanent: true,
      },
      {
        source: '/tools/jpeg-to-pdf-under-100kb',
        destination: '/tools/jpg-to-pdf-under-100kb',
        permanent: true,
      },
      {
        source: '/tools/jpeg-to-pdf-under-150kb',
        destination: '/tools/jpg-to-pdf-under-150kb',
        permanent: true,
      },
      {
        source: '/tools/jpeg-to-pdf-under-200kb',
        destination: '/tools/jpg-to-pdf-under-200kb',
        permanent: true,
      },
      {
        source: '/tools/jpeg-to-pdf-under-500kb',
        destination: '/tools/jpg-to-pdf-under-500kb',
        permanent: true,
      },
      {
        source: '/tools/name-and-date-on-photo',
        destination: '/tools/add-name-and-date-on-photo',
        permanent: true,
      },
      {
        source: '/tools/resize-image-to-3-5cmx4-5cm',
        destination: '/tools/resize-image-3-5cm-4-5cm',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
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
        ],
      },
    ];
  },
  webpack: (config, {dev}) => {
    config.resolve.alias.canvas = false;
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

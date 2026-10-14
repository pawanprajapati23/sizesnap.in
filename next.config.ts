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
        pathname: '/**', // This allows any path under the hostname
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

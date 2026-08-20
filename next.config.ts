import type {NextConfig} from 'next';

const MAPPINGS = [
  { pretty: '/image-size-for-neet-form', raw: '/passport-photo/neet-exam' },
  { pretty: '/image-size-for-jee-main', raw: '/passport-photo/jee-main' },
  { pretty: '/image-size-for-ibps-exam', raw: '/passport-photo/ibps-exam' },
  { pretty: '/resize-signature-for-neet', raw: '/signature-resize/neet-signature' },
  { pretty: '/resize-signature-for-jee', raw: '/signature-resize/jee-signature' },
  { pretty: '/resize-image-to-50kb', raw: '/resize-image/to-50kb' },
  { pretty: '/resize-image-to-20kb', raw: '/resize-image/to-20kb' },
  { pretty: '/resize-image-to-100kb', raw: '/resize-image/to-100kb' },
  { pretty: '/resize-image-to-200kb', raw: '/resize-image/to-200kb' },
  { pretty: '/resize-image-to-50kb-for-form', raw: '/resize-image/to-50kb-for-form' },
  { pretty: '/resize-image-to-50kb-for-whatsapp', raw: '/resize-image/to-50kb-for-whatsapp' },
  { pretty: '/resize-image-to-50kb-for-ssc-exam', raw: '/resize-image/to-50kb-for-ssc-exam' },
  { pretty: '/resize-image-to-50kb-without-losing-quality', raw: '/resize-image/to-50kb-without-losing-quality' },
  { pretty: '/compress-image-without-losing-quality', raw: '/compress-image/without-losing-quality' },
  { pretty: '/reduce-image-size-without-blur', raw: '/resize-image/reduce-without-blur' },
  { pretty: '/compress-image-to-50kb', raw: '/compress-image/to-50kb' },
  { pretty: '/image-size-for-ssc-form', raw: '/passport-photo/ssc-exam' },
  { pretty: '/image-size-for-ssc-mts-exam', raw: '/passport-photo/ssc-mts' },
  { pretty: '/photo-size-for-upsc-form', raw: '/passport-photo/upsc-exam' },
  { pretty: '/11kb-converter', raw: '/resize-image/to-11kb' },
  { pretty: '/passport-size-photo-maker', raw: '/passport-photo/indian-passport' },
  { pretty: '/pdf-under-500kb', raw: '/compress-pdf/to-500kb' },
  { pretty: '/compress-pdf-to-100kb', raw: '/compress-pdf/to-100kb' },
  { pretty: '/compress-pdf-to-200kb', raw: '/compress-pdf/to-200kb' },
  { pretty: '/compress-pdf-to-300kb', raw: '/compress-pdf/to-300kb' },
  { pretty: '/compress-pdf-to-150kb', raw: '/compress-pdf/to-150kb' },
  { pretty: '/compress-pdf-to-12kb', raw: '/compress-pdf/to-12kb' },
  { pretty: '/compress-pdf-to-15kb', raw: '/compress-pdf/to-15kb' },
  { pretty: '/compress-pdf-to-1mb', raw: '/compress-pdf/to-1mb' },
  { pretty: '/photo-size-for-up-police-form', raw: '/passport-photo/up-police-photo' },
  { pretty: '/photo-size-for-bpsc-exam', raw: '/passport-photo/bpsc-exam-photo' },
  { pretty: '/photo-size-for-mppsc-form', raw: '/passport-photo/mppsc-exam-photo' },
  { pretty: '/photo-size-for-gate-exam', raw: '/passport-photo/gate-exam' },
  { pretty: '/photo-size-for-delhi-police-form', raw: '/passport-photo/delhi-police-photo' },
  { pretty: '/pan-card-photo-size', raw: '/passport-photo/pan-card' },
  { pretty: '/resize-signature-for-ssc', raw: '/signature-resize/ssc-signature' },
  { pretty: '/resize-signature-for-ssc-mts', raw: '/signature-resize/ssc-mts-signature' },
  { pretty: '/resize-signature-for-upsc', raw: '/signature-resize/upsc-signature' },
  { pretty: '/resize-signature-for-pan-card', raw: '/signature-resize/pan-card-signature' },
  { pretty: '/image-size-for-rrb-exam', raw: '/passport-photo/rrb-ntpc' },
  { pretty: '/image-size-for-rrb-alp-exam', raw: '/passport-photo/rrb-alp' },
  { pretty: '/image-size-for-rrb-group-d', raw: '/passport-photo/rrb-groupd' },
  { pretty: '/photo-size-for-sbi-form', raw: '/passport-photo/sbi-bank' },
  { pretty: '/image-size-for-ctet-form', raw: '/passport-photo/ctet-exam' },
  { pretty: '/image-size-for-ssc-gd', raw: '/passport-photo/ssc-gd' },
  { pretty: '/photo-size-for-upsssc-pet', raw: '/passport-photo/upsssc-pet' },
  { pretty: '/resize-signature-for-rrb', raw: '/signature-resize/rrb-signature' },
  { pretty: '/resize-signature-for-rrb-alp', raw: '/signature-resize/rrb-alp-signature' },
  { pretty: '/resize-signature-for-rrb-group-d', raw: '/signature-resize/rrb-groupd-signature' },
  { pretty: '/resize-signature-for-sbi', raw: '/signature-resize/sbi-signature' },
  { pretty: '/resize-signature-for-ctet', raw: '/signature-resize/ctet-signature' },
  { pretty: '/resize-signature-for-ssc-gd', raw: '/signature-resize/ssc-gd-signature' },
  { pretty: '/resize-signature-for-upsssc', raw: '/signature-resize/upsssc-signature' },
  { pretty: '/resize-image-to-30kb', raw: '/resize-image/to-30kb' },
  { pretty: '/resize-image-to-15kb', raw: '/resize-image/to-15kb' },
  { pretty: '/whatsapp-dp-size-without-cropping', raw: '/whatsapp-dp/no-crop' },
  { pretty: '/word-to-pdf', raw: '/word-to-pdf/convert' },
  { pretty: '/resize-signature-for-ibps-exam', raw: '/signature-resize/ibps-signature' },
  { pretty: '/add-name-and-date-on-photo-online', raw: '/watermark-image/add-text' },
  { pretty: '/convert-image-to-300-dpi', raw: '/dpi-converter/to-300' },
  { pretty: '/convert-image-to-200-dpi', raw: '/dpi-converter/to-200' },
  { pretty: '/merge-aadhaar-card-front-and-back', raw: '/card-joiner/aadhaar-merge' },
  { pretty: '/merge-pan-card-front-and-back', raw: '/card-joiner/pan-merge' },
  { pretty: '/dsssb-postcard-photo-resizer', raw: '/postcard-photo/dsssb-postcard' },
  { pretty: '/neet-postcard-photo-resizer', raw: '/postcard-photo/neet-postcard' },
  { pretty: '/remove-shadow-from-document', raw: '/document-enhancer/remove-shadow' },
  { pretty: '/sharpen-scanned-signature', raw: '/document-enhancer/signature-sharpener' },
  { pretty: '/split-pdf-extract-pages', raw: '/split-pdf/extract-pages' },
  { pretty: '/change-photo-background-to-white', raw: '/background-changer/to-white' },
  { pretty: '/change-photo-background-to-blue', raw: '/background-changer/to-blue' },
  { pretty: '/remove-background-to-transparent', raw: '/background-changer/to-transparent' },
  { pretty: '/ai-background-remover', raw: '/background-changer/to-white' },
  { pretty: '/ocr-extract-text-from-marksheet', raw: '/ocr-text-extractor/from-marksheet' },
  { pretty: '/image-to-text-converter', raw: '/ocr-text-extractor/from-image' },
  { pretty: '/password-protect-pdf', raw: '/pdf-protect/add-password' },
  { pretty: '/unlock-pdf-remove-password', raw: '/pdf-unlock/remove-password' },
  { pretty: '/rotate-and-reorder-pdf-pages', raw: '/pdf-rotate/organize-pages' },
  { pretty: '/crop-image-to-square', raw: '/crop-image/square-crop' },
  { pretty: '/circle-crop-avatar', raw: '/crop-image/circle-crop' },
  { pretty: '/sarkari-exam-pack-generator', raw: '/exam-pack-generator/sarkari-exam-pack' },
  { pretty: '/passport-photo-print-sheet-maker', raw: '/passport-print-sheet/passport-sheet-maker' },
  { pretty: '/photo-compliance-checker', raw: '/photo-compliance-checker/photo-validator' },
  { pretty: '/sarkari-exam-age-calculator', raw: '/age-calculator/sarkari-exam' },
  { pretty: '/resize-image-in-cm-and-mm', raw: '/dimension-resizer/in-cm' },
  { pretty: '/merge-pdf-online', raw: '/merge-pdf/combine' },
  { pretty: '/jpg-to-pdf', raw: '/image-to-pdf/convert' },
  { pretty: '/pdf-to-jpg', raw: '/pdf-to-jpg/extract' },
  { pretty: '/unblur-photo-and-marksheet', raw: '/photo-clarifier/unblur-and-enhance' },
  { pretty: '/make-signature-transparent-and-convert-ink', raw: '/signature-extractor/transparent-signature' },
  { pretty: '/combine-photo-and-signature-for-exam', raw: '/photo-signature-joiner/photo-and-signature-joint' },
  { pretty: '/thumb-impression-resizer-for-ssc-and-neet', raw: '/thumb-resizer/left-thumb-impression' },
  { pretty: '/add-page-numbers-to-pdf-online', raw: '/pdf-page-numberer/add-page-numbers-to-pdf' },
  { pretty: '/self-attested-document-maker-online', raw: '/self-attestation/self-attest-document' },
  { pretty: '/convert-document-to-black-and-white', raw: '/document-grayscale/convert-to-black-and-white' }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://cdn.ampproject.org https://adservice.google.com https://*.highperformanceformat.com https://*.effectivecpmnetwork.com; worker-src 'self' blob: https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.ampproject.org; img-src 'self' blob: data: https://* http://*; font-src 'self' https://fonts.gstatic.com; connect-src 'self' blob: https://cdn.jsdelivr.net https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.googletagmanager.com https://www.googletagmanager.com https://adservice.google.com https://*.highperformanceformat.com https://*.effectivecpmnetwork.com https://*.googleapis.com https://*.google.com; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://*.google.com https://* http://*; object-src 'none';",
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
  async redirects() {
    return MAPPINGS.map(m => ({
      source: m.raw,
      missing: [
        {
          type: 'query',
          key: 'rewritten',
          value: 'true',
        }
      ],
      destination: m.pretty,
      permanent: true,
    }));
  },
  async rewrites() {
    const customRewrites = MAPPINGS.map(m => ({
      source: m.pretty,
      destination: `${m.raw}?rewritten=true`,
    }));

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
      ...customRewrites
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

import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: '50KB Photo Size - Resize Image to 50KB Online Free (jpg50kb) | SizeSnap',
  description:
    'Resize and compress photo or document to exact 50KB online for free without losing clarity. Ideal for SSC, UPSC, Railway RRB, Police Bharti, and PAN card uploads. 100% private & instant.',
  keywords: [
    '50kb photo size',
    '50 kb photo size',
    'jpg50kb',
    'photo size 50 kb',
    'resize image to 50kb',
    'compress photo to 50kb',
    'photo resize 50 kb online',
    '50 kb photo converter',
    'ssc photo 50kb',
    'photo ko 50kb me kaise convert kare',
    'reduce image size to 50kb',
    'compress image to 50kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/50kb-photo-size',
  },
  openGraph: {
    title: '50KB Photo Size - Resize Image to 50KB Online Free | SizeSnap',
    description:
      'Free online tool to compress photos to exact 50KB for SSC, UPSC, and Indian government exams. 100% client-side privacy.',
    url: 'https://www.sizesnap.in/tools/50kb-photo-size',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '50KB Photo Size - Resize Image to 50KB Free | SizeSnap',
    description:
      'Instant 50KB photo compressor for SSC, UPSC, Railway, and government applications.',
  },
};

const RELATED_SLUGS = [
  '20kb-photo-size',
  'compress-image-between-20kb-to-50kb',
  '100kb-photo-size',
  'passport-photo-maker',
  'pan-card-photo-resizer',
  'resize-image-3-5cm-4-5cm',
];

const FAQS = [
  {
    q: 'How to resize an image to exactly 50KB online for free?',
    a: 'Upload your photo or document into SizeSnap above. Our browser-side binary compression algorithm will calibrate the JPEG quality and resolution to match exactly 50KB (or between 40KB and 48KB) without manual guesswork. Then click "Download".',
  },
  {
    q: 'Why is 50KB the standard maximum file limit for Indian government exams?',
    a: 'Almost all recruitment boards—including SSC (CGL, CHSL, GD, MTS), UPSC, NTA, IBPS, and State Police boards—set 50KB as the upper ceiling for passport photographs. This ensures fast admit card generation and prevents server timeouts when millions of candidates apply on deadline day.',
  },
  {
    q: 'Will my passport photo remain high quality after compressing to 50KB?',
    a: 'Yes, absolutely. 50KB is more than enough for clear facial recognition, eye alignment, and biometric verification. SizeSnap preserves skin tones, facial contours, and high DPI resolution.',
  },
  {
    q: 'Is my personal photograph uploaded to any server or cloud?',
    a: 'No. SizeSnap runs entirely on your local device using HTML5 Canvas. Your sensitive identity proofs and photographs are never uploaded to any remote server.',
  },
];

export default function PhotoSize50kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: '50KB Photo Size', url: '/tools/50kb-photo-size' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why 50KB Photo Size is the Most Common Government Upload Standard
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        In Indian competitive exams, the standard photograph requirement is defined as <strong>20KB to 50KB</strong>. Compressing your photo to <strong>45KB–50KB</strong> provides the highest possible visual resolution and clarity while staying safely under the portal ceiling limit.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        How SizeSnap 50KB Image Resizer Works
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Our client-side compression engine iteratively tests compression quantization ratios to produce a file strictly at or under 50KB. No watermarks are added, and your original aspect ratio is preserved.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={50}
      title="50KB Photo Size Maker"
      description="Resize and compress your photo or document to exact 50KB online for free. Ideal for SSC, UPSC, and government job portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

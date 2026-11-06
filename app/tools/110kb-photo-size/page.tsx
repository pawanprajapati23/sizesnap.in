import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: '110KB Photo Size - Resize Image to 110KB (Exact KB) Online Free | SizeSnap',
  description:
    'Convert and resize photo to exact 110KB (under 110 KB) online for free without blur. Instant 110 KB photo converter for banking, IBPS, police & govt recruitment forms. 100% private.',
  keywords: [
    '110 kb photo size',
    '110kb photo size',
    '110 kb',
    'photo 110 kb',
    'photo size 110 kb',
    '110 kb photo size converter',
    '110kb photo size converter',
    'resize image to 110kb',
    'compress image to 110kb',
    'reduce image size to 110kb',
    'compress photo to 110kb online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/110kb-photo-size',
  },
  openGraph: {
    title: '110KB Photo Size - Resize Image to 110KB (Exact KB) Online Free | SizeSnap',
    description:
      'Convert and resize photo to exact 110KB online for free without quality loss. Ideal for banking, IBPS, and government applications.',
    url: 'https://www.sizesnap.in/tools/110kb-photo-size',
    siteName: 'SizeSnap',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-100kb',
  'reduce-image-size-in-kb',
  'compress-image-to-50kb',
  'passport-photo-maker',
  'resize-image-pixel',
];

const FAQS = [
  {
    q: 'How to resize an image to exactly 110KB?',
    a: 'Upload your image or document photo above. SizeSnap automatically optimizes JPEG quantization and dimensions to make the file size exactly 110KB or just under it. Then click Download.',
  },
  {
    q: 'Why do recruitment portals require 110KB photo size?',
    a: 'Certain banking exams (IBPS, SBI, RBI), state police boards, and university admission portals set strict upper limits such as 100KB to 150KB (commonly 110KB) to ensure rapid uploads and high database efficiency.',
  },
  {
    q: 'Will compressing my image to 110KB cause blurriness?',
    a: 'No. 110KB is plenty of bandwidth for clear portrait photos. SizeSnap preserves facial biometrics, crisp edges, and original aspect ratio without distortion.',
  },
  {
    q: 'Is my photo uploaded to any external server?',
    a: 'No. SizeSnap operates 100% locally in your web browser using HTML5 Canvas and JavaScript. Your personal photos and documents never leave your device.',
  },
];

export default function PhotoSize110kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: '110KB Photo Size', url: '/tools/110kb-photo-size' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why 110KB Photo Size is Common for Recruitment Portals
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Many competitive examination portals enforce a specific upper file size limit for candidate photographs and certificate scans. When the application guideline specifies a 50KB to 120KB range, targeting <strong>110KB</strong> maximizes image clarity while guaranteeing successful validation without rejection.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        How SizeSnap 110KB Image Resizer Works
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Our client-side compression algorithm tests multiple compression qualities via binary search to pinpoint the exact threshold that yields 110KB. Facial details, background contrast, and resolution are preserved so your document clears automated scrutiny during document verification (DV).
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={110}
      title="110KB Photo Size Maker"
      description="Resize your photo or document to exactly 110KB for banking and recruitment applications."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

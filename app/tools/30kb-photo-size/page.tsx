import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: '30KB Photo Size - Compress Image to 30KB Online Free (jpg30kb) | SizeSnap',
  description:
    'Resize and compress photo or signature to exact 30KB online for free without losing quality. Ideal for Railway RRB, PAN Card, and competitive exam portals. 100% private & instant.',
  keywords: [
    '30kb photo size',
    '30 kb photo size',
    'jpg30kb',
    'photo size 30 kb',
    'resize image to 30kb',
    'compress photo to 30kb',
    'photo resize 30 kb online',
    'signature resize 30kb',
    '30 kb photo converter',
    'rrb railway photo 30kb',
    'reduce image size to 30kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/30kb-photo-size',
  },
  openGraph: {
    title: '30KB Photo Size - Compress Image to 30KB Online Free | SizeSnap',
    description:
      'Free online tool to compress photos and signatures to exact 30KB for Railway RRB, PAN Card, and government portals.',
    url: 'https://www.sizesnap.in/tools/30kb-photo-size',
    siteName: 'SizeSnap',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  '20kb-photo-size',
  '50kb-photo-size',
  'pan-card-photo-resizer',
  'passport-photo-maker',
  'reduce-image-size-in-kb',
  'resize-image-3-5cm-4-5cm',
];

const FAQS = [
  {
    q: 'How to compress an image to exactly 30KB online for free?',
    a: 'Upload your photo or signature above. SizeSnap will automatically adjust compression tables to produce a high-contrast file under or exactly at 30KB. Click "Download" to save your image.',
  },
  {
    q: 'Which exam portals require 30KB photo or signature size?',
    a: 'Railway Recruitment Boards (RRB NTPC, Group D, ALP) specify photo ranges starting at 30KB (30KB–70KB). Additionally, NSDL and UTIITSL PAN card applications strictly require signature uploads to be under 30KB.',
  },
  {
    q: 'Will my 30KB photo remain clear for verification?',
    a: 'Yes. SizeSnap preserves essential facial features and biometric contrast while eliminating redundant metadata, guaranteeing successful automated verification.',
  },
];

export default function PhotoSize30kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: '30KB Photo Size', url: '/tools/30kb-photo-size' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why Target 30KB for Railway and Identity Uploads?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Railway RRB forms require photographs to be at least <strong>30KB</strong>, whereas PAN Card application portals (Protean NSDL and UTIITSL) enforce a strict maximum ceiling of <strong>30KB</strong> for signature uploads. Compressing to 30KB satisfies both portal constraints perfectly.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={30}
      title="30KB Photo Size Maker"
      description="Resize and compress your photo or signature to exact 30KB online for free."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

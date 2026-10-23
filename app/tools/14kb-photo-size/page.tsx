import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: '14KB Photo Size - Resize Image to 14KB Online Free | SizeSnap',
  description:
    'Resize and compress your photo or signature to exact 14KB online free without losing quality. Ideal for SSC, UPSC, and government job portals. 100% private.',
  keywords: [
    '14kb photo size',
    '14 kb photo size',
    'resize image to 14kb',
    '14 kb photo size jpg',
    'compress image to 14kb',
    'photo resize 14 kb',
    'jpg 14 kb',
    'signature resize 14kb',
    'reduce image size to 14kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/14kb-photo-size',
  },
  openGraph: {
    title: '14KB Photo Size - Resize Image to 14KB Online Free | SizeSnap',
    description:
      'Resize and compress your photo or signature to exact 14KB online free. Ideal for government exam applications.',
    url: 'https://www.sizesnap.in/tools/14kb-photo-size',
    siteName: 'SizeSnap',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-pdf-140kb',
  '12kb-photo-size',
  '13kb-photo-size',
  '20kb-photo-size',
  'passport-photo-maker',
  'pan-card-photo-resizer',
];

const FAQS = [
  {
    q: 'How to resize image to 14KB?',
    a: 'Upload your image on this page. SizeSnap will automatically adjust the quality and resolution to make the photo size exactly 14KB or just under it. Then, click download.',
  },
  {
    q: 'Is this 14KB photo size maker safe?',
    a: 'Yes! We use client-side processing, meaning your photos are compressed directly inside your browser and never uploaded to our servers. Your privacy is 100% guaranteed.',
  },
];

export default function PhotoSize14kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: '14KB Photo Size', url: '/tools/14kb-photo-size' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why do you need a 14KB Photo Size?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Many online portals and government exam websites (such as certain SSC, UPSC, or State PSC forms) have extremely strict file size limitations for signature and thumb impression uploads. Often, the required size is between 10KB and 20KB, making <strong>14KB</strong> the perfect safe target.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        How our 14KB Image Resizer Works
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Our tool uses an advanced compression algorithm that shrinks the file byte by byte until it hits exactly 14KB. It intelligently lowers the image resolution while retaining maximum clarity so that your signature or photo remains clearly visible and gets accepted by the portal.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={14}
      title="14KB Photo Size Maker"
      description="Resize your photo or signature to exactly 14KB for specific exam portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

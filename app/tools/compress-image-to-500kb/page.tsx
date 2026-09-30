import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 500KB Online Free | SizeSnap',
  description:
    'Reduce huge 5MB+ photos down to 500KB while keeping perfect quality. Fast, secure, browser-based compression.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-500kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-300kb',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 500KB?',
    a: 'Upload your photo, ensure target size is 500KB, and we will do the rest natively in your browser.',
  },
];

export default function CompressTo500kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 500KB', url: '/tools/compress-image-to-500kb' },
  ];

  return (
    <ExactKbPage
      targetKb={500}
      title="Compress Image to 500KB Online"
      description="Reduce huge 5MB+ photos down to 500KB while keeping perfect quality. Fast, secure, browser-based compression."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
    />
  );
}

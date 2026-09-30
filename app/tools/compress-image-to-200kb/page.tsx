import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 200KB Online Free | SizeSnap',
  description:
    'Reduce high-quality images and scanned documents to exactly 200KB for pdf generation, university uploads, and fast web hosting.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-200kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-100kb',
  'compress-image-to-300kb',
  'resize-image-pixel',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 200KB?',
    a: 'Upload your photo, ensure the target size is set to 200KB, and let SizeSnap adjust quality and dimensions perfectly.',
  },
];

export default function CompressTo200kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 200KB', url: '/tools/compress-image-to-200kb' },
  ];

  return (
    <ExactKbPage
      targetKb={200}
      title="Compress Image to 200KB Online"
      description="Reduce high-quality images and scanned documents to exactly 200KB for pdf generation, university uploads, and fast web hosting."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
    />
  );
}

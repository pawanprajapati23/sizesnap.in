import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 300KB Online Free | SizeSnap',
  description:
    'Reduce large photos and scanned PDF images to exactly 300KB. Perfect for retaining high quality while saving space.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-300kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-200kb',
  'compress-image-to-500kb',
  'resize-image-pixel',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 300KB?',
    a: 'Upload your large photo, set the target to 300KB, and SizeSnap will compress it beautifully within your browser.',
  },
];

export default function CompressTo300kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 300KB', url: '/tools/compress-image-to-300kb' },
  ];

  return (
    <ExactKbPage
      targetKb={300}
      title="Compress Image to 300KB Online"
      description="Reduce large photos and scanned PDF images to exactly 300KB. Perfect for retaining high quality while saving space."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
    />
  );
}

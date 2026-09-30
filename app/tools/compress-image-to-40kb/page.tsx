import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 40KB Online Free | SizeSnap',
  description:
    'Reduce photo size to exactly 40KB for specific web forms, government job applications, and university portals. Fast, secure, and 100% offline.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-40kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-30kb',
  'compress-image-to-50kb',
  'resize-image-pixel',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 40KB?',
    a: 'Upload your photo, ensure the target size is set to 40KB, and let SizeSnap automatically adjust quality and dimensions.',
  },
];

export default function CompressTo40kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 40KB', url: '/tools/compress-image-to-40kb' },
  ];

  return (
    <ExactKbPage
      targetKb={40}
      title="Compress Image to 40KB Online"
      description="Reduce photo size to exactly 40KB for specific web forms, government job applications, and university portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
    />
  );
}

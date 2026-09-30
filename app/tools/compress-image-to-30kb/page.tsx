import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 30KB Online Free | SizeSnap',
  description:
    'Reduce photo and signature size to exactly 30KB for SSC, UPSC, and State PSC applications. Secure and private offline compression without losing quality.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-30kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'resize-image-pixel',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 30KB?',
    a: 'Upload your photo, ensure the target size is set to 30KB, and SizeSnap will instantly optimize it to hit 30KB or under.',
  },
];

export default function CompressTo30kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 30KB', url: '/tools/compress-image-to-30kb' },
  ];

  return (
    <ExactKbPage
      targetKb={30}
      title="Compress Image to 30KB Online"
      description="Reduce photo and signature size to exactly 30KB for SSC, UPSC, and State PSC applications. Secure and private offline compression."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
    />
  );
}

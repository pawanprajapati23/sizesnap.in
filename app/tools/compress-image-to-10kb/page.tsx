import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 10KB Online Free | SizeSnap',
  description:
    'Reduce photo and signature sizes to exactly 10KB for specific government exams, state PSCs, and fast web uploads. Secure, private, and 100% offline.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-10kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-20kb',
  'resize-image-pixel',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 10KB?',
    a: 'Upload your photo, ensure the target size is set to 10KB, and let SizeSnap automatically adjust quality and dimensions to hit exactly 10KB or under.',
  },
  {
    q: 'Will the image quality drop if I compress it to 10KB?',
    a: 'We use a smart compression algorithm that preserves the highest possible quality. For 10KB, we heavily optimize the image and may slightly reduce dimensions to maintain clear text and features.',
  },
];

export default function CompressTo10kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 10KB', url: '/tools/compress-image-to-10kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why Compress to 10KB?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Certain official portals and highly strict exam websites (such as specific State PSCs) request that thumb impressions and signatures be kept strictly under 10KB in file size. Uploading a larger file will result in an error. Our tool is optimized to shrink your signatures down to 10KB while preserving the legibility of ink marks.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={10}
      title="Compress Image to 10KB Online"
      description="Reduce photo and signature sizes to exactly 10KB for specific government exams, state PSCs, and fast web uploads."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

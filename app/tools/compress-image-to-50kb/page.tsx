import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 50KB Online Free for Govt Exams | SizeSnap 2026',
  description:
    'Reduce passport photo size to exactly 50KB for government job applications, admission forms, and university portals. Fast, secure, and 100% offline.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-50kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-20kb',
  'compress-image-to-100kb',
  'resize-image-pixel',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 50KB?',
    a: 'Upload your photo, ensure the target size is set to 50KB, and let SizeSnap automatically adjust quality and dimensions to hit exactly 50KB or under. Download your optimized file instantly.',
  },
  {
    q: 'Is it safe to compress my passport photo here?',
    a: 'Yes, 100% safe. Your images are compressed strictly in your web browser. Nothing is uploaded to our servers, protecting your personal data completely.',
  },
  {
    q: 'Will the image quality drop if I compress it to 50KB?',
    a: 'We use a smart compression algorithm that preserves the highest possible quality. 50KB is usually enough for a high-quality passport photo or scanned document.',
  },
];

export default function CompressTo50kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 50KB', url: '/tools/compress-image-to-50kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why Compress to 50KB?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Many official portals, state government websites, and university admission forms specifically request that passport-sized photographs be kept strictly under 50KB in file size. Uploading a larger file will result in an error on their application forms. Our tool is optimized to shrink your photos down to 50KB while preserving the clarity of your face and features.
      </p>
      <h3 className="text-base font-bold text-gray-800 mb-2">How we guarantee your privacy</h3>
      <p className="text-sm leading-relaxed">
        Unlike conventional compressor sites that upload your sensitive documents to their servers, SizeSnap executes all image processing natively within your web browser using HTML5 Canvas and WebAssembly. Your files never leave your phone or computer.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={50}
      title="Compress Image to 50KB Online"
      description="Reduce passport photo size to exactly 50KB for government job applications, admission forms, and university portals. Fast, secure, and 100% offline."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 100KB Online Free | SizeSnap',
  description:
    'Reduce scanned document and photo size to exactly 100KB for government job applications, admission forms, and university portals. Fast, secure, and 100% offline.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-100kb',
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
    q: 'How to compress an image to 100KB?',
    a: 'Upload your photo, ensure the target size is set to 100KB, and let SizeSnap automatically adjust quality and dimensions to hit exactly 100KB or under. Download your optimized file instantly.',
  },
  {
    q: 'Is it safe to compress my documents here?',
    a: 'Yes, 100% safe. Your images are compressed strictly in your web browser. Nothing is uploaded to our servers, protecting your personal data completely.',
  },
  {
    q: 'Will the image quality drop if I compress it to 100KB?',
    a: 'We use a smart compression algorithm that preserves the highest possible quality. 100KB is usually enough for a high-quality scanned document or photo.',
  },
];

export default function CompressTo100kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 100KB', url: '/tools/compress-image-to-100kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why Compress to 100KB?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Many official portals, state government websites, and university admission forms specifically request that scanned documents (like marksheets, ID proofs) be kept strictly under 100KB in file size. Uploading a larger file will result in an error on their application forms. Our tool is optimized to shrink your documents down to 100KB while preserving legibility.
      </p>
      <h3 className="text-base font-bold text-gray-800 mb-2">How we guarantee your privacy</h3>
      <p className="text-sm leading-relaxed">
        Unlike conventional compressor sites that upload your sensitive documents to their servers, SizeSnap executes all image processing natively within your web browser using HTML5 Canvas and WebAssembly. Your files never leave your phone or computer.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={100}
      title="Compress Image to 100KB Online"
      description="Reduce scanned document and photo size to exactly 100KB for government job applications, admission forms, and university portals. Fast, secure, and 100% offline."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

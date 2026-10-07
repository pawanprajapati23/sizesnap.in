import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 20KB Online Free for SSC UPSC | SizeSnap 2026',
  description:
    'Compress photo to 20kb and reduce image size to 20kb online free. 100% private image compressor for SSC, UPSC, and government exams. Exact KB resizer without losing quality.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-image-to-20kb',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'compress-image-to-50kb',
  'compress-image-to-100kb',
  'resize-image-pixel',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to 20KB?',
    a: 'Upload your photo, ensure the target size is set to 20KB, and let SizeSnap automatically adjust quality and dimensions to hit exactly 20KB or under. Download your optimized file instantly.',
  },
  {
    q: 'Is it safe to compress my passport photo and signature here?',
    a: 'Yes, 100% safe. Your images are compressed strictly in your web browser. Nothing is uploaded to our servers, protecting your personal data completely.',
  },
  {
    q: 'Will the image quality drop if I compress it to 20KB?',
    a: 'We use a smart compression algorithm that preserves the highest possible quality. For very large images, it may slightly reduce dimensions to maintain clear text and features at 20KB.',
  },
];

export default function CompressTo20kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 20KB', url: '/tools/compress-image-to-20kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why Compress to 20KB?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Many official portals and government exam websites (such as SSC, UPSC, State PSCs) specifically request that signature images and sometimes thumb impressions be kept strictly under 20KB in file size. Uploading a larger file will result in an error on their application forms. Our tool is optimized to shrink your signatures down to 20KB while preserving the legibility of ink marks.
      </p>
      <h3 className="text-base font-bold text-gray-800 mb-2">How we guarantee your privacy</h3>
      <p className="text-sm leading-relaxed">
        Unlike conventional compressor sites that upload your sensitive documents to their servers, SizeSnap executes all image processing natively within your web browser using HTML5 Canvas and WebAssembly. Your files never leave your phone or computer.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={20}
      title="Compress Image to 20KB Online"
      description="Reduce photo and signature sizes to 20KB exact for Indian Government exams, university portals, and fast web uploads. Secure and private."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

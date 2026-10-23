import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 500KB Online Free (Under 500 KB JPG) | SizeSnap',
  description:
    'Compress image to exact 500KB or under 500 KB online for free. Ideal for job application portals, university uploads, and email attachments without losing quality.',
  keywords: [
    'compress image to 500kb',
    'image compressor to 500kb',
    'photo compress 500 kb',
    'reduce image size to 500kb',
    'compress jpeg under 500 kb',
    'photo size 500kb online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-500kb',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-300kb',
  'compress-image-to-200kb',
  'compress-image-to-100kb',
  'compress-image-to-50kb',
  'reduce-image-size-in-kb',
  'compress-image',
];

const FAQS = [
  {
    q: 'How to compress an image to exactly 500KB online?',
    a: 'Upload your JPG, PNG, or WebP photo into the SizeSnap 500KB compressor. The target is preset to 500KB. The tool calibrates compression byte-by-byte and provides an instant download link in seconds.',
  },
  {
    q: 'Why do university portals and job applications enforce a 500KB limit?',
    a: '500KB strikes the ideal balance between photographic clarity and web server bandwidth. It allows admissions and recruitment databases to store high-resolution certificate and passport scans without server congestion.',
  },
  {
    q: 'Does compressing to 500KB blur text on marksheets or identity proofs?',
    a: 'No. At 500KB, images have ample byte budget to preserve sharp letter contours, official stamps, and signature strokes without noticeable compression artifacts.',
  },
  {
    q: 'Are my uploaded certificates and personal photos safe?',
    a: 'Yes, 100%. All compression executes strictly inside your local web browser engine. Your files never leave your phone or computer.',
  },
];

export default function CompressTo500kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 500KB', url: '/tools/compress-image-to-500kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why Compress Images to 500KB?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Modern smartphone cameras produce photos weighing between 4 MB and 12 MB. However, most online recruitment portals, university admission systems, and visa application sites require supporting identity proofs, marksheets, and portrait photos to be strictly <strong>under 500 KB</strong>. SizeSnap provides precision byte targeting so your image is safely accepted on the first upload attempt.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        How SizeSnap Compresses to 500KB Without Blur
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Unlike generic compressors that blindly downsample pixels, SizeSnap strips unnecessary EXIF camera metadata (GPS locations, lens parameters) and optimizes JPEG Huffman coding tables. This frees up maximum file space for actual image pixels, guaranteeing that your text and facial features remain crystal clear.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={500}
      title="Compress Image to 500KB Online Free"
      description="Compress your photo or scanned document to exact 500KB for government and university portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

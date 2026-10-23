import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 300KB Online Free (Under 300 KB JPG) | SizeSnap',
  description:
    'Compress photo or scanned document to exact 300KB online for free. Perfect for government jobs, state police recruitment, and UPSC document verification.',
  keywords: [
    'compress image to 300kb',
    'image compressor to 300kb',
    'photo size 300kb',
    'reduce image size to 300kb',
    'compress photo under 300 kb',
    'photo ko 300kb me kaise convert kare',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-300kb',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-200kb',
  'compress-image-to-500kb',
  'compress-image-to-100kb',
  'compress-image-to-50kb',
  'reduce-image-size-in-kb',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I compress a photo to 300KB online for free?',
    a: 'Upload your JPG or PNG image to SizeSnap 300KB Compressor. The tool automatically compresses your image to under 300KB in seconds while preserving clarity. Click Download to save.',
  },
  {
    q: 'Which examinations require documents under 300KB?',
    a: 'Major national exams including UPSC Civil Services (OTR document uploads), NTA JEE / NEET category certificates, and various state police verification portals mandate files between 50KB and 300KB.',
  },
  {
    q: 'Will my roll number or marksheet text be readable at 300KB?',
    a: 'Yes, absolutely. A single-page document compressed to 300KB retains sharp font edges, official stamps, and signatures without blurring.',
  },
  {
    q: 'Is my personal information stored on SizeSnap servers?',
    a: 'No. All image resizing executes 100% locally in your browser session. Your documents are never uploaded to any remote server.',
  },
];

export default function CompressTo300kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 300KB', url: '/tools/compress-image-to-300kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why Target 300KB for Application Documents?
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Examination commissions like the Union Public Service Commission (UPSC) and national recruitment boards set a strict <strong>300 KB file limit</strong> for identity proofs, caste certificates, and academic qualifications. Uploading a file of 301 KB triggers an immediate rejection. SizeSnap automatically targets ~285KB to 295KB, giving you an exact safety buffer.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Zero Blur, Zero Privacy Risk
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        SizeSnap operates purely on client-side WebAssembly and HTML5 Canvas technology. Your sensitive birth certificates, Aadhaar cards, and marksheets are compressed inside your browser memory without being uploaded to any external server.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={300}
      title="Compress Image to 300KB Online Free"
      description="Compress your photo or scanned document to exact 300KB for government and university portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

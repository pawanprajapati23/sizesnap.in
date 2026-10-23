import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 200KB Online Free (Under 200 KB JPG) | SizeSnap',
  description:
    'Compress photo and signature to exact 200KB online for free. Ideal for NTA UGC NET, SSC, GATE, and banking exams. 100% private, no watermark.',
  keywords: [
    'compress image to 200kb',
    'image compressor to 200kb',
    'photo size 200kb',
    'reduce image size to 200kb',
    'compress photo under 200 kb',
    'nta photo size 200kb',
    'compress jpeg under 200kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-200kb',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-100kb',
  'compress-image-to-300kb',
  'compress-image-to-50kb',
  'compress-image-to-20kb',
  'reduce-image-size-in-kb',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I compress an image to under 200KB online?',
    a: 'Upload your JPG, JPEG, or PNG image into SizeSnap 200KB compressor. The tool automatically compresses your image to under 200KB in seconds while preserving clarity. Click Download to save.',
  },
  {
    q: 'Why do NTA and SSC portals enforce a 200KB upper limit?',
    a: 'NTA exams (UGC NET, JEE, NEET) and SSC portals require candidate passport photographs to be between 10KB and 200KB. Files over 200KB are automatically blocked by the upload validator.',
  },
  {
    q: 'Does compressing to 200KB affect facial details or ear visibility?',
    a: 'No. At 200KB, image pixels have full fidelity to clearly show facial biometric features, eyes, and ears as required by government exam guidelines.',
  },
  {
    q: 'Are my exam photographs uploaded to any server?',
    a: 'No. SizeSnap executes 100% client-side in your browser. Your photos never leave your smartphone or computer.',
  },
];

export default function CompressTo200kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 200KB', url: '/tools/compress-image-to-200kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why 200KB is the Golden Standard for NTA &amp; SSC
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Government testing agencies like the <strong>National Testing Agency (NTA)</strong> and <strong>Staff Selection Commission (SSC)</strong> strictly specify that passport photographs must not exceed <strong>200 KB</strong>. When you take a selfie or camera portrait, the original file is often 3MB to 6MB. SizeSnap compresses it directly into the compliant 10KB–200KB range without pixelation.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Instant Client-Side Compression
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Our browser-native canvas algorithm calculates exact JPEG quantization tables to bring your file size safely under 200 KB while retaining crisp facial details, sharp hair boundaries, and pure white backgrounds.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={200}
      title="Compress Image to 200KB Online Free"
      description="Compress your photo or scanned document to exact 200KB for government and university portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: '100KB Photo Size - Compress Image to 100KB Online Free (jpg100kb) | SizeSnap',
  description:
    'Resize and compress photo or document to exact 100KB online for free without losing quality. Ideal for college admissions, National Scholarship Portal (NSP), and recruitment portals. 100% private.',
  keywords: [
    '100kb photo size',
    '100 kb photo size',
    'jpg100kb',
    'photo size 100 kb',
    'resize image to 100kb',
    'compress photo to 100kb',
    'photo resize 100 kb online',
    '100 kb photo converter',
    'reduce image size to 100kb',
    'compress image to 100kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/100kb-photo-size',
  },
  openGraph: {
    title: '100KB Photo Size - Compress Image to 100KB Online Free | SizeSnap',
    description:
      'Free online tool to compress photos and scanned documents to exact 100KB for scholarship, admission, and recruitment portals.',
    url: 'https://www.sizesnap.in/tools/100kb-photo-size',
    siteName: 'SizeSnap',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  '50kb-photo-size',
  '110kb-photo-size',
  '60kb-photo-size',
  'passport-photo-maker',
  'compress-image-to-100kb',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'How to resize an image to exactly 100KB online for free?',
    a: 'Upload your photo or scanned certificate above. SizeSnap will automatically adjust compression quality and resolution to make the file size strictly at or under 100KB. Then click "Download".',
  },
  {
    q: 'Which portals require 100KB photo or certificate size?',
    a: 'The National Scholarship Portal (NSP), university admission forms, visa application systems, and state recruitment boards frequently set 100KB as the upper file size ceiling for scanned marksheet and photo uploads.',
  },
  {
    q: 'Is my scanned certificate uploaded to any server?',
    a: 'No. SizeSnap runs 100% client-side in your web browser. Your confidential academic marksheets and identity proofs never leave your device.',
  },
];

export default function PhotoSize100kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: '100KB Photo Size', url: '/tools/100kb-photo-size' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why 100KB Photo Size is Common for Academic &amp; Scholarship Portals
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Admission and scholarship portals need to store millions of candidate records efficiently. A <strong>100KB</strong> target provides pristine text clarity for marksheet scans and passport photos while ensuring zero rejection errors during file upload.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={100}
      title="100KB Photo Size Maker"
      description="Resize and compress your photo or scanned document to exact 100KB online for free."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress Image to 5KB Online Free - 5KB Signature & Photo Maker | SizeSnap',
  description:
    'Compress photo and signature to exact 5KB online for free without blur. Lightweight 5KB JPG resizer for online portals, exam forms, and signatures. 100% private.',
  keywords: [
    'compress image to 5kb',
    'compress photo to 5kb',
    'resize image to 5kb',
    '5kb photo size',
    '5kb signature resize',
    'signature under 5kb',
    'reduce image size to 5kb',
    '5 kb photo converter',
    'photo ko 5kb me kaise convert kare',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-5kb',
  },
  openGraph: {
    title: 'Compress Image to 5KB Online Free - 5KB Photo & Signature Maker | SizeSnap',
    description:
      'Free online tool to compress image and signature to exact 5KB or under without losing stroke clarity. Ideal for portal submissions.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-5kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-10kb',
  'compress-image-to-12kb',
  'compress-image-to-15kb',
  'compress-image-to-20kb',
  'generate-signature',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'How to compress an image or signature to 5KB online for free?',
    a: 'Upload your photo or signature into SizeSnap. Target size is pre-configured to 5KB. Our client-side algorithm optimizes dimensions and color quantization to generate a clean, legible 5KB JPG.',
  },
  {
    q: 'Signature ko 5KB me kaise banayein (सिग्नेचर 5KB कैसे बनाएं)?',
    a: 'SizeSnap par apni signature upload karein. Tool automatically extra bytes remove karke aur stroke sharpness preserve karte hue exact 5KB ka bana dega. "Download" par click karke turant save karein.',
  },
  {
    q: 'Will my signature remain legible at 5KB?',
    a: 'Yes. SizeSnap uses specialized thresholding for signatures that ensures black pen strokes stand out clearly against white backgrounds without compression pixelation.',
  },
  {
    q: 'Is my upload safe and secure?',
    a: '100% private. All processing takes place locally in your web browser. No files are uploaded to any server or cloud database.',
  },
];

export default function CompressImageTo5KbPage() {
  return (
    <ExactKbPage
      targetKb={5}
      title="Compress Image to 5KB Online Free"
      description="Compress your photo, stamp, or signature to exact 5KB online without losing readability. Ideal for online exam portals, judicial recruitment, and government forms requiring small file sizes."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Compress Image', url: '/category/compress' },
        { name: 'Compress to 5KB', url: '/tools/compress-image-to-5kb' },
      ]}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            How to Compress Signatures Down to 5KB Without Blurriness
          </h2>
          <p>
            Certain state recruitment portals, judicial court services, and scholarship boards enforce strict
            file limits of <strong className="text-blue-700">Max 5 KB or 10 KB</strong> for signatures and thumbprints.
          </p>
          <p>
            When reducing an image down to 5 KB, standard compression tools often cause severe artifacting.
            SizeSnap balances resolution scaling and high-contrast quantization so that candidate signatures remain
            sharp, crisp, and verifiable.
          </p>
        </div>
      }
    />
  );
}

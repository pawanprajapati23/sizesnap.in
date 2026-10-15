import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress Image Between 30KB to 70KB Online Free - Railway RRB Photo Resizer | SizeSnap',
  description:
    'Compress photo and signature between 30KB to 70KB online for free without blur. Golden 50KB midpoint target for Railway RRB NTPC, ALP, Technician & Group D.',
  keywords: [
    'compress image between 30kb to 70kb',
    'compress photo between 30kb to 70kb',
    'rrb photo size 30kb to 70kb',
    'railway photo 30 to 70 kb',
    '30kb to 70kb photo converter',
    'rrb signature 30kb to 70kb',
    'railway form photo resizer',
    'compress photo 30 to 70 kb online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-between-30kb-to-70kb',
  },
  openGraph: {
    title: 'Compress Image Between 30KB to 70KB Online Free | SizeSnap',
    description:
      'Free online tool to compress image and photo strictly between 30KB and 70KB for Railway RRB exams. 100% private in browser.',
    url: 'https://www.sizesnap.in/tools/compress-image-between-30kb-to-70kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-50kb',
  'compress-image-to-40kb',
  'compress-image-to-30kb',
  'passport-photo-maker',
  'generate-signature',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'How to compress an image between 30KB to 70KB online for free?',
    a: 'Upload your photo or signature into SizeSnap. The tool is pre-set to 50KB (the exact golden midpoint between 30KB and 70KB). Click Download to save your file ready for Railway RRB form uploads.',
  },
  {
    q: 'Photo ko 30KB se 70KB ke beech kaise karein (30 से 70 KB फोटो कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya signature select karein. Tool automatically file size ko 50KB par set karega jo 30KB se badi aur 70KB se choti hoti hai. "Download" dabayein aur Railway RRB portal par bina kisi error ke upload karein.',
  },
  {
    q: 'Which exams require photos between 30KB and 70KB?',
    a: 'Indian Railways RRB (Railway Recruitment Boards) for RRB NTPC (Graduate & Undergraduate), RRB ALP (Assistant Loco Pilot), RRB Technician, RRB JE, and Railway Group D mandate both photograph and signature between 30 KB and 70 KB.',
  },
  {
    q: 'Why is 50KB recommended for Railway RRB uploads?',
    a: '50KB is the exact center of the 30KB–70KB limit. Uploading at 50KB gives maximum pixel clarity while preventing both "File too small (<30KB)" and "File too large (>70KB)" errors.',
  },
];

export default function CompressImageBetween30KbTo70KbPage() {
  return (
    <ExactKbPage
      targetKb={50}
      title="Compress Image Between 30KB to 70KB Online Free"
      description="Compress your photo and signature strictly between 30KB and 70KB. Pre-configured with the 50KB target to guarantee 100% acceptance for Railway RRB NTPC, ALP, Technician, and Group D applications."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Compress Image', url: '/category/compress' },
        { name: 'Between 30KB to 70KB', url: '/tools/compress-image-between-30kb-to-70kb' },
      ]}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            Railway Recruitment Board (RRB) 30KB to 70KB Guidelines
          </h2>
          <p>
            Unlike SSC or UPSC which use a 20KB–50KB bracket, Indian Railways RRB specifies:
            <strong className="text-blue-700">"Color photograph and signature must be in JPEG format between 30 KB and 70 KB"</strong>.
          </p>
          <p>
            RRB utilizes automated computer vision to pre-screen candidate photos. Uploads below 30 KB or above 70 KB
            are rejected by the validation script. SizeSnap compresses your image to exact 50 KB, preserving facial features,
            ears, and neutral expression.
          </p>
        </div>
      }
    />
  );
}

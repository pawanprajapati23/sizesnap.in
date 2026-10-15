import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress Image Between 20KB to 50KB Online Free - SSC & UPSC Photo Resizer | SizeSnap',
  description:
    'Compress photo and JPG between 20KB to 50KB online for free without blur. Golden 35KB midpoint target for SSC CGL, CHSL, GD, UPSC OTR, and Police forms.',
  keywords: [
    'compress image between 20kb to 50kb',
    'compress photo between 20kb to 50kb',
    'compress jpeg between 20kb to 50kb',
    '20kb to 50kb photo converter',
    'photo size 20kb to 50kb',
    'resize photo 20kb to 50kb online',
    'ssc photo 20kb to 50kb',
    'upsc photo 20 to 50 kb',
    'photo ko 20 se 50 kb me kaise convert kare',
    'compress image 20 to 50 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-between-20kb-to-50kb',
  },
  openGraph: {
    title: 'Compress Image Between 20KB to 50KB Online Free | SizeSnap',
    description:
      'Free online tool to compress image and passport photo strictly between 20KB and 50KB for SSC, UPSC, and government exams. 100% private in browser.',
    url: 'https://www.sizesnap.in/tools/compress-image-between-20kb-to-50kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'compress-image-to-30kb',
  'passport-photo-maker',
  'generate-signature',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'How to compress a photo between 20KB to 50KB online for free?',
    a: 'Upload your photo into SizeSnap. The compression target is automatically preset to 35KB (the exact golden midpoint between 20KB and 50KB). Your photo is resized cleanly and ready to download in under 1 second.',
  },
  {
    q: 'Photo ko 20KB se 50KB ke beech kaise banayein (फोटो को 20 से 50 KB कैसे बनाएं)?',
    a: 'SizeSnap par apni photo select karein. Tool automatically target 35KB par compress karega jo 20KB se badi aur 50KB se choti rehti hai. Download par click karke aap direct SSC, UPSC, ya Police exam portal par upload kar sakte hain.',
  },
  {
    q: 'Why do most Indian government exams mandate photos between 20KB and 50KB?',
    a: 'Staff Selection Commission (SSC CGL/CHSL/MTS/GD), Union Public Service Commission (UPSC OTR), State Police, and Banking boards mandate this range so candidate photos have high enough resolution for facial recognition without overloading server storage.',
  },
  {
    q: 'Why is 35KB the safest target for 20KB - 50KB requirements?',
    a: 'If a photo is compressed too close to 20KB (e.g., 19.8KB), minor byte variations during upload might trigger "File size too small (<20KB)". If compressed close to 50KB (e.g., 50.4KB), it gets rejected for being too large. Aiming for 35KB guarantees 100% acceptance every time.',
  },
  {
    q: 'Will my face or eyes get blurred?',
    a: 'No. SizeSnap uses edge-preserving chroma subsampling that keeps pupils, eyebrows, and facial contours sharp and distinct while removing unnecessary photographic noise.',
  },
];

export default function CompressImageBetween20KbTo50KbPage() {
  return (
    <ExactKbPage
      targetKb={35}
      title="Compress Image Between 20KB to 50KB Online Free"
      description="Compress your photo and JPEG images strictly between 20KB and 50KB. Pre-configured with the golden 35KB target to guarantee 100% acceptance on SSC, UPSC, Police, and government application portals."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Compress Image', url: '/category/compress' },
        { name: 'Between 20KB to 50KB', url: '/tools/compress-image-between-20kb-to-50kb' },
      ]}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            The 20KB to 50KB Standard for Indian Government Job Applications
          </h2>
          <p>
            Nearly 80% of recruitment boards in India enforce an identical photograph specification:
            <strong className="text-blue-700">&quot;Uploaded photo must be in JPG format, between 20 KB and 50 KB&quot;</strong>.
          </p>
          <p>
            Candidates taking photos with modern smartphones end up with 3 MB to 8 MB JPEGs. SizeSnap solves
            this by recalculating quantization tables in real-time within your browser to output a lightweight,
            crystal-clear 35 KB JPG that falls right in the middle of the acceptable 20KB–50KB bracket.
          </p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">
            Major Exams Requiring Photos Between 20KB and 50KB:
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Staff Selection Commission:</strong> SSC CGL, CHSL, MTS, GD Constable, CPO Sub-Inspector.</li>
            <li><strong>UPSC OTR:</strong> Civil Services (IAS/IPS), NDA, CDS, CAPF, and Combined Medical Services.</li>
            <li><strong>State Police Recruitment:</strong> UP Police Constable, Delhi Police, MP Police, Bihar Police Constable.</li>
            <li><strong>Banking Portals:</strong> IBPS PO/Clerk, SBI PO/Clerk, RBI Assistant.</li>
          </ul>

          <h3 className="text-sm font-bold text-gray-900 pt-2">
            Quick Steps:
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs">
            <li>Select or drag your photo into the compressor above.</li>
            <li>The target is preset to <strong>35 KB</strong> (safely inside 20KB–50KB).</li>
            <li>Click <strong>Download</strong> to save your optimized photo ready for upload.</li>
          </ol>
        </div>
      }
    />
  );
}

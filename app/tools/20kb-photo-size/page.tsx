import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: '20KB Photo Size - Compress Image to 20KB Online Free (jpg20kb) | SizeSnap',
  description:
    'Resize and compress photo or signature to exact 20KB online for free without losing quality. Ideal for SSC CGL, CHSL, UPSC, IBPS, Railway RRB, and exam forms. 100% private & instant.',
  keywords: [
    '20kb photo size',
    '20 kb photo size',
    'jpg20kb',
    'photo size 20 kb',
    'resize image to 20kb',
    'compress photo to 20kb',
    'photo resize 20 kb online',
    'signature resize 20kb',
    '20 kb photo converter',
    'ssc photo 20kb',
    'photo ko 20kb me kaise convert kare',
    'reduce image size to 20kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/20kb-photo-size',
  },
  openGraph: {
    title: '20KB Photo Size - Compress Image to 20KB Online Free | SizeSnap',
    description:
      'Free online tool to compress photos and signatures to exact 20KB for SSC, UPSC, and government exams. 100% client-side privacy.',
    url: 'https://www.sizesnap.in/tools/20kb-photo-size',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '20KB Photo Size - Resize Image to 20KB Free | SizeSnap',
    description:
      'Instant 20KB photo & signature compressor for SSC, UPSC, and Indian government applications.',
  },
};

const RELATED_SLUGS = [
  '50kb-photo-size',
  '14kb-photo-size',
  'compress-image-between-20kb-to-50kb',
  'passport-photo-maker',
  'resize-image-3-5cm-4-5cm',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'How to resize an image to exactly 20KB online for free?',
    a: 'Upload your photo or scanned signature above. SizeSnap runs a client-side binary search algorithm that automatically fine-tunes JPEG quantization and resolution to make the file size exactly 20KB (or just under 20KB). Then click "Download" to save your portal-ready file.',
  },
  {
    q: 'Why do SSC, UPSC, and Indian government exams require 20KB photos or signatures?',
    a: 'Recruitment portals like SSC (Staff Selection Commission), UPSC, IBPS, and State PSCs enforce strict limits—typically 20KB to 50KB for applicant photographs, and 10KB to 20KB for signatures. Enforcing a 20KB limit prevents database overload during high-traffic registration deadlines and ensures instant admit card generation.',
  },
  {
    q: 'Will my signature or face photo look blurry after reducing to 20KB?',
    a: 'No. SizeSnap optimizes JPEG compression tables and strips away camera EXIF metadata while preserving ink lines, face contours, and contrast. Your photo and signature will remain sharp and legible for official document verification (DV).',
  },
  {
    q: 'Is my photo uploaded to any external server or saved in a database?',
    a: 'Never. SizeSnap works 100% client-side inside your web browser using HTML5 Canvas. Your biometric photos, Aadhaar details, and confidential documents never leave your mobile phone or laptop.',
  },
  {
    q: 'Can I resize both photograph and signature to 20KB on this page?',
    a: 'Yes. You can upload any JPEG, PNG, or WebP photo or scanned signature. The engine automatically compresses the file to exact 20KB while maintaining the original aspect ratio.',
  },
];

export default function PhotoSize20kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: '20KB Photo Size', url: '/tools/20kb-photo-size' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why 20KB Photo &amp; Signature Size is Mandatory for Indian Exam Portals
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Whether you are registering for <strong>SSC CGL, CHSL, GD Constable, MTS, UPSC CSE, NDA, CDS, IBPS PO, or State Police Bharti</strong>, virtually every online application form specifies an exact boundary condition:
      </p>
      <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 mb-4 pl-1">
        <li><strong>Candidate Signature:</strong> Strictly between 10 KB and 20 KB (target 18KB–20KB for best clarity).</li>
        <li><strong>Candidate Photograph:</strong> Strictly between 20 KB and 50 KB (20KB is the official minimum floor limit).</li>
      </ul>
      <p className="text-sm mb-4 leading-relaxed">
        Uploading a file that is even 1 byte above 20KB on signature fields causes an immediate &quot;File size exceeds 20KB&quot; error. SizeSnap guarantees your file sits comfortably within the permitted threshold.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        How SizeSnap 20KB Image Resizer Works
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Instead of basic linear compression that destroys clarity, our engine utilizes multi-iteration binary quantization. It calculates the exact JPEG compression factor required to reach 20KB, leaving edge sharpness and signature stroke integrity intact.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={20}
      title="20KB Photo Size Maker"
      description="Resize and compress your photo or signature to exact 20KB online for free. Ideal for SSC, UPSC, and Indian government job portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

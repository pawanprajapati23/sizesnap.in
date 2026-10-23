import React from 'react';
import type { Metadata } from 'next';
import { ExactKbPage } from '@/components/templates/ExactKbPage';

export const metadata: Metadata = {
  title: 'Compress Image to 30KB Online Free (Under 30 KB JPG) | SizeSnap',
  description:
    'Compress photo or signature to exact 30KB online for free. Perfect 30KB JPG resizer for PAN Card (NSDL/UTIITSL), SSC, and IBPS bank applications.',
  keywords: [
    'compress image to 30kb',
    'image compressor to 30kb',
    '30kb photo size',
    'photo size 30kb',
    'pan card signature 30kb',
    'reduce image size to 30kb',
    'signature resize 30kb',
    'compress photo under 30 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-30kb',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  '14kb-photo-size',
  'pan-card-photo-resizer',
  'reduce-image-size-in-kb',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I compress a photo or signature to 30KB online?',
    a: 'Upload your photo into SizeSnap 30KB Compressor. The target is preset to 30KB. The tool balances image dimensions and quality until the resulting file is safely under 30KB. Download instantly in one click.',
  },
  {
    q: 'Which portals require signatures and photos under 30KB?',
    a: 'Protean (NSDL) and UTIITSL online PAN card portals mandate signatures strictly under 30 KB. Bank recruitment portals (IBPS PO/Clerk, SBI) and railway boards also enforce 10KB–30KB ceilings.',
  },
  {
    q: 'Will my signature stroke remain clear at 30KB?',
    a: 'Yes. SizeSnap enhances ink-to-paper contrast while stripping unnecessary camera metadata, ensuring your signature stroke remains dark and legible.',
  },
  {
    q: 'Is my signature safe from misuse?',
    a: 'Yes, 100%. Processing is executed exclusively inside your browser memory. Your signature image is never sent to or saved on external servers.',
  },
];

export default function CompressTo30kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 30KB', url: '/tools/compress-image-to-30kb' },
  ];

  const articleHtml = (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        Why 30KB is Crucial for PAN Card &amp; Bank Exams
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        Online PAN card applications on Protean (formerly NSDL) and UTIITSL strictly require candidate signatures to be in JPEG format weighing <strong>under 30 KB</strong>. Similarly, banking exams (IBPS, SBI, RBI) specify strict 10KB to 30KB boundaries. SizeSnap automatically optimizes the byte distribution so your file is accepted with zero rejection errors.
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
        How SizeSnap Keeps Signatures Crisp at 30KB
      </h2>
      <p className="text-sm mb-4 leading-relaxed">
        SizeSnap removes heavy EXIF metadata (camera models, exposure tags) which usually take up 5KB to 8KB alone. By stripping this invisible data, 100% of the 30KB budget is allocated to ink sharpness and paper clarity.
      </p>
    </>
  );

  return (
    <ExactKbPage
      targetKb={30}
      title="Compress Image to 30KB Online Free"
      description="Compress your photo or signature to exact 30KB for PAN Card and government exam portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

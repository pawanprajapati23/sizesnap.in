import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '11KB Photo Size - Resize Image to 11KB Online Free | SizeSnap',
  description:
    'Compress photo and signature to exact 11KB online for free. Ideal 11KB JPG resizer for strict 10KB-12KB portal requirements without blur. 100% private.',
  keywords: [
    '11 kb photo size',
    '11kb photo size',
    'compress image to 11kb',
    'resize image to 11kb',
    '11 kb converter',
    'photo ko 11kb kaise banaye',
    'signature resize 11kb',
    'compress photo to 11kb online',
    '11 kb photo size jpg',
    'reduce image size to 11kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-11kb',
  },
  openGraph: {
    title: '11KB Photo Size - Resize Image to 11KB Online Free | SizeSnap',
    description:
      'Free online tool to compress image and signature to exact 11KB or under without losing quality. Ideal for strict online form limits.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-11kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-10kb',
  'compress-image-to-12kb',
  'compress-image-to-13kb',
  '14kb-photo-size',
  'compress-image-to-20kb',
  'reduce-image-size-in-kb',
  'generate-signature',
];

const FAQS = [
  {
    q: 'How to resize an image or signature to exact 11KB online for free?',
    a: 'Upload your photo or signature by dragging it into SizeSnap. The target size is preset to 11KB. Our smart algorithm balances dimensions and compression to give you an exact 11KB output without pixelation.',
  },
  {
    q: 'Photo ya signature ko 11KB me kaise convert karein (फोटो या सिग्नेचर को 11KB कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya signature upload karein. Target size 11KB pehle se set hai. Tool automatically extra bytes remove karke aur contrast clear rakhte hue file ko exact 11KB ka bana dega. Aap turant "Download" par click karke save kar sakte hain.',
  },
  {
    q: 'Why choose 11KB for government forms?',
    a: 'When an online application mandates a minimum file size of 10KB (e.g. "File must be between 10KB and 20KB"), targeting exactly 10.0KB is risky because some portal validators round down and reject it as 9.9KB. Selecting 11KB guarantees acceptance.',
  },
  {
    q: 'Will my signature remain legible at 11KB?',
    a: 'Yes. SizeSnap uses ink stroke sharpening tailored for handwriting and signatures. Make sure to crop unnecessary white borders around the signature before compression.',
  },
  {
    q: 'Is it safe to upload documents to SizeSnap?',
    a: 'Yes, 100% safe. All compression happens locally inside your browser using HTML5 Canvas. Your files are never sent to any server.',
  },
];

export default function CompressTo11kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 11KB', url: '/tools/compress-image-to-11kb' },
  ];

  const articleHtml = (
    <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
          11KB Photo &amp; Signature Resizer Online (Zero Quality Loss)
        </h2>
        <p className="mb-3">
          Many recruitment and admissions portals specify strict lower and upper boundaries, typically <em>&quot;10KB to 20KB&quot;</em>. Compressing to <strong>11KB</strong> provides the ideal safe margin to ensure your file stays above 10KB while remaining comfortably below the ceiling.
        </p>
        <p>
          <strong>SizeSnap&apos;s 11KB Resizer</strong> processes your image client-side to maintain contrast and razor-sharp text legibility.
        </p>
      </section>

      <section className="bg-[#F8FAFC] border border-slate-200/80 rounded-md p-4 sm:p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#414FA8]" />
          Step-by-Step: How to Reduce Image Size to 11KB
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Select Photo or Signature:</strong> Drag and drop your image into the tool above.
          </li>
          <li>
            <strong>Target Preset:</strong> Preset is configured to <strong>11 KB</strong>.
          </li>
          <li>
            <strong>Instant Processing:</strong> SizeSnap adjusts JPEG quantization tables and scales dimensions instantly.
          </li>
          <li>
            <strong>Download:</strong> Click <strong>Download</strong> to save the optimized file directly.
          </li>
        </ol>
      </section>

      <section className="bg-emerald-50/60 border border-emerald-200 rounded p-4 text-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-900">Zero Cloud Uploads: 100% Private</h4>
            <p className="leading-relaxed">
              Your signature and photos remain strictly on your local device. We never store, transmit, or process your files on remote servers.
            </p>
          </div>
        </div>
      </section>

      <section className="p-4 rounded border border-gray-200 bg-gray-50/50">
        <h4 className="font-bold text-gray-900 text-sm mb-2.5">
          Related Target Presets:
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/tools/compress-image-to-10kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 10KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-image-to-12kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 12KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-image-to-13kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 13KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/14kb-photo-size"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            14KB Photo Size Maker <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );

  return (
    <ExactKbPage
      targetKb={11}
      title="Resize Image to 11KB Online Free (11KB Photo & Signature Maker)"
      description="Compress photo, signature, and thumb impression to exact 11KB or under without losing quality. Ideal 11KB JPG resizer for online application forms."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resize Image to 15KB Online Free - 15KB Photo & Signature Maker | SizeSnap',
  description:
    'Compress photo and signature to exact 15KB online for free without blur. Ideal 15KB JPG resizer for SSC, UPSC, State PSC, Police & exam portals. 100% private.',
  keywords: [
    '15 kb photo size jpg',
    '15 kb photo size',
    '15kb photo size',
    'compress image to 15kb',
    'resize image to 15kb',
    '15 kb converter',
    'photo ko 15kb kaise banaye',
    'signature resize 15kb',
    'compress photo to 15kb online',
    'ssc signature 15kb',
    'reduce image size to 15kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-15kb',
  },
  openGraph: {
    title: 'Resize Image to 15KB Online Free - 15KB Photo & Signature Maker | SizeSnap',
    description:
      'Free online tool to compress image and signature to exact 15KB or under without losing quality. Ideal for SSC, UPSC, and government exam forms.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-15kb',
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
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How to resize an image or signature to exact 15KB online for free?',
    a: 'Upload your photo or signature by dragging it into SizeSnap. The target size is preset to 15KB. Our client-side compression engine automatically balances pixel resolution and quantization tables to generate an exact 15KB JPG without blur.',
  },
  {
    q: 'Photo ya signature ko 15KB me kaise convert karein (फोटो या सिग्नेचर को 15KB कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya signature upload karein. Target size 15KB pehle se set hai. Tool automatically extra bytes remove karke aur contrast clear rakhte hue file ko exact 15KB ka bana dega. Aap turant "Download" par click karke save kar sakte hain.',
  },
  {
    q: 'Why is 15KB considered the safest target for government exam signatures?',
    a: 'Most government portals like SSC (CGL, CHSL, MTS, GD), UPSC OTR, State Police, and Banking (IBPS/SBI) mandate signatures between 10KB and 20KB. Choosing 15KB places your file right at the golden midpoint, ensuring 100% acceptance without file size rejection.',
  },
  {
    q: 'Will my signature become blurry or unreadable at 15KB?',
    a: 'No. SizeSnap uses ink stroke edge sharpening tailored specifically for signatures on white backgrounds. For the sharpest result, crop tightly around your signature before compressing.',
  },
  {
    q: 'Is it safe to upload personal identity photos and signatures to SizeSnap?',
    a: 'SizeSnap is 100% private. All processing runs locally inside your browser via HTML5 Canvas. Your sensitive documents never leave your device and are never uploaded to any remote server.',
  },
];

export default function CompressTo15kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 15KB', url: '/tools/compress-image-to-15kb' },
  ];

  const articleHtml = (
    <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
          15KB Photo &amp; Signature Resizer Online (Zero Quality Loss)
        </h2>
        <p className="mb-3">
          When applying for competitive examinations and public recruitment drives, online portals strictly mandate: <em>&quot;Signature must be between 10KB and 20KB&quot;</em>. Setting your target to <strong>15KB</strong> represents the exact midpoint, ensuring your file satisfies validation rules across every recruitment server.
        </p>
        <p>
          <strong>SizeSnap&apos;s 15KB Image Resizer</strong> shrinks phone camera images (3MB–8MB) down to exactly 15KB while preserving dark ink strokes, sharp lines, and zero pixelation.
        </p>
      </section>

      <section className="bg-[#F8FAFC] border border-slate-200/80 rounded-md p-4 sm:p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#414FA8]" />
          Step-by-Step: How to Reduce Image Size to 15KB
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Select Photo or Signature:</strong> Drag and drop your JPG, PNG, or WebP image into the tool above.
          </li>
          <li>
            <strong>Target Preset:</strong> Target is preset to <strong>15 KB</strong>.
          </li>
          <li>
            <strong>Instant Optimization:</strong> The browser engine adjusts quantization tables and dimensions in milliseconds.
          </li>
          <li>
            <strong>Download:</strong> Click <strong>Download</strong> to save your 15KB file directly.
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
            href="/tools/14kb-photo-size"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            14KB Photo Size Maker <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-image-to-20kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 20KB <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );

  return (
    <ExactKbPage
      targetKb={15}
      title="Resize Image to 15KB Online Free (15KB Photo & Signature Maker)"
      description="Compress photo, signature, and thumb impression to exact 15KB or under without losing quality. Ideal 15KB JPG resizer for SSC, UPSC, and online exam portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

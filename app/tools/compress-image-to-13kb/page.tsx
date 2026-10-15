import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resize Image to 13KB Online Free - 13KB Photo & Signature Maker | SizeSnap',
  description:
    'Compress photo and signature to exact 13KB online for free. Ideal 13KB JPG resizer for SSC, UPSC, State PSC, Police & exam portals without blur. 100% private.',
  keywords: [
    '13 kb photo size',
    '13kb photo size',
    'compress image to 13kb',
    'resize image to 13kb',
    '13 kb converter',
    'photo ko 13kb kaise banaye',
    'signature resize 13kb',
    'compress photo to 13kb online',
    '13 kb photo size jpg',
    'ssc signature 10 to 20 kb',
    'reduce image size to 13kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-13kb',
  },
  openGraph: {
    title: 'Resize Image to 13KB Online Free - 13KB Photo & Signature Maker | SizeSnap',
    description:
      'Free online tool to compress image and signature to exact 13KB or under without losing quality. Ideal for SSC, UPSC, and online job forms.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-13kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-10kb',
  'compress-image-to-12kb',
  '14kb-photo-size',
  'compress-image-to-20kb',
  'reduce-image-size-in-kb',
  'generate-signature',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How to resize an image or signature to exact 13KB online for free?',
    a: 'Upload your photo or signature by dragging it into SizeSnap. The target size is preset to 13KB. Our smart browser algorithm instantly balances pixel dimensions and compression tables to produce a sharp file strictly at or under 13KB.',
  },
  {
    q: 'Photo ya signature ko 13KB me kaise convert karein (फोटो या सिग्नेचर को 13KB कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya signature upload karein. Target size 13KB pehle se set hai. Tool automatically extra bytes remove karke aur ink contrast clear rakhte hue file ko exact 13KB ka bana dega. Aap turant "Download" par click karke save kar sakte hain.',
  },
  {
    q: 'Why do exam forms specify signature sizes between 10KB and 20KB?',
    a: 'Portals like SSC (CGL, CHSL, MTS, GD Constable), UPSC OTR, and State Police enforce a 10KB to 20KB range for candidate signatures. Setting your file to 13KB provides a reliable safety buffer so it never dips below 10KB or exceeds 20KB.',
  },
  {
    q: 'Will my signature become blurry at 13KB?',
    a: 'No. SizeSnap optimizes ink strokes with high contrast edge sharpening. For best results, crop tightly around your signature before compressing to remove unnecessary white background paper.',
  },
  {
    q: 'Is it safe to upload personal identity photos and signatures to SizeSnap?',
    a: 'SizeSnap is 100% private. All processing runs locally inside your browser via HTML5 Canvas. Your sensitive documents never leave your device and are never uploaded to any cloud server.',
  },
];

export default function CompressTo13kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 13KB', url: '/tools/compress-image-to-13kb' },
  ];

  const articleHtml = (
    <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
          13KB Photo &amp; Signature Resizer Online (Zero Quality Loss)
        </h2>
        <p className="mb-3">
          Applying for Indian government competitive exams (SSC, UPSC, State PSC, Police recruitment) often requires signatures between 10KB and 20KB. Choosing <strong>13KB</strong> is the recommended safe target to prevent both &quot;File too small&quot; and &quot;File exceeds 20KB&quot; errors.
        </p>
        <p>
          <strong>SizeSnap&apos;s 13KB Compressor</strong> intelligently scales image dimensions and optimizes compression matrices client-side so your signature remains crisp, dark, and eligible for automated portal verification.
        </p>
      </section>

      <section className="bg-[#F8FAFC] border border-slate-200/80 rounded-md p-4 sm:p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#414FA8]" />
          Step-by-Step: How to Reduce Image Size to 13KB
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Select Photo or Signature:</strong> Drag and drop your image (JPG, PNG, WebP) into the box above.
          </li>
          <li>
            <strong>Target Preset:</strong> The tool is preset to <strong>13 KB</strong>.
          </li>
          <li>
            <strong>Instant Processing:</strong> In milliseconds, your browser recalibrates the file to exactly 13KB.
          </li>
          <li>
            <strong>Download:</strong> Click <strong>Download</strong> to save the optimized file directly to your phone or computer.
          </li>
        </ol>
      </section>

      <section className="bg-emerald-50/60 border border-emerald-200 rounded p-4 text-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-900">100% Client-Side Privacy</h4>
            <p className="leading-relaxed">
              Your biometric signatures and ID photos are never uploaded to our servers. Processing occurs entirely in your browser sandbox using HTML5 Canvas.
            </p>
          </div>
        </div>
      </section>

      <section className="p-4 rounded border border-gray-200 bg-gray-50/50">
        <h4 className="font-bold text-gray-900 text-sm mb-2.5">
          Related Exam Target Presets:
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
      targetKb={13}
      title="Resize Image to 13KB Online Free (13KB Photo & Signature Maker)"
      description="Compress photo, signature, and thumb impression to exact 13KB or under without losing quality. Ideal 13KB JPG resizer for SSC, UPSC, and state exam portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

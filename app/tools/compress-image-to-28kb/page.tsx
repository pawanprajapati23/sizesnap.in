import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resize Image to 28KB Online Free - 28KB Photo & Signature Maker | SizeSnap',
  description:
    'Compress photo and signature to exact 28KB online for free. Ideal 28KB JPG resizer for state police, PSC & online job portals without blur. 100% private.',
  keywords: [
    '28 kb photo size',
    '28kb photo size',
    'compress image to 28kb',
    'resize image to 28kb',
    '28 kb converter',
    'photo ko 28kb kaise banaye',
    'signature resize 28kb',
    'compress photo to 28kb online',
    '28 kb photo size jpg',
    'reduce image size to 28kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-28kb',
  },
  openGraph: {
    title: 'Resize Image to 28KB Online Free - 28KB Photo & Signature Maker | SizeSnap',
    description:
      'Free online tool to compress image and photo to exact 28KB or under without losing quality. Ideal for government and state portal applications.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-28kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-20kb',
  'compress-image-to-30kb',
  'compress-image-to-40kb',
  'compress-image-to-50kb',
  'reduce-image-size-in-kb',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How to resize an image or photo to exact 28KB online for free?',
    a: 'Upload your photo by dragging it into SizeSnap. The target size is preset to 28KB. Our smart engine balances pixel density and quantization tables to generate an exact 28KB JPG file in seconds.',
  },
  {
    q: 'Photo ko 28KB me kaise convert karein (फोटो को 28KB कैसे बनाएं)?',
    a: 'SizeSnap par apni photo upload karein. Target size 28KB pehle se set hai. Tool automatically extra bytes remove karke aur quality maintain karte hue photo ko exact 28KB ka bana dega. Aap turant "Download" button par click karke save kar sakte hain.',
  },
  {
    q: 'Why do certain state portals recommend 28KB?',
    a: 'Many state government recruitments (e.g. Police Constable, Sub-Inspector, State SSCs) mandate passport photos between 20KB and 50KB. Setting 28KB to 30KB guarantees that the photo is neither too small (which can fail DPI checks) nor too large for server file filters.',
  },
  {
    q: 'Will photo quality or face clarity degrade at 28KB?',
    a: 'No. At 28KB, a standard passport photo (3.5cm x 4.5cm or ~350x450px) retains high facial detail, sharp eyes, and clear contrast. SizeSnap uses intelligent quantization to prevent artifacting.',
  },
  {
    q: 'Are my uploaded photos safe and secure?',
    a: 'Yes, 100% secure. SizeSnap operates entirely on your device using client-side JavaScript & HTML5 Canvas. Your photos never touch our servers or cloud infrastructure.',
  },
];

export default function CompressTo28kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 28KB', url: '/tools/compress-image-to-28kb' },
  ];

  const articleHtml = (
    <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
          28KB Photo Resizer Online (Zero Quality Loss)
        </h2>
        <p className="mb-3">
          State government exam portals and university admission forms frequently impose file size restrictions such as <em>&quot;Photograph must be between 20KB and 50KB&quot;</em>. Selecting <strong>28KB</strong> gives you an optimal, middle-ground file size that uploads fast and satisfies all server-side validation criteria.
        </p>
        <p>
          <strong>SizeSnap&apos;s 28KB Image Resizer</strong> reduces phone camera photos (typically 3MB–8MB) down to exactly 28KB while retaining sharp facial recognition features and true colors.
        </p>
      </section>

      <section className="bg-[#F8FAFC] border border-slate-200/80 rounded-md p-4 sm:p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#414FA8]" />
          Step-by-Step: How to Reduce Image Size to 28KB
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Select Photo:</strong> Drag and drop your JPG, PNG, or WebP photo into the tool above.
          </li>
          <li>
            <strong>Target Preset:</strong> Target is preset to <strong>28 KB</strong>.
          </li>
          <li>
            <strong>Instant Optimization:</strong> The client-side engine calculates the best compression ratio in milliseconds.
          </li>
          <li>
            <strong>Download:</strong> Click <strong>Download</strong> to save your 28KB file instantly.
          </li>
        </ol>
      </section>

      <section className="bg-emerald-50/60 border border-emerald-200 rounded p-4 text-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-900">Zero Cloud Uploads: 100% Client-Side Privacy</h4>
            <p className="leading-relaxed">
              Your documents and personal photos are processed strictly inside your web browser. Nothing is ever sent to or stored on external servers.
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
            href="/tools/compress-image-to-20kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 20KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-image-to-30kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 30KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-image-to-40kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 40KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-image-to-50kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 50KB <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );

  return (
    <ExactKbPage
      targetKb={28}
      title="Resize Image to 28KB Online Free (28KB Photo & Signature Maker)"
      description="Compress photo and signature to exact 28KB or under without losing quality. Ideal 28KB JPG resizer for state police and recruitment portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

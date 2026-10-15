import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress Image to 150KB Online Free - 150KB Photo & Document Resizer | SizeSnap',
  description:
    'Compress photo, certificate, and document image to exact 150KB online for free without blur. Ideal 150KB JPG resizer for UPSC, State PSC & exam portals. 100% private.',
  keywords: [
    'compress image to 150kb',
    'resize image to 150kb',
    '150 kb photo size',
    '150kb photo size',
    '150kb image compressor',
    'compress photo to 150kb online',
    '150 kb converter',
    'reduce image size to 150kb',
    '150 kb photo size jpg',
    'photo ko 150kb kaise banaye',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-150kb',
  },
  openGraph: {
    title: 'Compress Image to 150KB Online Free - 150KB Photo & Document Resizer | SizeSnap',
    description:
      'Free online tool to compress image and document to exact 150KB or under without losing quality. Ideal for UPSC, State PSC, and official form uploads.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-150kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-100kb',
  'compress-image-to-200kb',
  'compress-image-to-300kb',
  'compress-pdf-140kb',
  'reduce-image-size-in-kb',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How to compress an image or document to exact 150KB online for free?',
    a: 'Upload your image or document scan by dragging it into SizeSnap. The target size is preset to 150KB. Our smart engine balances pixel dimensions and compression matrices to yield an exact 150KB output with crisp text readability.',
  },
  {
    q: 'Photo ya marksheet scan ko 150KB me kaise convert karein (फोटो या मार्कशीट को 150KB कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya document upload karein. Target size 150KB pehle se set hai. Tool automatically extra bytes remove karke aur text clarity banaye rakhte hue file ko exact 150KB ka bana dega. Aap turant "Download" par click karke save kar sakte hain.',
  },
  {
    q: 'Why do application portals specify 150KB document limits?',
    a: 'Portals such as State PSCs, UPSC OTR, scholarship websites, and university admissions regularly specify document limits between 100KB and 200KB. 150KB is the safe target that ensures full legibility of stamps, seals, and text while remaining comfortably under the 200KB limit.',
  },
  {
    q: 'Will certificates or ID cards become blurry at 150KB?',
    a: 'No. At 150KB, a scanned certificate retains ample resolution for official scrutiny. SizeSnap prioritizes text contrast and sharpness so roll numbers, seals, and dates remain perfectly legible.',
  },
  {
    q: 'Are my uploaded certificates and personal documents safe?',
    a: 'SizeSnap is 100% private. All processing executes locally inside your web browser using HTML5 Canvas. Your sensitive certificates, marksheets, and identity documents are never uploaded to any remote server.',
  },
];

export default function CompressTo150kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 150KB', url: '/tools/compress-image-to-150kb' },
  ];

  const articleHtml = (
    <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
          150KB Photo &amp; Document Resizer Online (Zero Quality Loss)
        </h2>
        <p className="mb-3">
          Uploading scanned certificates, marksheets, and ID proofs on government portals often requires keeping file sizes below 200KB while remaining above 100KB. Choosing <strong>150KB</strong> guarantees that your document maintains maximum legibility while avoiding server upload rejections.
        </p>
        <p>
          <strong>SizeSnap&apos;s 150KB Image Compressor</strong> reduces smartphone camera captures (3MB–8MB) down to strictly 150KB with clear text contrast, sharp seal impressions, and zero blur.
        </p>
      </section>

      <section className="bg-[#F8FAFC] border border-slate-200/80 rounded-md p-4 sm:p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#414FA8]" />
          Step-by-Step: How to Reduce Image Size to 150KB
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Select Photo or Document:</strong> Drag and drop your JPG, PNG, or WebP file into the tool above.
          </li>
          <li>
            <strong>Target Preset:</strong> Target is preset to <strong>150 KB</strong>.
          </li>
          <li>
            <strong>Instant Optimization:</strong> The client-side engine calibrates compression and dimensions in milliseconds.
          </li>
          <li>
            <strong>Download:</strong> Click <strong>Download</strong> to save your 150KB file directly.
          </li>
        </ol>
      </section>

      <section className="bg-emerald-50/60 border border-emerald-200 rounded p-4 text-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-900">Zero Cloud Uploads: 100% Private</h4>
            <p className="leading-relaxed">
              Your marksheets, certificates, and personal identity files remain strictly on your local device. We never store, transmit, or process your files on remote servers.
            </p>
          </div>
        </div>
      </section>

      <section className="p-4 rounded border border-gray-200 bg-gray-50/50">
        <h4 className="font-bold text-gray-900 text-sm mb-2.5">
          Related Document &amp; KB Presets:
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/tools/compress-image-to-100kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 100KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-image-to-200kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 200KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-pdf-140kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress PDF to 140KB <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/document-scanner"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Document Scanner (B&amp;W Filter) <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );

  return (
    <ExactKbPage
      targetKb={150}
      title="Compress Image to 150KB Online Free (150KB Photo & Document Resizer)"
      description="Compress photo, certificate, and document to exact 150KB or under without losing quality. Ideal 150KB JPG resizer for online application forms."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

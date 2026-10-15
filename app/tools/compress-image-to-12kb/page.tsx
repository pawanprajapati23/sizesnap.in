import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resize Image to 12KB Online Free - 12KB Photo & Signature Maker | SizeSnap',
  description:
    'Compress photo and signature to exact 12KB online for free. Ideal 12KB JPG resizer for SSC, UPSC OTR, State PSC, Police & exam portals without blur. 100% private.',
  keywords: [
    '12 kb photo size',
    '12kb photo size',
    'compress image to 12kb',
    'image compressor to 12kb',
    '12 kb converter',
    'resize image to 12kb',
    'photo ko 12kb kaise banaye',
    'signature resize 12kb',
    'compress photo to 12kb online',
    '12 kb photo size jpg',
    'ssc signature 10 to 20 kb',
    'reduce image size to 12kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-12kb',
  },
  openGraph: {
    title: 'Resize Image to 12KB Online Free - 12KB Photo & Signature Maker | SizeSnap',
    description:
      'Free online tool to compress image and signature to exact 12KB or under without losing quality. Perfect for SSC, UPSC OTR, and competitive exams.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-12kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'compress-image-to-10kb',
  '14kb-photo-size',
  'compress-image-to-20kb',
  'compress-pdf-12kb',
  'reduce-image-size-in-kb',
  'generate-signature',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How to resize an image or signature to exact 12KB online for free?',
    a: 'Upload your photo or signature by dragging it into SizeSnap. The target size is preset to 12KB. Our smart client-side algorithm instantly analyzes image density, balances dimensions, and compresses the file to strictly 12KB or under without blur.',
  },
  {
    q: 'Photo ya signature ko 12KB me kaise convert karein (फोटो या सिग्नेचर को 12KB कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya signature upload karein. Target size 12KB pehle se set hai. Tool automatically extra bytes remove karke aur contrast clear rakhte hue file ko exact 12KB ka bana dega. Aap turant "Download" par click karke save kar sakte hain.',
  },
  {
    q: 'Why is 12KB the ideal target size for government job applications?',
    a: 'Most government portals like SSC (CGL, CHSL, MTS, GD), UPSC OTR, State PSCs, and Police Recruitment mandate signature and thumb impression uploads between 10KB and 20KB. Choosing 12KB gives you a safe buffer that guarantees 100% acceptance without file size rejection errors.',
  },
  {
    q: 'Will my signature become blurry or unreadable at 12KB?',
    a: 'No. SizeSnap uses ink stroke edge sharpening and adaptive JPEG quantization tables specifically optimized for dark text and signatures on light backgrounds. For the sharpest results, crop out excess blank white borders before compressing.',
  },
  {
    q: 'What are the recommended dimensions for a 12KB signature?',
    a: 'Most exam portals require signatures around 140 × 60 pixels (approx. 3.5 cm × 1.5 cm or 4.0 cm × 2.0 cm) in JPG/JPEG format. SizeSnap automatically scales your mobile phone snapshot down to these exact proportions.',
  },
  {
    q: 'Is it safe to upload personal signatures and ID photos to SizeSnap?',
    a: 'Yes, 100% safe. SizeSnap executes all image processing directly in your browser using HTML5 Canvas. Your files are never uploaded to any remote server or cloud storage, keeping your biometrics private.',
  },
];

export default function CompressTo12kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 12KB', url: '/tools/compress-image-to-12kb' },
  ];

  const articleHtml = (
    <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
      {/* Intro section */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
          12KB Photo &amp; Signature Resizer Online (Zero Quality Loss)
        </h2>
        <p className="mb-3">
          Applying for government jobs, competitive exams, or online identity verification often requires meeting strict file size criteria such as <em>&quot;Signature must be between 10KB and 20KB&quot;</em>. Mobile phone cameras produce files that are 3MB to 8MB, resulting in upload errors.
        </p>
        <p>
          <strong>SizeSnap&apos;s 12KB Image Compressor</strong> is designed to reduce photos, signatures, and thumb impressions to strictly <strong>12KB</strong>. It provides the ideal middle ground for portals demanding files between 10KB and 20KB, ensuring fast uploads and zero form rejections.
        </p>
      </section>

      {/* Step-by-Step Guide */}
      <section className="bg-[#F8FAFC] border border-slate-200/80 rounded-md p-4 sm:p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#414FA8]" />
          Step-by-Step: How to Reduce Image Size to 12KB
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong>Upload Photo or Signature:</strong> Drag and drop your JPG, PNG, or WebP image into the box above or click <em>&quot;Browse Files&quot;</em>.
          </li>
          <li>
            <strong>Preset 12 KB Target:</strong> The tool is already tuned to <strong>12 KB</strong>. You can fine-tune it if your specific portal asks for 10KB or 14KB.
          </li>
          <li>
            <strong>Instant Smart Compression:</strong> The client-side engine recalculates pixels and quantization tables to achieve 12KB with optimal sharpness.
          </li>
          <li>
            <strong>Download Result:</strong> Check the live file size and preview. Click <strong>Download</strong> to save the file instantly.
          </li>
        </ol>
      </section>

      {/* Exam Requirements Table */}
      <section>
        <h3 className="text-base sm:text-h3 font-bold text-gray-900 mb-3">
          Popular Government Exams Requiring 10KB – 20KB (12KB Sweet Spot)
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          These major recruitment portals mandate signature and document uploads where 12KB is the recommended size:
        </p>
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm text-left">
            <thead className="bg-gray-50 text-gray-800 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Exam / Portal Name</th>
                <th className="py-2.5 px-3">Document Type</th>
                <th className="py-2.5 px-3">Required Size Range</th>
                <th className="py-2.5 px-3">Recommended Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              <tr>
                <td className="py-2.5 px-3 font-medium text-gray-900">SSC (CGL, CHSL, MTS, GD Constable)</td>
                <td className="py-2.5 px-3">Candidate Signature</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">10 KB – 20 KB</td>
                <td className="py-2.5 px-3 font-bold text-indigo-700">12 KB (Safe Buffer)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-gray-900">UPSC OTR (One Time Registration)</td>
                <td className="py-2.5 px-3">Digital Signature</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">10 KB – 20 KB</td>
                <td className="py-2.5 px-3 font-bold text-indigo-700">12 KB</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-gray-900">Delhi Police &amp; UP Police Recruitment</td>
                <td className="py-2.5 px-3">Signature &amp; Thumb Impression</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">10 KB – 20 KB</td>
                <td className="py-2.5 px-3 font-bold text-indigo-700">12 KB</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-gray-900">IBPS Bank PO / Clerk / RRB</td>
                <td className="py-2.5 px-3">Signature &amp; Left Thumb Impression</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">10 KB – 20 KB</td>
                <td className="py-2.5 px-3 font-bold text-indigo-700">12 KB</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-gray-900">State PSCs (BPSC, UPPSC, MPSC, RPSC)</td>
                <td className="py-2.5 px-3">Candidate Signature</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">10 KB – 20 KB</td>
                <td className="py-2.5 px-3 font-bold text-indigo-700">12 KB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pro Tips for 12KB Output */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
          Expert Tips: Crisp 12KB Photos &amp; Signatures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3">
          <div className="p-3.5 rounded bg-white border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF1FB] text-[#414FA8] text-xs font-bold">1</span>
              Crop Blank Margins
            </h4>
            <p className="text-xs text-gray-600">
              Crop tightly around your signature or face before compression. Blank paper background takes up bytes that should be spent on ink clarity.
            </p>
          </div>
          <div className="p-3.5 rounded bg-white border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF1FB] text-[#414FA8] text-xs font-bold">2</span>
              Use High Contrast Pen
            </h4>
            <p className="text-xs text-gray-600">
              Use a bold dark black or blue ballpoint pen on plain white unruled paper. Avoid pencil or faded gel pens.
            </p>
          </div>
          <div className="p-3.5 rounded bg-white border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF1FB] text-[#414FA8] text-xs font-bold">3</span>
              Download as JPG/JPEG
            </h4>
            <p className="text-xs text-gray-600">
              Always choose JPG for 12KB outputs. PNG format has higher file overhead and is often rejected by government portal validators.
            </p>
          </div>
          <div className="p-3.5 rounded bg-white border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF1FB] text-[#414FA8] text-xs font-bold">4</span>
              Zero Cloud Uploads
            </h4>
            <p className="text-xs text-gray-600">
              SizeSnap processes your images 100% inside your browser. Your sensitive signatures and photo IDs never reach any remote server.
            </p>
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="bg-emerald-50/60 border border-emerald-200 rounded p-4 text-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-900">100% Private &amp; Secure Client-Side Processing</h4>
            <p className="leading-relaxed">
              Your signature is your financial and legal identity. Unlike other websites that save your photos on cloud servers, SizeSnap executes all image transformations client-side via JavaScript &amp; HTML5 Canvas. Your documents never leave your phone or computer.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation Links */}
      <section className="p-4 rounded border border-gray-200 bg-gray-50/50">
        <h4 className="font-bold text-gray-900 text-sm mb-2.5">
          Related Preset Sizes for Exam Applications:
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/tools/compress-image-to-10kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress to 10KB (Strict Limit) <ArrowRight className="h-3 w-3" />
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
            Compress to 20KB (Upper Limit) <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/tools/compress-pdf-12kb"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-gray-300 font-medium text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] transition-colors"
          >
            Compress PDF to 12KB <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );

  return (
    <ExactKbPage
      targetKb={12}
      title="Resize Image to 12KB Online Free (12KB Photo & Signature Maker)"
      description="Compress photo, signature, and thumb impression to exact 12KB or under without losing quality. Ideal 12KB JPG resizer for SSC, UPSC, and state exam portals."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={articleHtml}
    />
  );
}

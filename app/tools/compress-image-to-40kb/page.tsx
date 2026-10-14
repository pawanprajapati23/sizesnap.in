import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExactKbPage } from '@/components/templates/ExactKbPage';
import { ArrowRight, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress Image to 40KB Online Free (Resize Photo to 40KB) | SizeSnap',
  description:
    'Free online tool to compress and resize photos, signatures, and documents to exactly 40KB for UPSSSC, Railway RRB, SSC, state exam portals, and job applications without losing clarity.',
  keywords: [
    'compress image to 40kb',
    'resize image to 40kb',
    '40kb photo resizer',
    'compress photo to 40kb online',
    'photo size 40 kb',
    'upsssc photo 40kb',
    'resize photo 40 kb online',
    'railway signature 40kb',
    'reduce image size to 40kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-image-to-40kb',
  },
  openGraph: {
    title: 'Compress Image to 40KB Online Free (Resize Photo to 40KB) | SizeSnap',
    description:
      'Instantly compress image or photo to exactly 40KB online for UPSSSC, Railway RRB, SSC, and govt exam portals without losing quality.',
    url: 'https://www.sizesnap.in/tools/compress-image-to-40kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'passport-photo-maker',
  'generate-signature',
  'reduce-image-size-in-kb',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'resize-image-pixel',
];

const FAQS = [
  {
    q: 'How do I compress an image to exactly 40KB online?',
    a: 'Simply upload or drop your photo into the tool above. The target limit is automatically set to 40KB. SizeSnap uses smart client-side binary search algorithms to reduce file size to exactly 40KB or just under 40KB in milliseconds without uploading to any server.',
  },
  {
    q: 'Which exams and government portals require photos or signatures under 40KB?',
    a: 'Key portals include UPSSSC (PET, Lekhpal, VDO), Railway RRB (NTPC, Group D, ALP signature 10KB–40KB), Staff Selection Commission (SSC documents), State Police recruitments (UP Police, Delhi Police), and university entrance forms where strict 40KB file limits are enforced.',
  },
  {
    q: 'Will reducing my image to 40KB make it blurry or rejectable?',
    a: 'No. SizeSnap intelligently balances JPEG quantization matrices and dimension scaling to retain maximum facial biometrics, sharp text, and clear signature strokes so your file clears automated portal validation checks.',
  },
  {
    q: 'Can I resize signatures, thumb impressions, or certificates to 40KB?',
    a: 'Yes. You can upload scanned handwritten signatures (black or blue ink), left thumb impressions, or category certificates. The tool will compress them to fit exactly within 40KB.',
  },
  {
    q: 'Is it private and secure to compress my personal documents on SizeSnap?',
    a: 'Yes, 100% private. All processing runs directly inside your web browser via WebAssembly and Canvas. No images or personal files are ever transmitted or saved on external servers.',
  },
];

const ExamGuideHtml = (
  <div className="space-y-4">
    <h2 className="text-base sm:text-lg font-bold text-gray-900">
      Official Guidelines for 40KB Photo &amp; Signature Uploads
    </h2>
    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
      Most state recruitment commissions (such as UPSSSC, UPPSC, BPSC, and Railway RRB) employ automated validation scripts that reject uploaded application images exceeding the specified file size limit. Compressing your photograph or signature to strictly <strong>under or equal to 40 KB</strong> guarantees successful submission on the first attempt.
    </p>

    <div className="overflow-x-auto my-3">
      <table className="w-full text-left text-xs border border-gray-200 rounded">
        <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th className="p-2.5">Document Type</th>
            <th className="p-2.5">Portal Limit</th>
            <th className="p-2.5">Recommended Size</th>
            <th className="p-2.5">Format</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-600">
          <tr>
            <td className="p-2.5 font-medium text-gray-900">Passport Photograph</td>
            <td className="p-2.5">Max 50 KB / 40 KB</td>
            <td className="p-2.5 font-semibold text-emerald-700">35 KB – 40 KB</td>
            <td className="p-2.5">JPG / JPEG</td>
          </tr>
          <tr>
            <td className="p-2.5 font-medium text-gray-900">Official Signature</td>
            <td className="p-2.5">10 KB – 40 KB (RRB / State)</td>
            <td className="p-2.5 font-semibold text-emerald-700">15 KB – 30 KB</td>
            <td className="p-2.5">JPG / JPEG</td>
          </tr>
          <tr>
            <td className="p-2.5 font-medium text-gray-900">Thumb Impression</td>
            <td className="p-2.5">10 KB – 40 KB</td>
            <td className="p-2.5 font-semibold text-emerald-700">20 KB – 38 KB</td>
            <td className="p-2.5">JPG / JPEG</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Next Steps for Exam Applicants */}
    <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-[4px] mt-4">
      <div className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 text-[#414FA8]" />
        <span>Need Other Exam Document Sizes?</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <Link
          href="/tools/passport-photo-maker"
          className="p-2 bg-white rounded border border-blue-100 hover:border-[#9AA3C8] text-gray-800 hover:text-[#414FA8] font-medium flex items-center justify-between transition-colors"
        >
          <span>Passport Photo Maker (Name &amp; Date)</span>
          <ArrowRight className="h-3 w-3 text-gray-400" />
        </Link>
        <Link
          href="/tools/generate-signature"
          className="p-2 bg-white rounded border border-blue-100 hover:border-[#9AA3C8] text-gray-800 hover:text-[#414FA8] font-medium flex items-center justify-between transition-colors"
        >
          <span>Signature Resizer (10KB–20KB)</span>
          <ArrowRight className="h-3 w-3 text-gray-400" />
        </Link>
      </div>
    </div>
  </div>
);

export default function CompressTo40kbPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress to 40KB', url: '/tools/compress-image-to-40kb' },
  ];

  return (
    <ExactKbPage
      targetKb={40}
      title="Compress Image to 40KB Online Free"
      description="Reduce image and photo file size to exactly 40KB for UPSSSC, Railway RRB, SSC, state exam portals, and job applications without losing clarity."
      breadcrumbs={breadcrumbs}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={ExamGuideHtml}
    />
  );
}

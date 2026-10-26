import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JpgToPdfUnderKbPage } from '@/components/templates/JpgToPdfUnderKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JPG to PDF Under 200 KB - Convert Image to PDF Below 200KB Free | SizeSnap',
  description:
    'Convert JPG, JPEG & PNG to PDF strictly under 200 KB online for free without losing text clarity. Ideal for SSC, UPSC, RRB, State PSC marksheets & certificates.',
  keywords: [
    'jpg to pdf under 200 kb',
    'jpg to pdf under 200kb',
    'jpeg to pdf under 200 kb',
    'convert jpg to pdf under 200 kb',
    'jpg to pdf 200 kb',
    'convert image to pdf under 200kb',
    'marksheet jpg to pdf under 200 kb',
    'caste certificate jpg to pdf under 200kb',
    'photo to pdf under 200 kb',
    'image to pdf 200 kb',
    'ssc marksheet pdf under 200kb',
    'rrb document pdf under 200 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-200kb',
  },
  openGraph: {
    title: 'JPG to PDF Under 200 KB - Free Image to PDF Converter | SizeSnap',
    description:
      'Convert JPG/JPEG images and scanned certificates to PDF under 200 KB with 100% browser-based security. Ideal for Indian government job portals.',
    url: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-200kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'jpg-to-pdf-under-150kb',
  'jpg-to-pdf-under-100kb',
  'jpg-to-pdf-under-500kb',
  'compress-pdf-140kb',
  'compress-pdf-300kb',
  'document-scanner',
];

const FAQS = [
  {
    q: 'How to convert JPG to PDF under 200 KB online for free?',
    a: 'Simply upload your JPG, JPEG, or PNG certificate/marksheet photo into SizeSnap. The tool is pre-set to generate a PDF strictly under 200 KB. Click "Convert to PDF" and instantly download your lightweight, crystal-clear document.',
  },
  {
    q: 'JPG photo ko PDF me 200 KB se kam kaise banayein (फोटो को PDF 200KB से कम कैसे करें)?',
    a: 'SizeSnap par apni photo ya marksheet select karein. Target size automatically 200 KB ke andar optimized rehta hai. "Convert to PDF" button dabayein, tool aapki file ko bina blur kiye 200KB se kam ka PDF bana dega jise aap direct SSC ya govt exam portal par upload kar sakte hain.',
  },
  {
    q: 'Will my marksheet or certificate text remain readable in a 200 KB PDF?',
    a: 'Yes. SizeSnap employs adaptive quantization and canvas rendering specifically tuned for high-contrast text and stamps. It maintains sharp typography for roll numbers, marks, signatures, and government seals while discarding unnecessary file metadata.',
  },
  {
    q: 'Which exams require PDF documents strictly under 200 KB?',
    a: 'Almost all major Indian recruitment portals mandate PDF certificates under 200 KB: SSC (CGL, CHSL, MTS, CPO, GD document verification), UPSC CSE/NDA/CDS, Railway RRB NTPC & Group D, State PSCs (UPPSC, BPSC, MPPSC, MPSC, TNPSC), and CTET/KVS teacher recruitments.',
  },
  {
    q: 'Can I combine multiple JPG pages into one single PDF under 200 KB?',
    a: 'Yes! You can upload multiple pages (like semester marksheets or multi-page caste/income certificates). SizeSnap will budget the compression evenly across all pages so that the combined PDF file size remains strictly under 200 KB.',
  },
  {
    q: 'Is my personal document safe when converting on SizeSnap?',
    a: '100% safe. All conversions execute locally inside your web browser using HTML5 Canvas and WebAssembly. Your marksheets, Aadhaar, PAN card, and certificates are never uploaded to any remote server or cloud database.',
  },
];

export default function JpgToPdfUnder200KbPage() {
  return (
    <JpgToPdfUnderKbPage
      targetKb={200}
      title="Convert JPG to PDF Under 200 KB Online Free"
      description="Turn your JPG, JPEG, and PNG images into an official PDF document strictly under 200 KB. Optimized for Indian recruitment exams (SSC, UPSC, RRB), marksheet uploads, and certificate submissions."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'PDF Tools', url: '/category/pdf' },
        { name: 'JPG to PDF Under 200 KB', url: '/tools/jpg-to-pdf-under-200kb' },
      ]}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            Why 200 KB is the Standard Limit for Indian Government Form Uploads
          </h2>
          <p>
            When filling online application forms on Indian government and educational portals, candidates
            frequently encounter strict file upload validation errors like{' '}
            <strong className="text-red-600">&quot;File size exceeds 200 KB&quot;</strong> or{' '}
            <strong className="text-red-600">&quot;Document must be in PDF format between 50 KB and 200 KB&quot;</strong>.
          </p>
          <p>
            Standard smartphone camera photos taken on modern phones produce JPEG images ranging between
            3 MB and 8 MB. When using ordinary online converters, the resulting PDF is often 4 MB to 10 MB,
            leading to instantaneous form rejection. SizeSnap solves this dilemma with intelligent browser-based
            downsampling that produces crisp, readable PDF documents strictly under 200 KB (typically 160 KB – 195 KB).
          </p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">
            Top Indian Portals Mandating Under 200 KB PDF Files:
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>Staff Selection Commission (SSC):</strong> 10th/12th marksheet, degree certificate, and category certificate during document verification and post-selection stages.
            </li>
            <li>
              <strong>Railway Recruitment Board (RRB):</strong> RRB NTPC, Group D, ALP technician caste certificate, OBC non-creamy layer certificate, and educational certificates.
            </li>
            <li>
              <strong>UPSC Online:</strong> Detailed Application Form (DAF) uploads for Civil Services, CDS, NDA, and CMS examinations.
            </li>
            <li>
              <strong>State Public Service Commissions (BPSC, UPPSC, MPPSC, RPSC):</strong> Domicile certificates, caste validity, and disability certificates.
            </li>
            <li>
              <strong>National Testing Agency (NTA):</strong> NEET, JEE Main, CUET, and UGC NET category and PwD verification certificates.
            </li>
          </ul>

          <h3 className="text-sm font-bold text-gray-900 pt-2">
            Steps to Convert Image to PDF Under 200 KB:
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs">
            <li>Select or drag your JPG / JPEG / PNG file into the converter box above.</li>
            <li>Verify the target file size is set to <strong>Under 200 KB</strong> (preset by default).</li>
            <li>Choose your preferred page orientation (Auto, Portrait, or Landscape) and page margins.</li>
            <li>Click <strong>&quot;Convert to PDF&quot;</strong>. Your document compiles in under 1 second.</li>
            <li>Click <strong>&quot;Download&quot;</strong> to obtain your official PDF ready for upload.</li>
          </ol>
        </div>
      }
    />
  );
}

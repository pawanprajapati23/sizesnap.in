import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ExamPhotoResizer } from '@/components/tool-ui/ExamPhotoResizer';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import type { ExamPreset } from '@/data/exam-presets';
import { ChevronRight, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Signature Resizer 10KB to 20KB Online (140x60 px & 4x2 cm) | SizeSnap',
  description:
    'Free online signature resizer 10KB to 20KB. Resize scanned signature to 140x60 pixels or 4cm x 2cm (280x120 px) without blur for SSC, IBPS, SBI, India Post GDS, and BPSC.',
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/signature-resizer-10kb-to-20kb',
  },
  openGraph: {
    title: 'Signature Resizer 10KB to 20KB Online (140x60 px) | SizeSnap',
    description:
      'Resize and compress your signature between 10KB and 20KB with crisp ink contrast for SSC, Bank PO/Clerk, GDS, and Bihar BPSC forms.',
    url: 'https://www.sizesnap.in/tools/signature-resizer-10kb-to-20kb',
    type: 'website',
  },
};

const SIGNATURE_PRESET: ExamPreset = {
  id: 'signature-10kb-20kb',
  slug: 'signature-resizer-10kb-to-20kb',
  name: 'Signature Resizer 10KB to 20KB (140×60 px / 4×2 cm)',
  shortTitle: 'Signature (10KB–20KB)',
  authority: 'SSC, IBPS, SBI, India Post GDS & State PSC Standard',
  badge: 'No-Blur Signature Engine',
  metaTitle: 'Signature Resizer 10KB to 20KB Online | SizeSnap',
  metaDescription:
    'Resize signature to exact 10KB-20KB (140x60 px or 280x120 px) online free.',
  summary:
    'Instantly resize your handwritten signature to exact 10KB–20KB (recommended 15KB) in 140×60 px (IBPS/SBI/GDS), 280×120 px (SSC/Police 4×2 cm), or 220×100 px (BPSC <15KB) without blurring the pen strokes.',
  popularFor: ['SSC CGL/CHSL/GD', 'IBPS & SBI PO/Clerk', 'India Post GDS', 'Bihar BPSC (<15KB)', 'UP & Delhi Police'],
  documents: [
    {
      id: 'signature',
      title: 'IBPS / GDS Signature (140×60 px)',
      minKb: 10,
      maxKb: 20,
      recommendedKb: 15,
      widthPx: 140,
      heightPx: 60,
      widthCm: 4.0,
      heightCm: 2.0,
      aspectRatioLabel: '140 x 60 pixels (10KB - 20KB)',
      allowedFormats: ['image/jpeg', 'image/jpg'],
      requiresNameDate: false,
      backgroundRequirement: 'Unruled white paper with black ink pen',
      instructions: [
        'Sign on plain white unruled paper using a black ballpoint or gel pen.',
        'Do NOT sign in ALL CAPITAL LETTERS.',
        'Locked to 140 × 60 pixels and 10 KB – 20 KB (15 KB default).',
      ],
    },
    {
      id: 'ssc-sign',
      title: 'SSC / Police Signature (4×2 cm)',
      minKb: 10,
      maxKb: 20,
      recommendedKb: 15,
      widthPx: 280,
      heightPx: 120,
      widthCm: 4.0,
      heightCm: 2.0,
      aspectRatioLabel: '4.0 cm x 2.0 cm (280 x 120 px)',
      allowedFormats: ['image/jpeg', 'image/jpg'],
      requiresNameDate: false,
      backgroundRequirement: 'Clean white paper with black or blue ink',
      instructions: [
        'Standard 4.0 cm width × 2.0 cm height rectangular box.',
        'Strictly compressed between 10 KB and 20 KB.',
      ],
    },
    {
      id: 'bpsc-sign',
      title: 'BPSC Hindi/Eng Sign (<15KB)',
      minKb: 10,
      maxKb: 15,
      recommendedKb: 13,
      widthPx: 220,
      heightPx: 100,
      widthCm: 3.5,
      heightCm: 1.5,
      aspectRatioLabel: '220 x 100 pixels (Under 15KB)',
      allowedFormats: ['image/jpeg', 'image/jpg'],
      requiresNameDate: false,
      backgroundRequirement: 'White paper with dark black/blue ink',
      instructions: [
        'Specially tuned for Bihar BPSC OTR & TRE Hindi/English signatures.',
        'Kept strictly between 10 KB and 15 KB (13 KB target).',
      ],
    },
  ],
  generalGuidelines: [
    'Crop tightly around your signature before or during upload so the handwriting fills 75% of the frame.',
  ],
  faqs: [],
};

export default function SignatureResizerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/exams" className="hover:text-[#414FA8] font-medium">
            Exam Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Signature Resizer (10KB–20KB)</span>
        </nav>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2.5 py-0.5 rounded">
              140×60 px • 4×2 cm • 220×100 px
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Exact 10KB–20KB Lock
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Signature Resizer 10KB to 20KB Online (140×60 px &amp; 4×2 cm)
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Upload your mobile signature photo and convert it into a crisp, portal-compliant JPEG strictly between <strong>10 KB and 20 KB</strong>. If your cropped signature is too small (e.g., 5 KB), SizeSnap automatically boosts the byte size to 15 KB so recruitment portals never reject it.
          </p>
        </div>

        <ExamPhotoResizer exam={SIGNATURE_PRESET} initialDocId="signature" />

        <ToolSeoContent
          title="Signature Resizer 10KB to 20KB (140x60 px)"
          subtitle="Compatible with SSC, IBPS, SBI, India Post GDS, Bihar BPSC, UP Police & Delhi Police"
          description="Resizing a handwritten signature between 10KB and 20KB at tiny dimensions like 140×60 pixels is the #1 cause of form upload errors in Indian government exams. Standard image compressors either blur the ink or shrink the file down to 4KB–6KB, triggering a 'File size less than 10KB' error. SizeSnap combines exact pixel canvas scaling with lossless JPEG byte locking so your signature always lands at a crisp 14KB–16KB."
          howToSteps={[
            'Sign on plain white unruled paper with a black pen (running handwriting, not block letters).',
            'Select your target tab above: 140×60 px (IBPS/SBI/GDS), 4×2 cm (SSC/Police), or 220×100 px (BPSC <15KB).',
            'Upload your signature image—SizeSnap automatically scales and locks the file to 15 KB (or 13 KB for BPSC).',
            'Inspect the side-by-side preview and click Download.',
          ]}
          table={{
            caption: 'Official Signature Dimension & KB Requirements (2026)',
            headers: ['Recruitment Portal', 'Pixel Dimensions', 'CM Dimensions', 'Allowed KB Range', 'Pen Ink Rule'],
            rows: [
              ['IBPS PO / Clerk / RRB & SBI', '140 × 60 px', '3.5 × 1.5 cm', '10 KB – 20 KB', 'Strictly Black Ink'],
              ['India Post GDS (BPM/ABPM)', '140 × 60 px', '4.0 × 2.0 cm', '10 KB – 20 KB', 'Black or Blue Ink'],
              ['SSC (CGL, CHSL, GD, MTS)', '280 × 120 px', '4.0 × 2.0 cm', '10 KB – 20 KB', 'Black or Blue Ink'],
              ['Bihar BPSC OTR & TRE', '220 × 100 px', '3.5 × 1.5 cm', 'Under 15 KB (10–15 KB)', 'Black or Blue Ink'],
              ['UP Police Constable & SI', '250 × 110 px', '3.5 × 1.5 cm', '5 KB – 20 KB', 'Strictly Black Ink'],
            ],
          }}
          features={[
            {
              title: 'Smart Minimum-KB Padding',
              desc: 'Prevents the dreaded "File size is below 10KB" error by safely padding tiny 140×60 px signatures up to 15KB.',
            },
            {
              title: '3 Official Presets in 1 Tool',
              desc: 'Switch effortlessly between 140×60 px (Banking/GDS), 280×120 px (SSC 4×2cm), and 220×100 px (BPSC <15KB).',
            },
            {
              title: '100% In-Browser Privacy',
              desc: 'Your personal handwritten signature never leaves your phone or computer.',
            },
            {
              title: 'Crisp Stroke Preservation',
              desc: 'Uses high-chroma subsampling so fine Hindi matras and English cursive loops stay sharp.',
            },
          ]}
          faqs={[
            {
              question: 'Why does my 140x60 pixel signature become only 4KB or 6KB in other tools?',
              answer: 'Because 140×60 pixels contains only 8,400 total pixels (mostly white paper), standard JPEG encoders compress it to 4–6 KB. SizeSnap solves this by injecting compliant JPEG metadata padding so the file is strictly 15 KB (inside the 10KB–20KB window).',
            },
            {
              question: 'Can I use blue pen for IBPS or SBI signature upload?',
              answer: 'No. IBPS and SBI notifications strictly require signatures and handwritten declarations in BLACK ink on white paper.',
            },
          ]}
          keywords={[
            'signature resizer 10kb to 20kb',
            '140x60 pixel signature converter',
            'ssc signature resizer 10kb to 20kb',
            'signature size 10kb to 20kb kaise banaye',
            'ibps signature resizer 140x60',
            'bpsc signature resizer under 15kb',
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}

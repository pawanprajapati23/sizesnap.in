import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ExamPhotoResizer } from '@/components/tool-ui/ExamPhotoResizer';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import type { ExamPreset } from '@/data/exam-presets';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Postcard Size Photo Maker (4x6 Inch / 1200x1800 px) for NEET & JEE | SizeSnap',
  description:
    'Free online 4x6 inch Postcard Size Photo Maker for NTA NEET UG, JEE Main, and UPSC. Convert any photo into a 4"x6" postcard photograph (10KB-200KB) with Name & Date stamp and white background.',
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/postcard-size-photo-maker',
  },
  openGraph: {
    title: 'Postcard Size Photo Maker (4x6 Inch) for NEET UG & JEE | SizeSnap',
    description:
      'Create NTA-compliant 4x6 inch postcard size photos (10KB-200KB) with candidate Name & Date (DOP) and AI white background in 1 click.',
    url: 'https://www.sizesnap.in/tools/postcard-size-photo-maker',
    type: 'website',
  },
};

const POSTCARD_PRESET: ExamPreset = {
  id: 'postcard-4x6',
  slug: 'postcard-size-photo-maker',
  name: 'Postcard Size Photo Maker (4" × 6" Inches)',
  shortTitle: '4×6 Postcard Photo (NEET/NTA)',
  authority: 'National Testing Agency (NTA NEET UG / JEE)',
  badge: '4" × 6" Postcard Format',
  metaTitle: 'Postcard Size Photo Maker (4x6 Inch) Online | SizeSnap',
  metaDescription:
    'Convert photo to 4x6 inch postcard size (1200x1800 px, 10KB-200KB) with Name & Date stamp.',
  summary:
    'Create an official 4" × 6" inch (1200 × 1800 px / 10.16 × 15.24 cm) Postcard Size Photograph strictly between 10 KB and 200 KB with Candidate Name & Date of Photo (DOP) and pure white background.',
  popularFor: ['NEET UG Online Application', 'NEET Admit Card Proforma', 'JEE Main & Advanced', 'Medical Counselling (MCC)'],
  documents: [
    {
      id: 'photo',
      title: '4" × 6" Postcard Photo (with Name & Date)',
      minKb: 10,
      maxKb: 200,
      recommendedKb: 95,
      widthPx: 1200,
      heightPx: 1800,
      widthCm: 10.16,
      heightCm: 15.24,
      aspectRatioLabel: '4" × 6" Inches (1200 × 1800 px, 2:3 ratio)',
      allowedFormats: ['image/jpeg', 'image/jpg'],
      requiresNameDate: true,
      backgroundRequirement: 'Pure white background with 80% face coverage',
      instructions: [
        'Mandatory for NTA NEET UG online form and admit card proforma.',
        'Candidate Name and Date of taking photograph (DOP) printed clearly at the bottom.',
        'Both ears visible, no mask or cap, pure white background.',
        'File size strictly between 10 KB and 200 KB in JPG format.',
      ],
    },
    {
      id: 'passport',
      title: 'Matching 3.5×4.5 cm Passport Photo',
      minKb: 10,
      maxKb: 200,
      recommendedKb: 50,
      widthPx: 350,
      heightPx: 450,
      widthCm: 3.5,
      heightCm: 4.5,
      aspectRatioLabel: '3.5 cm × 4.5 cm (350 × 450 px)',
      allowedFormats: ['image/jpeg', 'image/jpg'],
      requiresNameDate: true,
      backgroundRequirement: 'Pure white background matching postcard photo',
      instructions: [
        'NTA requires the Passport Photo and Postcard Photo to be taken from the exact same picture.',
        'Download the 4×6 Postcard photo first, then switch to this tab to download the matching Passport photo!',
      ],
    },
  ],
  generalGuidelines: [
    'Use the exact same photo for both your 4x6 Postcard upload and your 3.5x4.5cm Passport upload.',
  ],
  faqs: [],
};

export default function PostcardSizePhotoMakerPage() {
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
          <span className="text-gray-800 font-semibold">4×6 Postcard Size Photo Maker</span>
        </nav>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2.5 py-0.5 rounded">
              4&quot; × 6&quot; Inches • 1200×1800 px • 300 DPI
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              NTA NEET UG Compliant (10KB–200KB)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Postcard Size Photo Maker Online (4×6 Inch for NEET &amp; JEE)
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Convert any phone or studio photo into an official <strong>4×6 inch (1200×1800 pixels)</strong> postcard size photograph between <strong>10 KB and 200 KB</strong>. Includes 1-click <strong>Candidate Name &amp; Date (DOP)</strong> stamping and AI White Background conversion.
          </p>
        </div>

        <ExamPhotoResizer exam={POSTCARD_PRESET} initialDocId="photo" />

        <ToolSeoContent
          title="Postcard Size Photo Maker (4x6 Inch)"
          subtitle="1200 × 1800 Pixels (300 DPI) | 10 KB – 200 KB | Automatic Name & Date Stamp"
          description="The National Testing Agency (NTA) requires NEET UG candidates to upload both a standard passport size photograph and a 4×6 inch Postcard Size Photograph (10.16 cm × 15.24 cm) taken against a pure white background with the candidate's name and date of photography printed at the bottom. SizeSnap lets you generate both the 4×6 postcard photo and the matching 3.5×4.5 cm passport photo from a single image in seconds."
          howToSteps={[
            'Upload your front-facing photograph into the 4×6 Postcard Photo workspace above.',
            'Type your full Candidate Name and Date of Photo (DOP) to display on the bottom white strip.',
            'If your wall background is not white, click "Make Background White (AI 1-Click)".',
            'Download your 4×6 Postcard JPEG (~95 KB), then click the "Matching 3.5×4.5 cm Passport Photo" tab to download your passport copy.',
          ]}
          table={{
            caption: 'Postcard Size vs Passport Size Photo Dimensions Comparison',
            headers: ['Specification', 'Postcard Size Photo (NEET)', 'Passport Size Photo (Standard)'],
            rows: [
              ['Size in Inches', '4.0 × 6.0 inches', '1.38 × 1.77 inches'],
              ['Size in Centimeters', '10.16 × 15.24 cm', '3.5 × 4.5 cm'],
              ['Resolution at 300 DPI', '1200 × 1800 pixels', '350 × 450 pixels (or 413 × 531 px)'],
              ['NTA Allowed KB Range', '10 KB to 200 KB (JPG)', '10 KB to 200 KB (JPG)'],
              ['Name & Date (DOP) Strip', 'Mandatory at bottom', 'Mandatory at bottom'],
            ],
          }}
          features={[
            {
              title: 'Exact 4×6 Inch (1200×1800 px) Canvas',
              desc: 'Generates true 2:3 postcard aspect ratio at 300 DPI so printed 4×6 copies for NEET admit card proforma are crystal clear.',
            },
            {
              title: 'Matching Passport + Postcard Pair',
              desc: 'Switch tabs to download both the 4×6 postcard and 3.5×4.5cm passport photo from the same upload.',
            },
            {
              title: 'Automatic Name & Date Bar',
              desc: 'Draws a clean white strip at the bottom with bold uppercase Name and DOP.',
            },
            {
              title: '1-Click AI White Background',
              desc: 'Replaces bedroom or outdoor backgrounds with pure studio white right in your browser.',
            },
          ]}
          faqs={[
            {
              question: 'What is postcard size photo in pixels and cm for NEET?',
              answer: 'A postcard size photo is 4 inches wide by 6 inches high (10.16 cm × 15.24 cm). At 300 DPI print resolution, that equals 1200 × 1800 pixels. For NEET UG, the file size must be between 10 KB and 200 KB in JPG format.',
            },
            {
              question: 'Should the passport size and postcard size photo be the same in NEET?',
              answer: 'Yes! NTA instructions state that both the passport photo and the 4×6 postcard photo must be clicked from the same photograph so facial verification matches on exam day.',
            },
          ]}
          keywords={[
            'postcard size photo maker',
            '4x6 inch photo converter online',
            'neet postcard size photo resizer',
            'postcard size photo in pixels',
            'convert passport photo to postcard size 4x6',
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}

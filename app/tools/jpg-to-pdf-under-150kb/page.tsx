import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JpgToPdfUnderKbPage } from '@/components/templates/JpgToPdfUnderKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JPG to PDF Under 150 KB - Convert Image to PDF Below 150KB Free | SizeSnap',
  description:
    'Convert JPG, JPEG & PNG to PDF strictly under 150 KB online for free without blur. Ideal for state board admissions, marksheet uploads & government jobs.',
  keywords: [
    'jpg to pdf under 150 kb',
    'jpg to pdf under 150kb',
    'jpeg to pdf under 150 kb',
    'convert jpg to pdf under 150 kb',
    'jpg to pdf 150 kb',
    'convert image to pdf under 150kb',
    'photo to pdf 150 kb',
    'image to pdf 150 kb online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-150kb',
  },
  openGraph: {
    title: 'JPG to PDF Under 150 KB - Free Image to PDF Converter | SizeSnap',
    description:
      'Convert JPG/JPEG images and scanned certificates to PDF under 150 KB with 100% browser-based security.',
    url: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-150kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'image-to-pdf',
  'compress-pdf',
  'document-scanner',
  'crop-image',
  'compress-image',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How to convert JPG to PDF under 150 KB online for free?',
    a: 'Upload your JPG, JPEG, or PNG certificate photo into SizeSnap. Target size is preset to under 150 KB. Click "Convert to PDF" and download your lightweight PDF in seconds.',
  },
  {
    q: 'JPG photo ko PDF me 150 KB se kam kaise banayein (150KB से कम PDF कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya document select karein. Tool automatically file size ko 150 KB ke andar optimize karega bina text quality kharab kiye. "Convert to PDF" par click karke turant download karein.',
  },
  {
    q: 'Will my marksheet details remain legible under 150 KB?',
    a: 'Yes! SizeSnap protects sharp typographic details including marks, roll numbers, board seals, and signatures, while eliminating unneeded metadata.',
  },
  {
    q: 'Is my data secure?',
    a: '100% secure. Everything runs locally in your browser. No files are uploaded to any server or third-party storage.',
  },
];

export default function JpgToPdfUnder150KbPage() {
  return (
    <JpgToPdfUnderKbPage
      targetKb={150}
      title="Convert JPG to PDF Under 150 KB Online Free"
      description="Convert your JPG, JPEG, and PNG images into an official PDF document strictly under 150 KB. Ideal for educational certificates, marksheet verification, and online application portals."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'PDF Tools', url: '/category/pdf' },
        { name: 'JPG to PDF Under 150 KB', url: '/tools/jpg-to-pdf-under-150kb' },
      ]}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            Convert Scanned Documents to PDF Under 150 KB
          </h2>
          <p>
            When applying for state board examinations, recruitment notices, or apprentice programs,
            certain portals mandate PDF documents strictly under <strong className="text-blue-700">150 KB</strong>.
          </p>
          <p>
            SizeSnap delivers an ideal balance: crisp resolution for 300 DPI scanned documents while keeping
            the total payload between 110 KB and 145 KB, safely avoiding portal rejection.
          </p>
        </div>
      }
    />
  );
}

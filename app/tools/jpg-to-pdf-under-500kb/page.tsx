import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JpgToPdfUnderKbPage } from '@/components/templates/JpgToPdfUnderKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JPG to PDF Under 500 KB - Convert Image to PDF Below 500KB Free | SizeSnap',
  description:
    'Convert JPG, JPEG & PNG photos or multi-page documents to PDF under 500 KB online for free. Ideal for Passport Seva, EPFO PF claim, IT returns & court e-filing.',
  keywords: [
    'jpg to pdf under 500 kb',
    'jpg to pdf under 500kb',
    'jpeg to pdf under 500 kb',
    'convert jpg to pdf under 500 kb',
    'jpg to pdf 500 kb',
    'image to pdf under 500 kb',
    'passport seva jpg to pdf 500 kb',
    'epfo claim passbook pdf under 500kb',
    'convert image to pdf under 500kb',
    'income tax document pdf under 500 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-500kb',
  },
  openGraph: {
    title: 'JPG to PDF Under 500 KB - Free Image to PDF Converter | SizeSnap',
    description:
      'Convert JPG/JPEG images and multi-page documents to PDF under 500 KB with 100% browser-based security. Ideal for Passport Seva & EPFO portals.',
    url: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-500kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'jpg-to-pdf-under-200kb',
  'jpg-to-pdf-under-150kb',
  'jpg-to-pdf-under-100kb',
  'compress-pdf-300kb',
  'compress-pdf-140kb',
  'document-scanner',
];

const FAQS = [
  {
    q: 'How do I convert JPG images to a single PDF under 500 KB?',
    a: 'Drag and drop your JPG or PNG files into the converter. Target size is preset to under 500 KB. Click "Convert to PDF" and instantly download your combined, high-definition PDF.',
  },
  {
    q: 'JPG photo ko PDF me 500 KB se kam kaise banayein (500KB से कम PDF कैसे बनाएं)?',
    a: 'SizeSnap par apni files ya documents upload karein. "Under 500 KB" option active rehta hai. "Convert to PDF" click karein aur aapka PDF turant 400KB - 490KB ke perfect size me download ho jayega.',
  },
  {
    q: 'Can I combine multiple pages (like 3 to 5 semester marksheets) under 500 KB?',
    a: 'Yes! SizeSnap is specifically designed for multi-page documents. It distributes file weight proportionally across all uploaded pages to ensure the total PDF size stays safely below 500 KB.',
  },
  {
    q: 'Which portals require PDF files under 500 KB?',
    a: 'Passport Seva Kendra (passport application document upload), EPFO Member Portal (PF withdrawal, passbook, and cancelled cheque upload), Income Tax e-filing portal (annexures and grievance attachments), and e-Courts district filing portals.',
  },
  {
    q: 'Does reducing the file to 500 KB affect print clarity?',
    a: 'Not at all. 500 KB offers an ample data budget for 1 to 4 pages. Text, numbers, stamps, and watermarks remain completely sharp and clear when printed on standard A4 paper.',
  },
  {
    q: 'Are my financial or identity documents safe on SizeSnap?',
    a: 'Absolutely. SizeSnap runs completely client-side in your browser. Neither your bank passbook, salary slips, nor identity proofs are ever uploaded to any cloud server.',
  },
];

export default function JpgToPdfUnder500KbPage() {
  return (
    <JpgToPdfUnderKbPage
      targetKb={500}
      title="Convert JPG to PDF Under 500 KB Online Free"
      description="Convert single or multi-page JPG, JPEG, and PNG images into a clean PDF strictly under 500 KB. Optimized for Passport Seva Kendra, EPFO PF claims, Income Tax returns, and court filing submissions."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'PDF Tools', url: '/category/pdf' },
        { name: 'JPG to PDF Under 500 KB', url: '/tools/jpg-to-pdf-under-500kb' },
      ]}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            Why 500 KB is the Ideal Threshold for Multi-Page Official PDF Submissions
          </h2>
          <p>
            Several major portals accommodate larger document packages—such as multiple-page marksheets,
            bank passbooks with transaction history, or multi-page court petitions—setting their upper file boundary
            at <strong className="text-blue-700">500 KB (0.5 MB)</strong>.
          </p>
          <p>
            When scanning 3 or 4 pages with modern scanners or mobile scanning apps, the uncompressed PDF often swells
            to 10 MB – 25 MB. Attempting to upload triggers validation failures like{' '}
            <span className="font-mono text-xs bg-red-50 text-red-600 px-1 py-0.5 rounded border border-red-200">
              &quot;Uploaded document exceeds the allowable limit of 500 KB&quot;
            </span>.
            SizeSnap rebalances the document&apos;s internal image compression matrices to keep all pages crisp, legible, and safely under 500 KB.
          </p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">
            Key Portals Requiring Under 500 KB PDF Files:
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>Passport Seva (Ministry of External Affairs):</strong> Proof of date of birth, address verification, and spouse/parent passport copies.
            </li>
            <li>
              <strong>EPFO Unified Member Portal:</strong> Uploading attested bank passbook copy or cancelled cheque for online PF advance / final settlement claim.
            </li>
            <li>
              <strong>Income Tax Department (e-Filing):</strong> Submitting audited balance sheet schedules, Form 10E documentation, and appeal annexures.
            </li>
            <li>
              <strong>e-Courts & Legal Portals:</strong> Vakalatnama, petition affidavits, and indexed supporting documents.
            </li>
          </ul>
        </div>
      }
    />
  );
}

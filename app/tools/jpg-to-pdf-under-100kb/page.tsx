import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JpgToPdfUnderKbPage } from '@/components/templates/JpgToPdfUnderKbPage';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JPG to PDF Under 100 KB - Convert Image to PDF Below 100KB Free | SizeSnap',
  description:
    'Convert JPG, JPEG & PNG to PDF strictly under 100 KB online for free without blur. Perfect for scholarship forms, admission portals, state KYC & job forms.',
  keywords: [
    'jpg to pdf under 100 kb',
    'jpg to pdf under 100kb',
    'jpeg to pdf under 100 kb',
    'convert jpg to pdf under 100 kb',
    'jpg to pdf 100 kb',
    'convert image to pdf under 100kb',
    'photo to pdf 100 kb',
    'image to pdf 100 kb online',
    'scholarship pdf under 100 kb',
    'nsp scholarship marksheet pdf 100kb',
    'income certificate pdf under 100 kb',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-100kb',
  },
  openGraph: {
    title: 'JPG to PDF Under 100 KB - Free Image to PDF Converter | SizeSnap',
    description:
      'Convert JPG/JPEG images and scanned certificates to PDF under 100 KB with 100% browser-based security. Ideal for NSP scholarship & admission forms.',
    url: 'https://www.sizesnap.in/tools/jpg-to-pdf-under-100kb',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'jpg-to-pdf-under-150kb',
  'jpg-to-pdf-under-200kb',
  'jpg-to-pdf-under-500kb',
  'compress-pdf-140kb',
  'compress-pdf-300kb',
  'document-scanner',
];

const FAQS = [
  {
    q: 'How do I convert a JPG to a PDF under 100 KB?',
    a: 'Upload your photo, marksheet, or scanned certificate to SizeSnap. The tool is pre-configured with a 100 KB maximum file limit. Click "Convert to PDF" and instantly download your document, guaranteed to be under 100 KB.',
  },
  {
    q: 'JPG photo ko PDF me 100 KB se kam kaise banayein (100KB से कम PDF कैसे बनाएं)?',
    a: 'SizeSnap par apni photo ya document upload karein. Target size "Under 100 KB" select kiya hua hai. "Convert to PDF" par click karte hi browser ke andar hi aapka file 70KB - 95KB ke crisp PDF me convert ho jayega.',
  },
  {
    q: 'Will my scanned certificate text and signature still be clear at 100 KB?',
    a: 'Yes. SizeSnap uses high-efficiency JPEG compression algorithms within the PDF container that preserve high-contrast text, candidate roll numbers, signatures, and university seals while filtering out invisible noise.',
  },
  {
    q: 'Which portals require PDF files strictly under 100 KB?',
    a: 'National Scholarship Portal (NSP), UP Scholarship, MahaDBT, state university admissions, banking KYC document uploads, and state recruitment portals (like WBPSC, Odisha OSSC, Assam APSC) frequently enforce a 100 KB maximum cap for PDF attachments.',
  },
  {
    q: 'Can I convert multiple pages into a PDF under 100 KB?',
    a: 'Yes. SizeSnap will budget file size across all included pages so that the final compiled PDF remains under the strict 100 KB threshold.',
  },
  {
    q: 'Is my data safe and private?',
    a: 'Completely. Processing happens locally on your computer or phone using client-side Web APIs. No documents or personal details are uploaded to any server.',
  },
];

export default function JpgToPdfUnder100KbPage() {
  return (
    <JpgToPdfUnderKbPage
      targetKb={100}
      title="Convert JPG to PDF Under 100 KB Online Free"
      description="Convert your JPG, JPEG, and PNG images into a compact PDF document strictly under 100 KB. Optimized for National Scholarship Portal (NSP), college admissions, and government verification forms."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'PDF Tools', url: '/category/pdf' },
        { name: 'JPG to PDF Under 100 KB', url: '/tools/jpg-to-pdf-under-100kb' },
      ]}
      relatedSlugs={RELATED_SLUGS}
      faqs={FAQS}
      articleHtml={
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
            How to Convert Images to PDF Below 100 KB Without Losing Legibility
          </h2>
          <p>
            When applying for higher education scholarships (such as the Central Sector Scheme on the National Scholarship Portal,
            State E-Kalyan, or Pre/Post-Matric scholarships), candidate attachments must comply with strict server limits:
            typically <strong className="text-red-600">&quot;Uploaded PDF must be less than 100 KB&quot;</strong>.
          </p>
          <p>
            Scanned marksheets or mobile camera snapshots often occupy 2 MB to 5 MB. Converting them without proper size control
            leads to server rejection messages like <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">&quot;File size exceeds permitted 100KB&quot;</span>.
            SizeSnap automatically calculates the exact compression ratio required to deliver high readability within an 80 KB – 98 KB footprint.
          </p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">
            Common Use Cases for Under 100 KB PDF Files:
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>Scholarship Portals (NSP, UP Scholarship, MahaDBT):</strong> Income certificate, caste certificate, fee receipt, and previous year marksheet.
            </li>
            <li>
              <strong>College & University Admissions (Delhi University, Mumbai University, AKTU):</strong> Class 10th and 12th passing certificates.
            </li>
            <li>
              <strong>Banking & Financial KYC:</strong> Address proof (electricity bill, rent agreement) and cancelled cheque upload for online bank accounts.
            </li>
            <li>
              <strong>State Government Recruitment:</strong> Resident / domicile certificates for state police and clerical exams.
            </li>
          </ul>

          <h3 className="text-sm font-bold text-gray-900 pt-2">
            Why Use SizeSnap&apos;s Under 100 KB PDF Converter?
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Guaranteed File Size:</strong> The PDF output never crosses 100 KB.</li>
            <li><strong>Zero Upload Privacy:</strong> 100% processed on your device, preventing data leaks of sensitive identity documents.</li>
            <li><strong>Zero Watermark:</strong> Generates clean, official PDF documents ready for immediate submission.</li>
          </ul>
        </div>
      }
    />
  );
}

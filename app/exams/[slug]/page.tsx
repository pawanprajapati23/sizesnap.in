import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EXAM_PRESETS, getExamBySlug } from '@/data/exam-presets';
import { ExamPhotoResizer } from '@/components/tool-ui/ExamPhotoResizer';
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
} from 'lucide-react';
import { HindiExamGuide } from '@/components/HindiExamGuides';

interface ExamPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return EXAM_PRESETS.map((exam) => ({
    slug: exam.slug,
  }));
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExamBySlug(slug);

  if (!exam) {
    return {
      title: 'Exam Resizer Not Found | SizeSnap',
    };
  }

  return {
    title: exam.metaTitle,
    description: exam.metaDescription,
    alternates: {
      canonical: `https://sizesnap.in/exams/${exam.slug}`,
    },
    openGraph: {
      title: exam.metaTitle,
      description: exam.metaDescription,
      url: `https://sizesnap.in/exams/${exam.slug}`,
      type: 'website',
    },
  };
}

export default async function DedicatedExamPage({ params }: ExamPageProps) {
  const { slug } = await params;
  const exam = getExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  // Schema.org FAQ and Tool Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: exam.name,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        description: exam.metaDescription,
      },
      {
        '@type': 'FAQPage',
        mainEntity: exam.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  const otherExams = EXAM_PRESETS.filter((e) => e.slug !== exam.slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/exams" className="hover:text-[#414FA8] font-medium transition-colors">
            Govt Exams
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">{exam.shortTitle}</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content Area (8/9 cols) */}
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2.5 py-0.5 rounded">
                  {exam.authority}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {exam.badge}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight">
                {exam.name}
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {exam.summary}
              </p>
            </div>

            {/* Interactive Resizing Engine */}
            <ExamPhotoResizer exam={exam} />

            {/* Official Requirements Breakdown Card */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-[#414FA8]" /> Official Notification Guidelines Checklist
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exam.documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 bg-gray-50 rounded border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                      <span className="font-bold text-gray-900">{doc.title}</span>
                      <span className="font-bold text-[#414FA8] bg-white px-2 py-0.5 rounded border border-gray-200">
                        {doc.minKb} - {doc.maxKb} KB
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 space-y-1">
                      <div>
                        <strong className="text-gray-700">Dimensions:</strong> {doc.widthPx} × {doc.heightPx} px
                        {doc.widthCm ? ` (${doc.widthCm}cm × ${doc.heightCm}cm)` : ''}
                      </div>
                      <div>
                        <strong className="text-gray-700">Background:</strong> {doc.backgroundRequirement}
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 pt-1 text-gray-500">
                        {doc.instructions.slice(0, 2).map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Common Rejection Warning:</span> Ensure that your photo does not contain camera flash reflections on spectacles, tilted head, or dark colored background. SizeSnap strictly outputs high-quality JPEG files under the maximum threshold.
                </div>
              </div>
            </div>

            {/* Custom Hindi/Hinglish Deep Content Guides */}
            <HindiExamGuide slug={slug} />

            {/* FAQs */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#414FA8]" /> Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {exam.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1">
                    <h3 className="text-xs font-bold text-gray-900">{faq.q}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar (4/3 cols) */}
          <aside className="w-full lg:col-span-4 xl:col-span-3 space-y-4">
            {/* Quick Actions Card */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[#414FA8]">
                Recruitment Board
              </h3>
              <p className="text-xs text-gray-600">
                {exam.authority}
              </p>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1.5">
                <div className="font-semibold text-gray-800">Popular Post Categories:</div>
                <div className="flex flex-wrap gap-1">
                  {exam.popularFor.map((item, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Exams Links */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-900 flex items-center justify-between">
                <span>Other Govt Exam Resizers</span>
                <Link href="/exams" className="text-[10px] text-[#414FA8] font-normal hover:underline">
                  View All
                </Link>
              </h3>
              <div className="space-y-1.5">
                {otherExams.map((other) => (
                  <Link
                    key={other.id}
                    href={`/exams/${other.slug}`}
                    className="p-2 rounded bg-gray-50 hover:bg-[#EEF1FB] hover:text-[#414FA8] text-xs font-medium text-gray-700 flex items-center justify-between transition-colors group"
                  >
                    <span>{other.shortTitle}</span>
                    <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-[#414FA8] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-600 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Private &amp; Secure</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-500">
                Your photograph and signature are rendered directly inside your web browser. No files are uploaded to any external server.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

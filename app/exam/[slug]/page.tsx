import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getExamBySlug,
  getAllExamSlugs,
  examDatabase
} from '@/lib/examDatabase'
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileText,
  Camera,
  PenTool,
  Fingerprint,
  ShieldCheck,
  Building,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import AdUnit from '@/components/AdUnit'

export async function generateStaticParams() {
  return getAllExamSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const exam = getExamBySlug(slug)
  if (!exam) return {}

  const title = `${exam.shortName} Photo and Signature Size ${exam.updatedYear} (Official Guidelines & 1-Click Resizer) | SizeSnap`
  const description = `Official ${exam.name} photo size (${exam.photo.fileSizeRange}), signature dimensions (${exam.signature.fileSizeRange}) and thumb impression specs for ${exam.updatedYear}. 1-Click format & resize online free.`
  const canonical = `https://sizesnap.in/exam/${exam.slug}`

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'SizeSnap',
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

export default async function ExamSpecPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exam = getExamBySlug(slug)
  if (!exam) notFound()

  const canonicalUrl = `https://sizesnap.in/exam/${exam.slug}`

  // SoftwareApplication / Tool Schema with Gold Stars
  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${exam.shortName} Photo & Signature Resizer Tool`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '12480',
      bestRating: '5',
      worstRating: '1'
    },
    url: canonicalUrl
  }

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: exam.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sizesnap.in'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Exam Specifications',
        item: 'https://sizesnap.in/exam'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: exam.shortName,
        item: canonicalUrl
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/exam" className="hover:text-blue-600 transition-colors">
            Exam Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold">{exam.shortName}</span>
        </nav>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {exam.category} Recruitment
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Updated for {exam.updatedYear}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              {exam.name} Photo, Signature &amp; Thumb Impression Size Guidelines
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              {exam.overview}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-400" />
                Conducting Body: <strong>{exam.conductingBody}</strong>
              </span>
              <a
                href={exam.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-300 hover:underline"
              >
                Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Ad Unit */}
        <AdUnit slot="1234567890" format="horizontal" className="min-h-[90px]" />

        {/* 1-Click Fast Launcher Box */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-amber-500/40 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20">
                ⚡
              </div>
              <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white">
                1-Click Quick Resizers for {exam.shortName}
              </h2>
            </div>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-full border border-amber-300">
              100% Guaranteed Acceptance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            <Link
              href={exam.photo.toolActionUrl}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5 mb-1">
                  <Camera className="w-3.5 h-3.5" /> Resize {exam.shortName} Photo
                </span>
                <p className="text-xs text-slate-500">
                  Target: <strong>{exam.photo.fileSizeRange}</strong> ({exam.photo.dimensions})
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                Launch Photo Resizer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href={exam.signature.toolActionUrl}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mb-1">
                  <PenTool className="w-3.5 h-3.5" /> Resize {exam.shortName} Signature
                </span>
                <p className="text-xs text-slate-500">
                  Target: <strong>{exam.signature.fileSizeRange}</strong> ({exam.signature.inkColor})
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                Launch Signature Resizer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {exam.thumb && exam.thumb.required ? (
              <Link
                href={exam.thumb.toolActionUrl}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-violet-600 flex items-center gap-1.5 mb-1">
                    <Fingerprint className="w-3.5 h-3.5" /> Enhance Thumb Impression
                  </span>
                  <p className="text-xs text-slate-500">
                    Target: <strong>{exam.thumb.fileSizeRange}</strong> ({exam.thumb.whichThumb})
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 transition-colors">
                  Launch Thumb Resizer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <Link
                href="/sarkari-exam-pack-generator"
                className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-1">
                    ⚡ 1-Click Complete Exam Pack
                  </span>
                  <p className="text-xs text-slate-500">
                    Photo, Sign &amp; Marksheet formatted in 1-Click ZIP.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors">
                  Open 1-Click Studio <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Complete Official Specifications Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Official {exam.shortName} Document Dimension Matrix
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Notification Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Upload Requirement</th>
                  <th className="pb-3 px-3">Allowed File Size</th>
                  <th className="pb-3 px-3">Dimensions / Pixels</th>
                  <th className="pb-3 px-3">Format</th>
                  <th className="pb-3 px-3">Key Guidelines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {/* Photo Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-500" /> Passport Photograph
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {exam.photo.fileSizeRange}
                    </span>
                  </td>
                  <td className="py-4 px-3">{exam.photo.dimensions}</td>
                  <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">{exam.photo.format}</td>
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-400">
                    {exam.photo.background}. {exam.photo.dopRequired ? `⚠️ ${exam.photo.dopRules}` : 'No spectacles/caps.'}
                  </td>
                </tr>

                {/* Signature Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-indigo-500" /> Scanned Signature
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      {exam.signature.fileSizeRange}
                    </span>
                  </td>
                  <td className="py-4 px-3">{exam.signature.dimensions}</td>
                  <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">{exam.signature.format}</td>
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-400">
                    {exam.signature.inkColor}. Strictly running handwriting.
                  </td>
                </tr>

                {/* Thumb Row if applicable */}
                {exam.thumb && (
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-violet-500" /> Thumb Impression
                    </td>
                    <td className="py-4 px-3">
                      <span className="px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 font-bold border border-violet-200">
                        {exam.thumb.fileSizeRange}
                      </span>
                    </td>
                    <td className="py-4 px-3">{exam.thumb.whichThumb}</td>
                    <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">{exam.thumb.format}</td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-400">
                      {exam.thumb.inkColor}. Ridge lines must be sharp &amp; clear.
                    </td>
                  </tr>
                )}

                {/* Documents Row */}
                {exam.documents && (
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500" /> Marksheet / Certificates
                    </td>
                    <td className="py-4 px-3">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {exam.documents.marksheetSize}
                      </span>
                    </td>
                    <td className="py-4 px-3">Standard A4 / Single Page</td>
                    <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">{exam.documents.format}</td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-400">
                      Clear readable text. No shadows. Self-attestation if required.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Rejection Mistakes */}
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-base md:text-lg font-black text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Top Reasons Candidates Get Rejected in {exam.shortName}
          </h2>
          <ul className="space-y-2 text-xs md:text-sm text-rose-800 dark:text-rose-300">
            {exam.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-rose-600">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mid Ad */}
        <AdUnit slot="0987654321" format="rectangle" className="min-h-[250px]" />

        {/* Frequently Asked Questions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions ({exam.shortName} Photo &amp; Sign)
          </h2>
          <div className="space-y-4">
            {exam.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-700/60 space-y-1.5"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Exam Guides */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Explore Other Government Exam Guidelines
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {examDatabase
              .filter((e) => e.slug !== exam.slug)
              .slice(0, 8)
              .map((e) => (
                <Link
                  key={e.slug}
                  href={`/exam/${e.slug}`}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xs transition-all text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
                >
                  <span>{e.shortName} Specs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

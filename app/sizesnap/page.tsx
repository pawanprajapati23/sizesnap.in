import { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Zap, ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SizeSnap — Free Online Image & PDF Resizer (Official) | SizeSnap.in',
  description: 'Welcome to SizeSnap, the official free image and PDF resizer. Compress PDFs, resize photos under 50KB, and crop signature scans locally in your browser. 100% private.',
  alternates: {
    canonical: 'https://sizesnap.in/sizesnap',
  }
}

export default function SizeSnapBrandPage() {
  const brandFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I need to login or pay to use SizeSnap?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Not at all. SizeSnap is a 100% free online tool suite. There are no paywalls, registration steps, or hidden subscription charges. You can compress and download unlimited files without logging in.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are my documents safe on SizeSnap servers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SizeSnap runs entirely on 100% client-side technology. This means your personal marksheets, ID scans, or photos are never uploaded to our servers. All file processing happens locally in your device\'s browser.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can mobile users run SizeSnap tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can access sizesnap.in directly from your Android or iPhone device via Chrome or Safari. Simply select a tool from the homepage, tap upload to select your file, and download the processed result instantly.'
        }
      }
    ]
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'SizeSnap',
    'url': 'https://sizesnap.in/sizesnap',
    'applicationCategory': 'UtilityApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      
      <div className="max-w-4xl mx-auto py-10 px-4 md:px-0 space-y-10">
        
        {/* Brand Banner */}
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-lg text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider uppercase">
            <span>Official Brand Page</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            SizeSnap: Free Online Image & PDF Tools
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to the official hub of SizeSnap.in. We offer zero-cost, private client-side utilities to optimize, resize, and compress your official documents.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-500 transition font-semibold text-sm">
              <Home className="h-4 w-4" /> Go to Homepage
            </Link>
          </div>
        </section>

        {/* Core Tool Links Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Upload your file and fix instantly using our core tools:</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/passport-size-photo-maker" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">🛂</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                Passport Photo Maker <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Make standard 3.5 x 4.5 cm passport size photos online for job forms.</p>
            </Link>
            <Link href="/pdf-under-500kb" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">📄</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                PDF Under 500KB <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Compress heavy scanned PDF marksheets and certificate files below 500KB.</p>
            </Link>
            <Link href="/11kb-converter" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">🖼️</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                11KB Image Converter <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Resize signature scans and photos to exactly under 11KB limit.</p>
            </Link>
          </div>
        </section>

        {/* Additional Tool Links Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Explore more categories:</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/image-to-pdf/convert" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">📑</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                JPG to PDF Converter <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Combine multiple images into a single PDF document securely.</p>
            </Link>
            <Link href="/convert-image/to-webp" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">🔄</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                Image Format Converter <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Convert between JPG, PNG, and WebP formats instantly.</p>
            </Link>
            <Link href="/document-scanner/bw-filter" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">📱</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                Online Document Scanner <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Apply black and white high-contrast filters to your scanned documents.</p>
            </Link>
          </div>
        </section>

        {/* Content Block */}
        <section className="prose prose-blue max-w-none bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">What is SizeSnap? (The Problem & Solution)</h2>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Many online application forms such as SSC, NEET, UPSC, banking (IBPS), and college admissions portals enforce strict file size limits for uploaded documents. Standard photos taken on mobile cameras typically range from 2MB to 10MB. Manual resizing often requires complex software and can result in significant quality degradation if not done properly.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              <strong>SizeSnap</strong> solves this standard workflow issue with a seamless interface. We offer dynamic, target-based compressors and resizers that accurately configure your custom file size requirements (such as images under 50KB or PDFs below 500KB) without unnecessarily reducing visual clarity. <strong>Upload your file and fix it instantly</strong>.
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Use Cases for SizeSnap Core Tools</h2>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Our digital utility converters are designed primarily to assist candidates with the following common challenges:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 mt-2 space-y-1">
              <li><strong>Government Forms (SSC CGL, CHSL, Railway):</strong> Resizing signatures strictly to the 10KB to 20KB range and ensuring photos match physical dimension presets (3.5x4.5 cm).</li>
              <li><strong>National Level Entrance Exams (NEET, JEE Mains):</strong> Meeting the 100KB or 200KB upload constraints for admit card photos and ID proofs.</li>
              <li><strong>Document Transcripts:</strong> Compiling multiple certificate transcripts and compressing the merged PDF format below 500KB.</li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-2xl font-bold text-gray-900">100% Private Browser-Side Technology</h2>
            <p className="text-sm text-gray-600 leading-relaxed mt-2 flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                Privacy is our absolute priority. Unlike other online tools, SizeSnap never transfers or saves copies of your files to our servers. All processing runs directly in your browser using WebAssembly and Canvas APIs, ensuring 100% local execution and absolute data security.
              </span>
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Frequently Asked Questions (FAQs)
          </h2>
          <div className="space-y-4">
            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                <span>Do I need to login or pay to use SizeSnap?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
                Not at all. SizeSnap is a 100% free online tool suite. There are no paywalls, registration steps, or hidden subscription charges. You can compress and download unlimited files without logging in.
              </p>
            </details>
            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                <span>Are my documents safe on SizeSnap servers?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
                SizeSnap runs entirely on 100% client-side technology. This means your personal marksheets, ID scans, or photos are never uploaded to our servers. All file processing happens locally in your device&apos;s browser.
              </p>
            </details>
            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                <span>How can mobile users run SizeSnap tools?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
                You can access sizesnap.in directly from your Android or iPhone device via Chrome or Safari. Simply select a tool from the homepage, tap upload to select your file, and download the processed result instantly.
              </p>
            </details>
          </div>
        </section>

      </div>
    </>
  )
}

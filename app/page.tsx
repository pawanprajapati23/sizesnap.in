import Link from 'next/link'
import AdUnit from '@/components/AdUnit'
import HomeSearch from '@/components/HomeSearch'
import ExamPresetCalculator from '@/components/ExamPresetCalculator'
import ProStudioSection from '@/components/ProStudioSection'
import ExamRuleFinder from '@/components/ExamRuleFinder'
import ViralShareWidget from '@/components/ViralShareWidget'
import { stories } from '@/lib/storyConfigs'
import { blogs } from '@/lib/blogConfigs'
import type { Metadata } from 'next'
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Zap,
  Upload,
  Download,
  Image as ImageIcon,
  FileText,
  Fingerprint,
  ChevronDown,
  Clock
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'SizeSnap — Free Online Image & PDF Tools | Resize, Compress, Convert',
  description: 'SizeSnap offers free online tools to resize images, compress PDFs, create passport photos, and more. No signup required. Works on mobile. 100% private — files stay on your device.',
  metadataBase: new URL('https://sizesnap.in'),
  alternates: { canonical: 'https://sizesnap.in' },
  openGraph: {
    title: 'SizeSnap — Free Online Image & PDF Tools | Resize, Compress, Convert',
    description: 'Free online tools to resize images, compress PDFs, create passport photos. No signup. 100% private.',
    url: 'https://sizesnap.in',
    type: 'website',
  }
}

export default function HomePage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'SizeSnap',
    'url': 'https://sizesnap.in',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://sizesnap.in/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: "Is SizeSnap safe to use for sensitive documents like Aadhaar or Passport photos?", acceptedAnswer: { '@type': 'Answer', text: "Yes, absolutely. Unlike other online compressors, SizeSnap is 100% client-side. All processing happens locally on your device within your browser. Your images and documents are never uploaded to any external server, ensuring complete privacy." } },
      { '@type': 'Question', name: "How does SizeSnap resize images under 50KB or 100KB without making them blurry?", acceptedAnswer: { '@type': 'Answer', text: "SizeSnap uses smart resizing algorithms (like canvas interpolation and quality scaling) to strip metadata and reduce file weight while keeping the face details, text lines, and signatures sharp and readable." } },
      { '@type': 'Question', name: "Is there a limit on how many files I can compress daily?", acceptedAnswer: { '@type': 'Answer', text: "No. SizeSnap is completely free to use. Since all operations run locally on your device, we don't have heavy server bandwidth costs, allowing us to keep it unlimited, ad-supported, and free from signups." } },
      { '@type': 'Question', name: "Does this tool work on mobile phones?", acceptedAnswer: { '@type': 'Answer', text: "Yes. SizeSnap is fully responsive and optimized to run on all modern mobile browsers (Chrome, Safari, Firefox) on both Android and iOS devices." } }
    ]
  }

  const appSchema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    'name': 'SizeSnap Image & PDF Tools', 'operatingSystem': 'All',
    'applicationCategory': 'UtilitiesApplication',
    'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '9560' },
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'url': 'https://sizesnap.in'
  }

  const quickTools = [
    { label: 'Photo 14KB',     sublabel: 'SSC · IBPS',          href: '/resize-image/to-14kb',          emoji: '📸' },
    { label: 'Photo 12KB',     sublabel: 'Railway · Police',    href: '/resize-image/to-12kb',          emoji: '🖼️' },
    { label: 'Compress PDF',   sublabel: 'Any KB limit',        href: '/compress-pdf-to-100kb',         emoji: '📄' },
    { label: 'Passport Photo', sublabel: '35x45mm standard',   href: '/passport-size-photo-maker',     emoji: '🪪' },
    { label: 'Signature 20KB', sublabel: 'Form ready',          href: '/signature-resize/20kb',         emoji: '✍️' },
    { label: 'Remove Shadow',  sublabel: 'Doc scanner fix',     href: '/remove-shadow-from-document',   emoji: '✨' },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      
      <div className="space-y-16 sm:space-y-24 pb-16">

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 text-center px-4 rounded-3xl bg-white border border-slate-200/60 shadow-sm overflow-hidden mt-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05),transparent_50%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-7 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 mx-auto">
              <ShieldCheck className="h-4 w-4" />
              Your file is processed in your browser
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Resize. Compress. Convert.<br className="hidden md:block"/>
              <span className="text-blue-600">Ready for your form.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Free online tools for images, PDFs and document preparation. Resize photos and signatures to the exact required format and size.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tools" className="btn-primary w-full sm:w-auto text-base px-8 py-3.5">
                Try a Tool
              </Link>
              <Link href="/compress-pdf-to-100kb" className="btn-secondary w-full sm:w-auto text-base px-8 py-3.5">
                Compress PDF
              </Link>
            </div>
          </div>
        </section>

        {/* ─── QUICK TASKS ──────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">What do you want to do?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="card p-5 flex flex-col items-center text-center gap-3 hover:border-blue-300 hover:shadow-md transition-all group">
                <span className="text-3xl transition-transform group-hover:scale-110">{tool.emoji}</span>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.label}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{tool.sublabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── MAIN TOOL CATEGORIES ─────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">Explore Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ImageIcon, title: 'Image Tools', desc: 'Resize, compress, and edit images', href: '/tools#image-tools' },
              { icon: FileText, title: 'PDF Tools', desc: 'Compress, merge, and protect PDFs', href: '/tools#pdf-tools' },
              { icon: ShieldCheck, title: 'Exam Tools', desc: 'Sarkari form photo preparation', href: '/tools#exam-tools' },
              { icon: Fingerprint, title: 'Cards & OCR', desc: 'Aadhaar, PAN, and text extraction', href: '/tools#cards-ocr' },
            ].map(cat => {
              const Icon = cat.icon
              return (
                <Link key={cat.title} href={cat.href} className="card p-6 hover:border-blue-300 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5">{cat.title}</h3>
                  <p className="text-sm text-slate-500">{cat.desc}</p>
                </Link>
              )
            })}
          </div>
        </section>

        <HomeSearch />
        <ProStudioSection />
        
        {/* ─── GOVERNMENT EXAM / DOCUMENT SECTION ────────────── */}
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Prepare Your Documents for Online Forms</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Resize photos, signatures and documents to the required format and size.</p>
          </div>
          <ExamRuleFinder />
          <ExamPresetCalculator />
        </div>

        {/* ─── PRIVACY / TRUST ──────────────────────────────── */}
        <section className="card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 bg-white">
          <div className="flex-1 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Your files are processed in your browser</h2>
            <p className="text-slate-500 leading-relaxed text-base">
              Unlike other platforms, SizeSnap processes your images and PDFs directly on your device. 
              Your sensitive documents like Aadhaar, PAN, and Passport photos are never uploaded to our servers.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 
                100% Client-side processing
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 
                No uploads to external servers
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 
                No signups or accounts required
              </li>
            </ul>
          </div>
          <div className="shrink-0 flex justify-center w-full md:w-auto">
            <div className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center border-8 border-white shadow-xl relative">
              <div className="absolute inset-0 rounded-full border border-blue-100" />
              <Lock className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─────────────────────────────────── */}
        <section className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200/60">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[2px] bg-slate-200" />
            {[
              { step: '1', title: 'Upload', desc: 'Choose your image or PDF document.', icon: Upload },
              { step: '2', title: 'Customize', desc: 'Set your required size, format or rule.', icon: Zap },
              { step: '3', title: 'Download', desc: 'Get your processed file instantly.', icon: Download },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.step} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:-translate-y-1 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.step}. {item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        <AdUnit slot="homepage-top" format="horizontal" />

        {/* ─── GUIDES & RESOURCES ───────────────────────────── */}
        <section className="space-y-10">
          <h2 className="text-2xl font-bold text-center text-slate-900">Helpful Guides & Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map(blog => {
              const readTime = Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200))
              return (
                <Link key={blog.slug} href={`/blog/${blog.slug}`} className="card p-6 flex flex-col justify-between group hover:border-blue-300 hover:shadow-md transition-all">
                  <div>
                    <div className="text-xs text-slate-500 mb-3 flex items-center gap-2 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{readTime} min read</span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">{blog.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                  </div>
                  <div className="text-sm font-bold text-blue-600 mt-5 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="bg-slate-950 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                Interactive Web Stories
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">Learn visually with Web Stories</h3>
              <p className="mt-3 text-slate-400 text-base max-w-lg">
                Quick, tappable guides on avoiding photo rejections and preparing documents perfectly.
              </p>
            </div>
            <Link href="/stories" className="btn bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 shrink-0 shadow-lg shadow-blue-900/50">
              View All Stories
            </Link>
          </div>
        </section>

        <ViralShareWidget />

        {/* ─── FAQ ──────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }} />
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is SizeSnap safe to use for sensitive documents like Aadhaar or Passport photos?", a: "Yes, absolutely. Unlike other online compressors, SizeSnap is 100% client-side. All processing happens locally on your device within your browser. Your images and documents are never uploaded to any external server, ensuring complete privacy." },
              { q: "How does SizeSnap resize images under 50KB or 100KB without making them blurry?", a: "SizeSnap uses smart resizing algorithms (like canvas interpolation and quality scaling) to strip metadata and reduce file weight while keeping the face details, text lines, and signatures sharp and readable." },
              { q: "Is there a limit on how many files I can compress daily?", a: "No. SizeSnap is completely free to use. Since all operations run locally on your device, we don't have heavy server bandwidth costs, allowing us to keep it unlimited, ad-supported, and free from signups." },
              { q: "Does this tool work on mobile phones?", a: "Yes. SizeSnap is fully responsive and optimized to run on all modern mobile browsers (Chrome, Safari, Firefox) on both Android and iOS devices." }
            ].map((item, idx) => (
              <details key={idx} className="group card bg-white [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-semibold text-slate-900 cursor-pointer p-6 list-none text-base outline-none">
                  <span>{item.q}</span>
                  <span className="transition-transform duration-200 group-open:rotate-180 shrink-0 ml-4">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────── */}
        <section className="text-center py-16 px-6 bg-blue-600 rounded-3xl text-white shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-5">Find the right tool for your file</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto text-base">
              Explore our complete collection of free tools for Sarkari exams, document processing, and formatting.
            </p>
            <Link href="/tools" className="btn bg-white text-blue-600 hover:bg-slate-50 px-10 py-4 text-base shadow-sm">
              Explore All Tools
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}

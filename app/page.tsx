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
  Smartphone,
  Zap,
  Upload,
  Download,
  Star,
  Flame,
  Trophy,
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
    { label: 'Photo 14KB',     sublabel: 'SSC · IBPS · UPSC',  href: '/resize-image/to-14kb',          emoji: '📸', color: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100',     text: 'text-blue-700',    dot: 'bg-blue-500' },
    { label: 'Photo 12KB',     sublabel: 'Railway · Police',    href: '/resize-image/to-12kb',          emoji: '🖼️', color: 'bg-violet-50 border-violet-200 hover:border-violet-400 hover:bg-violet-100', text: 'text-violet-700',  dot: 'bg-violet-500' },
    { label: 'Compress PDF',   sublabel: 'Any KB limit',        href: '/compress-pdf-to-100kb',         emoji: '📄', color: 'bg-rose-50 border-rose-200 hover:border-rose-400 hover:bg-rose-100',     text: 'text-rose-700',    dot: 'bg-rose-500' },
    { label: 'Passport Photo', sublabel: '35x45mm standard',   href: '/passport-size-photo-maker',     emoji: '🪪', color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    { label: 'Signature 20KB', sublabel: 'Form ready',          href: '/signature-resize/20kb',         emoji: '✍️', color: 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
    { label: 'Remove Shadow',  sublabel: 'Doc scanner fix',     href: '/remove-shadow-from-document',   emoji: '✨', color: 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100',   text: 'text-slate-700',   dot: 'bg-slate-500' },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <div className="space-y-8 sm:space-y-10">

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="px-5 py-8 sm:px-8 md:py-14 lg:px-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Files never leave your device
              </div>
              <h1 className="max-w-2xl text-[1.6rem] xs:text-[1.75rem] sm:text-4xl md:text-[2.75rem] font-extrabold leading-[1.18] tracking-tight text-slate-950">
                Sarkari Form ka Photo, Signature &amp; PDF —{' '}
                <span className="text-blue-600">1 click mein ready.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base sm:font-medium">
                SSC, IBPS, Railway, NEET — har exam ke exact size mein photo compress karo. Free, private, aur mobile pe bhi kaam karta hai.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/resize-image/to-50kb" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-6 py-3.5 min-h-[48px] text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all w-full sm:w-auto">
                  <Zap className="h-4 w-4 shrink-0" />
                  Resize Image Now
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
                <Link href="/compress-pdf-to-100kb" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 px-6 py-3.5 min-h-[48px] text-sm font-bold text-slate-700 shadow-sm transition-all w-full sm:w-auto">
                  Compress PDF
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center -space-x-2">
                  {['🧑','👩','👦','👨','🧑'].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-sm shadow-sm">{e}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5"><span className="text-slate-900 font-bold">2 Lakh+</span> students ne use kiya</p>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span><span className="text-slate-900 font-bold">#1</span> Free Sarkari Form Tool</span>
                </div>
              </div>
            </div>
            {/* Right: How it works — desktop only */}
            <div className="hidden lg:flex flex-col justify-center border-l border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 lg:p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">How it works</p>
              <div className="space-y-3">
                {[
                  { step: '1', icon: Upload,   label: 'Upload your file',      sub: 'JPG, PNG, PDF — any format',     color: 'bg-blue-100 text-blue-700' },
                  { step: '2', icon: Zap,      label: 'Pick your target size', sub: 'e.g. 14KB, 50KB, 100KB',         color: 'bg-amber-100 text-amber-700' },
                  { step: '3', icon: Download, label: 'Download instantly',    sub: 'Form-ready. No upload. Private.', color: 'bg-emerald-100 text-emerald-700' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.step} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{item.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{item.sub}</p>
                      </div>
                      <div className="shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400">{item.step}</div>
                    </div>
                  )
                })}
                <div className="flex items-center gap-2 pt-2 px-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-[11px] font-semibold text-slate-500">Zero data leaves your phone/laptop. Ever.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── QUICK ACTION TOOLS ───────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Most Used Today
            </h2>
            <Link href="/tools" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">All Tools →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className={`group relative flex flex-col items-center text-center gap-2 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${tool.color}`}>
                <span className="text-2xl leading-none">{tool.emoji}</span>
                <div>
                  <p className={`text-xs font-bold leading-tight ${tool.text}`}>{tool.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{tool.sublabel}</p>
                </div>
                <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${tool.dot} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            ))}
          </div>
        </section>

        <HomeSearch />
        <ProStudioSection />
        <ExamRuleFinder />
        <ExamPresetCalculator />

        {/* ─── SOCIAL PROOF + TRUST ─────────────────────────── */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1.5">
                {['🇮🇳','🧑','👩','👦'].map((e, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <p className="text-white font-bold text-sm"><span className="text-yellow-300">2,00,000+</span> Indian students trusted SizeSnap for their Sarkari exam forms</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-300 fill-yellow-300" />)}
              <span className="text-white/80 text-xs font-bold ml-1">4.8/5</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
            {[
              { icon: Lock,        title: '100% Private',    desc: 'Files stay inside your browser. Nothing uploaded.',  color: 'text-blue-600' },
              { icon: Zap,         title: 'Instant Results', desc: 'Client-side processing. No server wait.',             color: 'text-amber-600' },
              { icon: Smartphone,  title: 'Mobile First',    desc: 'Works on any Android or iOS browser.',               color: 'text-emerald-600' },
              { icon: ShieldCheck, title: 'No Signup Ever',  desc: 'Open, use, done. No account needed.',                color: 'text-violet-600' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex flex-col items-start gap-2 p-5">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stories Carousel */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              Interactive Web Stories
            </h2>
            <Link href="/stories" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">View All →</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {stories.map(story => (
              <Link key={story.slug} href={`/stories/${story.slug}`} className="flex flex-col items-center gap-2 flex-shrink-0 group focus:outline-none">
                <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 group-hover:rotate-45 transition-transform duration-500 shadow-md">
                  <div className="w-full h-full rounded-full border-[2.5px] border-white overflow-hidden bg-gray-100 relative">
                    <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={64} height={64} />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gray-700 text-center max-w-[80px] line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {story.title.replace('Passport Photo Rejection: ', '').replace('SSC CGL Form ', '')}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit slot="homepage-top" format="horizontal" />

        {/* ─── FEATURED STORY BANNER ────────────────────────── */}
        <section className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-7 sm:p-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                <Flame className="w-3 h-3" />
                Featured Guide
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">Avoid SSC Form<br />Photo Rejection</h2>
              <p className="mt-3 max-w-lg text-slate-400 text-sm leading-relaxed">
                Exact photo rules, size limits aur common mistakes jo aapki application reject kar deti hain — sab kuch ek jagah.
              </p>
            </div>
            <Link href={`/stories/${stories[0].slug}`} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-yellow-400/20 transition-all shrink-0">
              Read Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Latest Guides */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
              Latest Guides &amp; Tutorials
            </h2>
            <Link href="/blog" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Read All Guides →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogs.slice(0, 3).map(blog => {
              const readTime = Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200))
              return (
                <Link key={blog.slug} href={`/blog/${blog.slug}`} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2 font-medium">
                      <span>📅 {new Date(blog.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span>⏱️ {readTime} min read</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">{blog.excerpt}</p>
                  </div>
                  <div className="text-xs font-bold text-blue-600 group-hover:underline mt-4 flex items-center gap-1">Read Guide <span>→</span></div>
                </Link>
              )
            })}
          </div>
        </section>

        <ViralShareWidget />

        {/* ─── FAQ ──────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }} />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-600 animate-pulse" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              { q: "Is SizeSnap safe to use for sensitive documents like Aadhaar or Passport photos?", a: "Yes, absolutely. Unlike other online compressors, SizeSnap is 100% client-side. All processing happens locally on your device within your browser. Your images and documents are never uploaded to any external server, ensuring complete privacy." },
              { q: "How does SizeSnap resize images under 50KB or 100KB without making them blurry?", a: "SizeSnap uses smart resizing algorithms (like canvas interpolation and quality scaling) to strip metadata and reduce file weight while keeping the face details, text lines, and signatures sharp and readable." },
              { q: "Is there a limit on how many files I can compress daily?", a: "No. SizeSnap is completely free to use. Since all operations run locally on your device, we don't have heavy server bandwidth costs, allowing us to keep it unlimited, ad-supported, and free from signups." },
              { q: "Does this tool work on mobile phones?", a: "Yes. SizeSnap is fully responsive and optimized to run on all modern mobile browsers (Chrome, Safari, Firefox) on both Android and iOS devices." }
            ].map((item, idx) => (
              <details key={idx} className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                  <span>{item.q}</span>
                  <span className="transition-transform group-open:rotate-180 shrink-0 ml-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}

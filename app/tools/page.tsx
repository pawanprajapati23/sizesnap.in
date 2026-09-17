'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'
import { Search, ShieldCheck, ArrowRight, X } from 'lucide-react'
import FaqSection from '@/components/FaqSection'

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const faqs = [
    {
      question: 'Are all these tools completely free to use?',
      answer: 'Yes, every single tool listed on SizeSnap is 100% free to use. There are no hidden charges, no premium subscriptions, and no watermarks added to your downloaded files.'
    },
    {
      question: 'Do my files get uploaded to your servers?',
      answer: 'No. We strictly follow a client-side processing architecture. Whether you are compressing a PDF, cropping an image, or generating a Sarkari exam pack, all file processing happens directly inside your web browser using WebAssembly. Your files never leave your device, ensuring total privacy.'
    },
    {
      question: 'Which is the best tool for SSC and UPSC forms?',
      answer: 'We highly recommend the "1-Click Exam Pack Generator" and the "Combine Photo and Signature" tools for Sarkari exams. They automatically handle the specific KB size limits, dimensions, and DPI required by platforms like SSC, UPSC, and IBPS.'
    },
    {
      question: 'Can I use these tools on my mobile phone?',
      answer: 'Absolutely. SizeSnap is optimized as a Progressive Web App (PWA) experience, meaning all tools including the Live Document Scanner and Smart Aadhar Print Maker work seamlessly on Android and iOS devices without needing to download an app from the Play Store.'
    }
  ]

  const filteredTools = useMemo(() => {
    let result = tools

    if (activeCategory !== 'All') {
      const map: Record<string, string> = {
        'Image Tools': 'image',
        'PDF Tools': 'pdf',
        'Exam Tools': 'form'
      }
      result = result.filter(t => t.category === map[activeCategory])
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.variants.some(v => 
          v.label.toLowerCase().includes(q) || 
          v.metaTitle.toLowerCase().includes(q) ||
          v.slug.toLowerCase().includes(q)
        )
      )
    }

    return result
  }, [searchQuery, activeCategory])

  const renderIcon = (iconStr: string) => {
    if (iconStr === 'ShieldCheck') return <ShieldCheck className="w-7 h-7 text-blue-600" />
    return <span className="text-3xl leading-none">{iconStr}</span>
  }

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'All Free Tools Collection',
    'url': 'https://sizesnap.in/tools',
    'description': 'Explore our complete collection of 100% free client-side tools. From resizing passport photos for exams to merging PDFs and smart document scanning.',
    'publisher': {
      '@type': 'Organization',
      'name': 'SizeSnap'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ─── INTRO ────────────────────────────────────────── */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            All Tools
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Everything you need for images, PDFs, photos and document preparation — in one place.
          </p>
        </section>

        {/* ─── SEARCH ───────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto relative z-10">
          <div className="relative group shadow-sm rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-14 py-4 md:py-5 border-2 border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-lg"
              placeholder="Search tools (e.g., 'compress', 'passport', 'pdf')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </section>

        {/* ─── CATEGORY FILTERS ─────────────────────────────── */}
        <section className="flex items-center gap-3 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start md:justify-center">
          {['All', 'Image Tools', 'PDF Tools', 'Exam Tools'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* ─── MAIN TOOL GRID ───────────────────────────────── */}
        <section>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map(tool => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="card p-6 flex flex-col group hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                    {renderIcon(tool.icon)}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-grow">
                    {tool.description}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                      {tool.category === 'image' ? 'Image' : tool.category === 'pdf' ? 'PDF' : 'Exam'}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 border border-slate-200 rounded-3xl max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No tools found</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                We couldn't find any tools matching "{searchQuery}". Try searching for something like "compress", "passport", or "pdf".
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="btn-primary px-8 py-3"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* ─── SEO CONTENT ──────────────────────────────────── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Why Use SizeSnap's Tools Collection?</h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
            <p>
              In today's digital age, dealing with strict file size limitations and exact dimension requirements for online portals is a daily hassle. Whether you are a student applying for competitive exams like SSC CGL, RRB NTPC, or UPSC, a professional managing document workflows, or a cyber cafe owner providing services to dozens of customers daily, you need a toolkit that is reliable and fast.
            </p>
            <p>
              <strong>SizeSnap</strong> was built with a singular mission: to provide a comprehensive, 100% free suite of image and PDF tools that operate entirely within your browser. 
            </p>
            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">1. The Privacy First Approach</h3>
            <p>
              Most online compression tools require you to upload your highly sensitive documents (like Aadhar cards, PAN cards, Passports, and Signatures) to their remote servers. This poses a massive privacy risk. We have engineered all our tools using modern WebAssembly (WASM) and HTML5 Canvas API. This means when you click "Compress" or "Resize", the math and processing happen directly on your own device's CPU. Your files are never uploaded to the internet, guaranteeing complete data privacy.
            </p>
            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">2. Specialized Tools for Cyber Cafes and Students</h3>
            <p>
              Beyond generic resizers, we've developed highly specialized utilities based on real-world Indian use cases. Tools like the <strong>Smart Aadhar Print Maker</strong> allow cyber cafes to perfectly align ID cards on A4 sheets for PVC printing. The <strong>Formal Passport Suit Maker</strong> uses AI-prepared assets to help job seekers instantly professionalize their CV photos. 
            </p>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12">
          <FaqSection faqs={faqs} toolName="SizeSnap Tools" />
        </section>

      </div>
    </>
  )
}

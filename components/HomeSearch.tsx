'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'
import { Search, Image as ImageIcon, FileText } from 'lucide-react'
import { getPrettySlug } from '@/lib/customSeoContent'

export default function HomeSearch() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      setQuery(q)
    }
  }, [])

  const filteredTools = tools.filter(tool => {
     if (!query) return true
     const lowerQuery = query.toLowerCase()
     return (
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.slug.includes(lowerQuery) ||
        tool.variants.some(v => v.label.toLowerCase().includes(lowerQuery) || v.slug.includes(lowerQuery))
     )
  })

  const imageTools = filteredTools.filter(t => t.category === 'image')
  const pdfTools = filteredTools.filter(t => t.category === 'pdf')

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8 relative z-10 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-2 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
           <Search className="w-5 h-5 text-slate-400 ml-2" />
           <input 
             type="text" 
             placeholder="What do you want to do? (e.g. compress 50kb, convert to jpg...)" 
             className="w-full p-3 outline-none text-slate-800 bg-transparent text-sm md:text-base font-medium placeholder:text-slate-400"
             value={query}
             onChange={e => setQuery(e.target.value)}
           />
        </div>

        {/* Quick Search Badges */}
        <div className="flex flex-wrap gap-2 justify-center text-xs text-slate-500 items-center">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Trending:</span>
          {[
            { label: 'Resize 50KB', query: '50kb' },
            { label: 'PDF to 100KB', query: 'pdf to 100kb' },
            { label: 'Passport Photo', query: 'passport' },
            { label: 'WhatsApp No Crop', query: 'whatsapp' },
            { label: 'HEIC to JPG', query: 'heic' },
            { label: 'Merge Aadhaar', query: 'merge' },
            { label: 'DSSSB 5x7', query: 'dsssb' },
            { label: 'Remove Shadow', query: 'shadow' },
            { label: 'Split PDF', query: 'split' },
            { label: 'White BG', query: 'white' },
            { label: 'Blue BG', query: 'blue' },
          ].map(tag => (
            <button
              key={tag.label}
              onClick={() => setQuery(tag.query)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border border-slate-200"
            >
              {tag.label}
            </button>
          ))}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-rose-600 font-bold hover:underline ml-2"
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* Live Application Forms Resizers */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-2 items-center text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Live Forms:
          </span>
          {[
            { label: 'RRB NTPC 2026 Resizer', path: '/image-size-for-rrb-exam' },
            { label: 'SSC MTS 2026 Resizer', path: '/image-size-for-ssc-mts-exam' },
            { label: 'SSC GD Resizer', path: '/image-size-for-ssc-gd' },
            { label: 'UPSSSC PET Resizer', path: '/photo-size-for-upsssc-pet' },
            { label: 'IBPS PO 2026 Resizer', path: '/image-size-for-ibps-exam' },
            { label: 'UPSC Form Photo', path: '/photo-size-for-upsc-form' },
            { label: 'SSC Signature (20KB)', path: '/resize-signature-for-ssc' },
            { label: 'PAN Card Photo', path: '/pan-card-photo-size' },
            { label: 'Photo Name & Date Maker', path: '/add-name-and-date-on-photo-online' },
            { label: '300 DPI Converter', path: '/convert-image-to-300-dpi' },
            { label: 'Merge Aadhaar Card', path: '/merge-aadhaar-card-front-and-back' },
            { label: 'DSSSB 5x7 Postcard', path: '/dsssb-postcard-photo-resizer' },
            { label: 'Shadow Remover Scan', path: '/remove-shadow-from-document' },
            { label: 'Split PDF pages', path: '/split-pdf-extract-pages' },
            { label: 'White Background Maker', path: '/change-photo-background-to-white' },
            { label: 'Blue Background Maker', path: '/change-photo-background-to-blue' },
          ].map(lnk => (
            <Link
              key={lnk.label}
              href={lnk.path}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-700 font-bold transition-all shadow-sm flex items-center gap-1.5 text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              {lnk.label}
            </Link>
          ))}
        </div>
      </div>

      {filteredTools.length === 0 && (
         <div className="text-center py-10 text-gray-500">
            No tools found matching &quot;{query}&quot;.
         </div>
      )}

      {/* Image Tools Section */}
      {imageTools.length > 0 && (
      <section id="all-tools">
        <h2 className="text-[11px] font-black tracking-[0.18em] text-slate-500 uppercase mb-5 flex items-center gap-2 select-none">
          <ImageIcon className="w-4 h-4 text-blue-600" /> Image Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imageTools.map(tool => (
            <div key={tool.slug} className="group relative bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                {/* Icon wrapper with soft bg glow */}
                <div className="w-11 h-11 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-xl mb-4 transition-all duration-200 border border-blue-100">
                  {tool.icon}
                </div>
                <h3 className="font-extrabold text-gray-900 mb-1 text-base group-hover:text-blue-600 transition-colors leading-tight">{tool.name}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed font-normal">{tool.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {tool.variants.slice(0, 5).map(v => {
                  const prettySlug = getPrettySlug(tool.slug, v.slug)
                  const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${v.slug}`
                  return (
                    <Link key={v.slug} href={linkHref}
                      className="text-[11px] bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white border border-slate-200 hover:border-blue-600 px-2.5 py-1 rounded-md transition-all duration-200 font-bold">
                      {v.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* PDF Tools Section */}
      {pdfTools.length > 0 && (
      <section>
        <h2 className="text-[11px] font-black tracking-[0.18em] text-slate-500 uppercase mb-5 flex items-center gap-2 select-none">
          <FileText className="w-4 h-4 text-indigo-600" /> PDF Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pdfTools.map(tool => (
            <div key={tool.slug} className="group relative bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div>
                {/* Icon wrapper with soft bg glow */}
                <div className="w-11 h-11 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-xl mb-4 transition-all duration-200 border border-indigo-100">
                  {tool.icon}
                </div>
                <h3 className="font-extrabold text-gray-900 mb-1 text-base group-hover:text-blue-600 transition-colors leading-tight">{tool.name}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed font-normal">{tool.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {tool.variants.slice(0, 4).map(v => {
                  const prettySlug = getPrettySlug(tool.slug, v.slug)
                  const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${v.slug}`
                  return (
                    <Link key={v.slug} href={linkHref}
                      className="text-[11px] bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white border border-slate-200 hover:border-blue-600 px-2.5 py-1 rounded-md transition-all duration-200 font-bold">
                      {v.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'
import { Search } from 'lucide-react'

export default function HomeSearch() {
  const [query, setQuery] = useState('')

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
      <div className="max-w-2xl mx-auto -mt-6 mb-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center p-2">
           <Search className="w-6 h-6 text-gray-400 ml-3" />
           <input 
             type="text" 
             placeholder="What do you want to do? (e.g. compress 50kb, convert to jpg...)" 
             className="w-full p-3 outline-none text-gray-700 bg-transparent text-lg"
             value={query}
             onChange={e => setQuery(e.target.value)}
           />
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
        <h2 className="text-xl font-bold text-gray-800 mb-5">🖼️ Image Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imageTools.map(tool => (
            <div key={tool.slug} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2">
                {tool.variants.slice(0, 5).map(v => (
                  <Link key={v.slug} href={`/${tool.slug}/${v.slug}`}
                    className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    {v.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* PDF Tools Section */}
      {pdfTools.length > 0 && (
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5">📄 PDF Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pdfTools.map(tool => (
            <div key={tool.slug} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2">
                {tool.variants.slice(0, 4).map(v => (
                  <Link key={v.slug} href={`/${tool.slug}/${v.slug}`}
                    className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    {v.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}
    </div>
  )
}

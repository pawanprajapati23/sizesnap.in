import Link from 'next/link'
import { tools, getToolsByCategory } from '@/lib/toolConfigs'

export default function Sidebar() {
  const imageTools = getToolsByCategory('image')
  const pdfTools = getToolsByCategory('pdf')

  return (
    <div className="space-y-6">
      {/* Image Tools */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          🖼️ Image Tools
        </h3>
        <nav className="space-y-1">
          {imageTools.map(tool => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}/${tool.variants[0].slug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {tool.icon} {tool.shortName}
            </Link>
          ))}
        </nav>
      </div>

      {/* PDF Tools */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          📄 PDF Tools
        </h3>
        <nav className="space-y-1">
          {pdfTools.map(tool => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}/${tool.variants[0].slug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {tool.icon} {tool.shortName}
            </Link>
          ))}
        </nav>
      </div>

      {/* Quick Size Links */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
          Popular Image Sizes
        </h3>
        <div className="flex flex-wrap gap-2">
          {['to-10kb','to-20kb','to-50kb','to-100kb','to-200kb','to-500kb','to-1mb'].map(v => (
            <Link
              key={v}
              href={`/resize-image/${v}`}
              className="text-xs bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
            >
              {v.replace('to-', '').toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

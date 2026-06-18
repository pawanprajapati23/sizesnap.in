import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'

export default function RelatedTools({ currentToolSlug }: { currentToolSlug: string }) {
  const related = tools.filter(t => t.slug !== currentToolSlug).slice(0, 6)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-800 mb-4 uppercase text-xs tracking-widest">Explore More Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map(tool => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}/${tool.variants[0].slug}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{tool.shortName}</p>
              <p className="text-xs text-gray-400">{tool.variants[0].label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

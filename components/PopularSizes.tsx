import Link from 'next/link'
import { Tool } from '@/lib/toolConfigs'

interface Props {
  tool: Tool
  currentVariantSlug: string
}

export default function PopularSizes({ tool, currentVariantSlug }: Props) {
  // Curated list of popular sizes requested by UX standards
  const popularSlugs = ['to-20kb', 'to-50kb', 'to-100kb', 'to-200kb', 'to-500kb', 'to-1mb']
  
  // Filter variants to only show the popular ones, plus the current one (if it's not in the list)
  const displayVariants = tool.variants.filter(v => 
    popularSlugs.includes(v.slug) || v.slug === currentVariantSlug
  )

  // If the tool doesn't use the size-based variant slugs (e.g., Passport Photo, Whatsapp DP), 
  // just show all its variants (usually 1-3).
  const finalVariants = displayVariants.length > 1 ? displayVariants : tool.variants

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
        Popular {tool.shortName} Options
      </h2>
      <div className="flex flex-wrap gap-2">
        {finalVariants.map(variant => (
          <Link
            key={variant.slug}
            href={`/${tool.slug}/${variant.slug}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
              variant.slug === currentVariantSlug
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
            }`}
          >
            {variant.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

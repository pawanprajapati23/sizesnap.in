import Link from 'next/link'
import { Tool } from '@/lib/toolConfigs'
import { getPrettySlug } from '@/lib/customSeoContent'

interface Props {
  tool: Tool
  currentVariantSlug: string
}

export default function PopularSizes({ tool, currentVariantSlug }: Props) {
  // Curated list of popular sizes
  const popularSlugs = ['to-20kb', 'to-50kb', 'to-100kb', 'to-200kb', 'to-500kb', 'to-1mb']
  
  // Use cases are usually the ones without "kb" or "mb" in slug (except specific ones)
  const useCaseVariants = tool.variants.filter(v => 
    !v.slug.includes('kb') && !v.slug.includes('mb')
  )

  const sizeVariants = tool.variants.filter(v => 
    popularSlugs.includes(v.slug) || v.slug === currentVariantSlug
  )

  return (
    <div className="space-y-4">
      {sizeVariants.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Popular {tool.shortName} Sizes
          </h2>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map(variant => {
              const prettySlug = getPrettySlug(tool.slug, variant.slug)
              const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${variant.slug}`
              return (
                <Link
                  key={variant.slug}
                  href={linkHref}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                    variant.slug === currentVariantSlug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                  }`}
                >
                  {variant.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {useCaseVariants.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Specific Use Cases
          </h2>
          <div className="flex flex-wrap gap-2">
            {useCaseVariants.map(variant => {
              const prettySlug = getPrettySlug(tool.slug, variant.slug)
              const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${variant.slug}`
              return (
                <Link
                  key={variant.slug}
                  href={linkHref}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                    variant.slug === currentVariantSlug
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                  }`}
                >
                  {variant.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

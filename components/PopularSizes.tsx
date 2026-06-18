import Link from 'next/link'
import { Tool } from '@/lib/toolConfigs'

interface Props {
  tool: Tool
  currentVariantSlug: string
}

export default function PopularSizes({ tool, currentVariantSlug }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
        Popular {tool.shortName} Sizes
      </h2>
      <div className="flex flex-wrap gap-2">
        {tool.variants.map(variant => (
          <Link
            key={variant.slug}
            href={`/${tool.slug}/${variant.slug}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              variant.slug === currentVariantSlug
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            {variant.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

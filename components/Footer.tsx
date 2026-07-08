import Link from 'next/link'
import Image from 'next/image'
import { tools } from '@/lib/toolConfigs'
import { getPrettySlug } from '@/lib/customSeoContent'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/logo.png" alt="SizeSnap Logo" width={22} height={22} className="w-5.5 h-5.5 object-contain" />
            <span className="text-white font-bold text-lg tracking-tight">SizeSnap</span>
          </div>
          <p className="text-sm leading-relaxed">
            Free online tools for images and PDFs. Fast, private, and mobile-friendly.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Image Tools</h4>
          <ul className="space-y-2 text-sm">
            {tools.filter(t => t.category === 'image').map(tool => {
              const prettySlug = getPrettySlug(tool.slug, tool.variants[0].slug)
              const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${tool.variants[0].slug}`
              return (
                <li key={tool.slug}>
                  <Link href={linkHref} className="hover:text-white transition-colors">
                    {tool.shortName}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">PDF Tools</h4>
          <ul className="space-y-2 text-sm">
            {tools.filter(t => t.category === 'pdf').map(tool => {
              const prettySlug = getPrettySlug(tool.slug, tool.variants[0].slug)
              const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${tool.variants[0].slug}`
              return (
                <li key={tool.slug}>
                  <Link href={linkHref} className="hover:text-white transition-colors">
                    {tool.shortName}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Popular Sizes</h4>
          <ul className="space-y-2 text-sm">
            {['10kb','20kb','50kb','100kb','200kb','500kb','1mb'].map(size => {
              const prettySlug = getPrettySlug('resize-image', `to-${size}`)
              const linkHref = prettySlug ? `/${prettySlug}` : `/resize-image/to-${size}`
              return (
                <li key={size}>
                  <Link href={linkHref} className="hover:text-white transition-colors">
                    Resize to {size.toUpperCase()}
                  </Link>
                </li>
              )
            })}
          </ul>

          <h4 className="text-white font-semibold mt-6 mb-3 text-sm">Web Stories</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/stories" className="hover:text-white transition-colors">
                All Stories
              </Link>
            </li>
            <li>
              <Link href="/stories/passport-photo-fix" className="hover:text-white transition-colors text-xs opacity-80">
                Passport Photo Mistakes
              </Link>
            </li>
            <li>
              <Link href="/stories/ssc-photo-rejection" className="hover:text-white transition-colors text-xs opacity-80">
                SSC Photo Rejection Fix
              </Link>
            </li>
            <li>
              <Link href="/stories/signature-reject-fix" className="hover:text-white transition-colors text-xs opacity-80">
                Signature Rejection Fix
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-8 text-center text-xs flex flex-col gap-4">
        <div className="flex justify-center gap-6 flex-wrap">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/about-us" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/stories" className="hover:text-white transition-colors">Stories</Link>
        </div>
        <div>
          © {new Date().getFullYear()} SizeSnap. Created and owned by <Link href="/about-us#founder" className="text-white hover:underline">Pawan Prajapati</Link> (B.Tech student & SDE aspirant). All files are processed locally.
        </div>
      </div>
    </footer>
  )
}

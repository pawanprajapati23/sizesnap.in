import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="text-white font-bold text-lg mb-2">📐 SizeSnap</p>
          <p className="text-sm leading-relaxed">
            Free online tools for images and PDFs. Fast, private, and mobile-friendly.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Image Tools</h4>
          <ul className="space-y-2 text-sm">
            {tools.filter(t => t.category === 'image').map(tool => (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}/${tool.variants[0].slug}`}
                  className="hover:text-white transition-colors">
                  {tool.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">PDF Tools</h4>
          <ul className="space-y-2 text-sm">
            {tools.filter(t => t.category === 'pdf').map(tool => (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}/${tool.variants[0].slug}`}
                  className="hover:text-white transition-colors">
                  {tool.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Popular Sizes</h4>
          <ul className="space-y-2 text-sm">
            {['10kb','20kb','50kb','100kb','200kb','500kb','1mb'].map(size => (
              <li key={size}>
                <Link href={`/resize-image/to-${size}`}
                  className="hover:text-white transition-colors">
                  Resize to {size.toUpperCase()}
                </Link>
              </li>
            ))}
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
        <div className="flex justify-center gap-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/about-us" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/stories" className="hover:text-white transition-colors">Stories</Link>
        </div>
        <div>
          © {new Date().getFullYear()} SizeSnap. All tools are free. Files never leave your browser.
        </div>
      </div>
    </footer>
  )
}

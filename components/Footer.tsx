import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const imageToolLinks = [
    { label: 'Compress Image to 14KB',  href: '/compress-image/to-14kb' },
    { label: 'Compress Image to 12KB',  href: '/compress-image/to-12kb' },
    { label: 'Resize Image to 50KB',    href: '/resize-image-to-50kb' },
    { label: 'Resize Image to 100KB',   href: '/resize-image-to-100kb' },
    { label: 'Compress Image to 50KB',  href: '/compress-image-to-50kb' },
    { label: 'Resize Image to 20KB',    href: '/resize-image-to-20kb' },
    { label: 'Resize Image to 200KB',   href: '/resize-image-to-200kb' },
    { label: 'Compress Without Blur',   href: '/reduce-image-size-without-blur' },
  ]

  const pdfToolLinks = [
    { label: 'Compress PDF to 100KB',   href: '/compress-pdf-to-100kb' },
    { label: 'Compress PDF to 200KB',   href: '/compress-pdf-to-200kb' },
    { label: 'Compress PDF to 12KB',    href: '/compress-pdf-to-12kb' },
    { label: 'JPG to PDF Converter',    href: '/jpg-to-pdf' },
    { label: 'Merge PDF Online',        href: '/merge-pdf-online' },
    { label: 'Passport Size Photo',     href: '/passport-size-photo-maker' },
    { label: 'Remove Shadow from Doc',  href: '/remove-shadow-from-document' },
    { label: 'Document Scanner (B&W)',  href: '/document-scanner' },
  ]

  const examLinks = [
    { label: 'SSC CGL Photo Size',      href: '/exam/ssc-cgl' },
    { label: 'SSC CHSL Photo Size',     href: '/exam/ssc-chsl' },
    { label: 'Railway RRB Photo Size',  href: '/exam/rrb-ntpc' },
    { label: 'IBPS PO Photo Size',      href: '/exam/ibps-po' },
    { label: 'NEET Photo Size Guide',   href: '/image-size-for-neet-form' },
    { label: 'JEE Main Photo Size',     href: '/image-size-for-jee-main' },
    { label: 'Exam Photo Specs',        href: '/exam-photo-specifications' },
    { label: 'Image Size Guide',        href: '/image-size-guide' },
  ]

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="SizeSnap Logo" width={24} height={24} className="w-6 h-6 object-contain" />
            <span className="text-slate-900 font-extrabold text-xl tracking-tight">SizeSnap</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 text-slate-500">
            Free online tools for Sarkari exam forms. Resize photos, compress PDFs, and create passport photos — 100% private, files never leave your device.
          </p>
          <div className="flex flex-wrap gap-2">
            {['SSC','IBPS','Railway','NEET','UPSC','Police'].map(exam => (
              <span key={exam} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {exam}
              </span>
            ))}
          </div>
        </div>

        {/* Image Tools */}
        <div>
          <h4 className="text-slate-900 font-bold mb-4 text-sm tracking-wide uppercase">Image Tools</h4>
          <ul className="space-y-2.5 text-sm">
            {imageToolLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-600 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PDF & Sarkari Tools */}
        <div>
          <h4 className="text-slate-900 font-bold mb-4 text-sm tracking-wide uppercase">PDF & Sarkari Tools</h4>
          <ul className="space-y-2.5 text-sm">
            {pdfToolLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-600 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Exam Links */}
        <div>
          <h4 className="text-slate-900 font-bold mb-4 text-sm tracking-wide uppercase">Exam Photo Sizes</h4>
          <ul className="space-y-2.5 text-sm">
            {examLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-600 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <h4 className="text-slate-900 font-bold mt-8 mb-4 text-sm tracking-wide uppercase">Web Stories</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/stories" className="hover:text-blue-600 transition-colors font-medium">All Stories</Link></li>
            <li><Link href="/stories/passport-photo-fix" className="hover:text-slate-900 transition-colors text-xs text-slate-500">Passport Photo Mistakes</Link></li>
            <li><Link href="/stories/ssc-photo-rejection" className="hover:text-slate-900 transition-colors text-xs text-slate-500">SSC Photo Rejection Fix</Link></li>
            <li><Link href="/stories/signature-reject-fix" className="hover:text-slate-900 transition-colors text-xs text-slate-500">Signature Rejection Fix</Link></li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-4 py-8 text-center text-sm flex flex-col gap-4">
        <div className="flex justify-center gap-6 flex-wrap font-medium">
          <Link href="/sarkarinaukari" className="hover:text-blue-600 transition-colors text-blue-600">Sarkari Naukri Updates</Link>
          <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          <Link href="/about-us" className="hover:text-blue-600 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <Link href="/stories" className="hover:text-blue-600 transition-colors">Stories</Link>
          <Link href="/tools" className="hover:text-blue-600 transition-colors">All Tools</Link>
        </div>
        <div className="text-slate-500 text-xs mt-2">
          © {new Date().getFullYear()} SizeSnap. Created and owned by{' '}
          <Link href="/about-us#founder" className="text-slate-900 font-semibold hover:underline">Pawan Prajapati</Link>{' '}
          (B.Tech student & SDE aspirant). All files are processed locally in your browser.
        </div>
      </div>
    </footer>
  )
}

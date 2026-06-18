import Link from 'next/link'
import { tools } from '@/lib/toolConfigs'
import { blogs } from '@/lib/blogConfigs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Complete Image Size & Dimension Guide 2026 | SizeSnap',
  description: 'Master guide for image sizes, dimensions, and compression limits for government forms (SSC, UPSC), social media, and professional use.',
}

export default function ImageSizeGuide() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Master Image Size & Dimension Guide</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about resizing, compressing, and formatting images for official applications and web use.
        </p>
      </section>

      {/* Quick Search Hub */}
      <section className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Quick Tools Hub</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.slice(0, 8).map(tool => (
            <Link 
              key={tool.slug} 
              href={`/${tool.slug}/${tool.variants[0].slug}`}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-xl backdrop-blur-sm transition-all border border-white/20 text-center"
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="font-semibold text-sm">{tool.shortName}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-10">
          <section className="prose prose-blue max-w-none">
            <h2 className="text-3xl font-bold text-gray-900">1. Understanding File Size (KB vs MB)</h2>
            <p>
              When applying for government jobs in India (like SSC, UPSC, IBPS), you will often see limits like "Photo must be between 20KB to 50KB".
            </p>
            <ul>
              <li><strong>KB (Kilobyte):</strong> Small size, perfect for signatures and passport photos.</li>
              <li><strong>MB (Megabyte):</strong> 1024 KB. Usually allowed for high-quality documents and marksheet scans.</li>
            </ul>
            <p>
              Our <Link href="/resize-image/to-50kb">Image Resizer</Link> uses advanced compression algorithms to hit these targets without making your photo look blurry.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12">2. Official Passport Photo Dimensions</h2>
            <p>Different forms require different physical dimensions. Here are the most common ones:</p>
            <table className="min-w-full border mt-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">Application</th>
                  <th className="px-4 py-2 border">Dimension (cm)</th>
                  <th className="px-4 py-2 border">Pixels (approx)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">Indian Passport</td>
                  <td className="px-4 py-2 border">3.5 x 4.5 cm</td>
                  <td className="px-4 py-2 border">413 x 531 px</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">SSC / UPSC</td>
                  <td className="px-4 py-2 border">3.5 x 4.5 cm</td>
                  <td className="px-4 py-2 border">413 x 531 px</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">PAN Card</td>
                  <td className="px-4 py-2 border">2.5 x 3.5 cm</td>
                  <td className="px-4 py-2 border">213 x 213 px</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4">
              Use our <Link href="/passport-photo/indian-passport">Passport Maker</Link> to automatically crop your photo to these exact sizes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Latest Blog & How-To Guides</h2>
            <div className="space-y-4">
              {blogs.map(blog => (
                <Link 
                  key={blog.slug} 
                  href={`/blog/${blog.slug}`}
                  className="block p-4 border rounded-xl hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <h3 className="font-bold text-lg group-hover:text-blue-600">{blog.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{blog.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Popular Size Targets</h3>
            <div className="flex flex-wrap gap-2">
              {['20KB', '50KB', '100KB', '200KB', '500KB', '1MB'].map(size => (
                <Link 
                  key={size}
                  href={`/resize-image/to-${size.toLowerCase()}`}
                  className="bg-white px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {size}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <h3 className="font-bold text-orange-900 mb-4">Exam Specifics</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/passport-photo/ssc-exam" className="text-sm text-orange-800 hover:underline">SSC CGL/CHSL Photos</Link>
              </li>
              <li>
                <Link href="/signature-resize/upsc-signature" className="text-sm text-orange-800 hover:underline">UPSC Signature Guidelines</Link>
              </li>
              <li>
                <Link href="/passport-photo/pan-card" className="text-sm text-orange-800 hover:underline">NSDL PAN Photo Specs</Link>
              </li>
              <li>
                <Link href="/resize-image/to-100kb" className="text-sm text-orange-800 hover:underline">IBPS Form Uploads</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

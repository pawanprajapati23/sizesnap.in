import { Tool, ToolVariant } from '@/lib/toolConfigs'
import { CheckCircle2, ShieldCheck, Zap, Files, BookOpen } from 'lucide-react'
import { getRelatedBlogs } from '@/lib/blogConfigs'
import Link from 'next/link'

import { getCustomSeo } from '@/lib/customSeoContent'

interface SeoContentProps {
  tool: Tool
  variant: ToolVariant
}

export default function SeoContent({ tool, variant }: SeoContentProps) {
  const customSeo = getCustomSeo(tool.slug, variant.slug)
  
  if (customSeo) {
    return (
      <article className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8 prose prose-blue max-w-none text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: customSeo.bodyHtml }} />
      </article>
    )
  }

  const isImageGroup = ['resize-image', 'compress-image', 'convert-image'].includes(tool.slug)
  const isPdfGroup = ['compress-pdf', 'image-to-pdf', 'merge-pdf'].includes(tool.slug)
  const isPassport = tool.slug === 'passport-photo'
  const isSignature = tool.slug === 'signature-resize'

  const fileTypeStr = isPdfGroup ? 'PDF files' : 'images'
  const sizeValue = variant.config.maxKB ? `${variant.config.maxKB}KB` : variant.label
  const relatedBlogs = getRelatedBlogs(tool.slug)
  
  return (
    <article className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8 prose prose-blue max-w-none text-gray-700">
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
          Everything You Need to Know About the {variant.h1} Tool
        </h2>
        <p>
          Welcome to the most efficient way to process your {fileTypeStr}. 
          If you are looking to <strong>{tool.name.toLowerCase()}</strong> and hit specific 
          requirements—like {sizeValue}—you are in the right place. Our browser-based utility allows you to 
          effortlessly {tool.description.toLowerCase()} 
          without the hassle of installing software or signing up for an account.
        </p>
        <p>
          {variant.introParagraph} 
          Whether you are an individual filling out government forms, a student applying for university admissions, 
          or a professional submitting digital documents, keeping your {fileTypeStr} strictly within the {sizeValue} 
          limit is often mandatory. This free online tool makes the entire process incredibly fast and 100% secure.
        </p>

        {/* Internal Linking to Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="not-prose bg-blue-50 border border-blue-100 rounded-xl p-6 my-8">
            <h3 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Helpful Guides & Instructions
            </h3>
            <div className="grid gap-3">
              {relatedBlogs.map(blog => (
                <Link 
                  key={blog.slug} 
                  href={`/blog/${blog.slug}`}
                  className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center group"
                >
                  <span className="text-blue-700 font-medium group-hover:text-blue-800">{blog.title}</span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Bilingual Hindi Content for Tier-2 / Tier-3 Regional SEO */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-5 mt-6 rounded-r-lg">
          <h3 className="font-bold text-gray-900 text-lg mb-2">हिंदी में जानकारी (Online File Maker)</h3>
          <p className="text-sm text-gray-800 mb-2">
            अगर आप SSC, UPSC, State Police या किसी भी सरकारी नौकरी का फॉर्म भर रहे हैं, तो अक्सर &quot;Photo {sizeValue} kaise banaye&quot; या &quot;Signature size minimize karein&quot; जैसी परेशानियां आती हैं। SizeSnap का यह टूल खास छात्रों के लिए बनाया गया है।
          </p>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
            <li><strong>बिना इंटरनेट खर्च:</strong> आपकी फोटो आपके फोन/कंप्यूटर से बाहर इंटरनेट पर अपलोड नहीं होती (100% Safe)।</li>
            <li><strong>फ्री टूल:</strong> यह {variant.h1} सर्विस पूरी तरह मुफ्त है। कोई पैसे नहीं देने।</li>
            <li><strong>मोबाइल फ्रेंडली:</strong> आप सीधे अपने Android या iPhone से फोटो खींच कर तुरंत उसे {sizeValue} का बना सकते हैं।</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use This Tool Step-by-Step</h2>
        <p>
          You don&apos;t need any technical skills to use our platform. Just follow these simple steps to 
          process your {fileTypeStr} to {sizeValue}:
        </p>
        <ol className="list-decimal list-inside space-y-2 mt-2 bg-slate-50 p-6 rounded-lg">
          <li><strong>Upload your file:</strong> Click the upload box above or drag and drop your {fileTypeStr} directly into the specific dropzone.</li>
          <li><strong>Automatic Processing:</strong> As soon as your file is uploaded, the tool immediately begins working. Using local client-side scripts, your file is manipulated to hit the targeted size of {sizeValue} while maintaining maximum visual quality.</li>
          <li><strong>Verify the Output:</strong> A quick preview check allows you to ensure the document or image remains legible and clear.</li>
          <li><strong>Download:</strong> Click the download button to save the newly optimized {sizeValue} file directly to your device.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Benefits of Using SizeSnap</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="flex gap-3 items-start border p-4 rounded-xl bg-gray-50 border-gray-100">
            <ShieldCheck className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 m-0">100% Privacy & Security</h3>
              <p className="text-sm mt-1 mb-0">Unlike other converters, your files never leave your device. All processing happens entirely within your web browser. No uploads to our servers.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start border p-4 rounded-xl bg-gray-50 border-gray-100">
            <Zap className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 m-0">Lightning Fast</h3>
              <p className="text-sm mt-1 mb-0">Since processing happens locally on your machine (client-side), the {sizeValue} output is generated almost instantaneously.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start border p-4 rounded-xl bg-gray-50 border-gray-100">
            <Files className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 m-0">No Watermarks</h3>
              <p className="text-sm mt-1 mb-0">Your final downloaded {fileTypeStr} remain yours. We do not insert any hidden watermarks, logos, or brand marks onto your output files.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start border p-4 rounded-xl bg-gray-50 border-gray-100">
            <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 m-0">Free and Unlimited</h3>
              <p className="text-sm mt-1 mb-0">There are no daily usage limits or paywalls blocking your progress. Convert as many {fileTypeStr} to {sizeValue} as you need.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Use Cases for {sizeValue} Files</h2>
        <ul className="space-y-2 mt-2">
          {(!isPdfGroup || isSignature || isPassport) && (
            <>
              <li><strong>Government Job Portals:</strong> Forms for SSC, UPSC, IBPS, and state exams highly regulate image and signature upload dimensions, strictly binding candidates to thresholds like {sizeValue}.</li>
              <li><strong>University Admissions:</strong> College application forms strictly restrict profile photos or scanned certificates to smaller payloads.</li>
            </>
          )}
          {(isPdfGroup) && (
            <>
              <li><strong>Email Attachments:</strong> Many enterprise mail clients block email deliveries containing excessively large PDFs. Compressing payloads down to {sizeValue} guarantees successful transmission.</li>
              <li><strong>e-Filing & Documentation:</strong> Tax filing portals, regulatory compliance submissions, and court e-filing systems reject dense PDF packages, forcing users to constrain the size securely without losing legibility.</li>
            </>
          )}
          <li><strong>Website Performance:</strong> Webmasters loading oversized assets cause site lag. Compressing media accelerates Time To Interactive speeds, improving Google SEO metrics.</li>
        </ul>
      </section>

      {isSignature && (
        <section className="bg-blue-50 p-6 rounded-lg text-blue-900">
          <h3 className="font-bold mb-2">Tips for Scanned Signatures</h3>
          <p className="text-sm m-0">
            When creating a {sizeValue} signature, ensure you write on a blank white piece of paper using a dark black or blue pen. 
            Ensure good lighting to avoid grey shadows. Our smart cropper and compressor will handle the rest, giving you a crisp document-ready scan.
          </p>
        </section>
      )}

      {isPassport && (
        <section className="bg-blue-50 p-6 rounded-lg text-blue-900">
          <h3 className="font-bold mb-2">Tips for Passport Specifications</h3>
          <p className="text-sm m-0">
            Official passport agencies mandate clear, front-facing expressions with zero background clutter. 
            Aim for natural lighting and ensure 70-80% of the newly configured {sizeValue} box is occupied by your face.
          </p>
        </section>
      )}
    </article>
  )
}

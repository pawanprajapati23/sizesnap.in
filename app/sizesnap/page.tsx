import { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Zap, ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SizeSnap — Free Online Image & PDF Resizer (Official) | SizeSnap.in',
  description: 'Welcome to SizeSnap, the official free image and PDF resizer. Compress PDFs, resize photos under 50KB, and crop signature scans locally in your browser. 100% private.',
  alternates: {
    canonical: 'https://sizesnap.in/sizesnap',
  }
}

export default function SizeSnapBrandPage() {
  const brandFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kya SizeSnap ka use karne ke liye login ya payment zaroori hai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bilkul nahi. SizeSnap ek 100% free online tool suite hai. Yahan koi paywalls, registration steps, ya hidden subscription charges nahi hain. Aap bina login kiye unlimited compress aur download kar sakte hain.'
        }
      },
      {
        '@type': 'Question',
        name: 'Mera document SizeSnap servers par safe rehta hai kya?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SizeSnap 100% client-side technology par run karta hai. Iska matlab hai ki aapka koi bhi personal marksheet, Aadhaar scan, ya photo hamare server par upload hi nahi hota hai. Sabhi file processing directly aapke mobile ya computer browser ke RAM me local execute hoti hai.'
        }
      },
      {
        '@type': 'Question',
        name: 'Mobile user SizeSnap tools kaise run karein?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Aap directly apne Android ya iPhone device ke Chrome/Safari browser me sizesnap.in search karke home screen se koi bhi utility tool open kar sakte hain. Upload button par tab karke file select karein aur direct fix download karein.'
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandFaqSchema) }}
      />
      
      <div className="max-w-4xl mx-auto py-10 px-4 md:px-0 space-y-10">
        
        {/* Brand Banner */}
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-lg text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider uppercase">
            <span>Official Brand Page</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            SizeSnap: Free Online Image & PDF Tools
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to the official hub of SizeSnap.in. We offer zero-cost, private client-side utilities to optimize, resize, and compress your official documents.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-500 transition font-semibold text-sm">
              <Home className="h-4 w-4" /> Go to Homepage
            </Link>
          </div>
        </section>

        {/* Core Tool Links Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Upload your file and fix instantly using our core tools:</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/passport-size-photo-maker" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">🛂</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                Passport Photo Maker <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Make standard 3.5 x 4.5 cm passport size photos online for job forms.</p>
            </Link>
            <Link href="/pdf-under-500kb" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">📄</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                PDF Under 500KB <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Compress heavy scanned PDF marksheets and certificate files below 500KB.</p>
            </Link>
            <Link href="/11kb-converter" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 transition hover:shadow-md block group">
              <span className="text-2xl block mb-2">🖼️</span>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition flex items-center gap-1">
                11KB Image Converter <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-gray-500 mt-1">Resize signature scans and photos to exactly under 11KB limit.</p>
            </Link>
          </div>
        </section>

        {/* Content Block */}
        <section className="prose prose-blue max-w-none bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">SizeSnap Kya Hai? (Problem & Solution)</h2>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Kai online application forms jaise SSC, NEET, UPSC, banking (IBPS), aur college admissions portal me certificates upload karte waqt heavy restriction criteria aate hain. Normal mobile cameras se click ki gayi documents or photo files ki size ranges 2MB se 10MB tak hoti hain. Manual resizing complex computer programming softwares bina dynamic target ke resolve nahi kar pati hai.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              <strong>SizeSnap</strong> is standard workflow issue ko seamless interface se solve karta hai. Hum dynamic target-based compilers aur resizers offer karte hain jo custom ranges setup (jaise image under 50KB or PDF below 500KB) bina dynamic resolution degrade kiye instantly configure kar dete hain. <strong>Upload your file and fix instantly</strong>.
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-2xl font-bold text-gray-900">SizeSnap Par Core Tools Ka Use Case (Job Forms, SSC & NEET)</h2>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              Humare digital utility converters niche likhe sectors me candidates ki preference par design hain:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 mt-2 space-y-1">
              <li><strong>Government Forms (SSC CGL, CHSL, Railway):</strong> Signatures resize range strictly 10KB to 20KB aur photos correct physical dimensions (3.5x4.5 cm) presets ensure karein.</li>
              <li><strong>National Level Entrance Exams (NEET, JEE Mains):</strong> Card photo size requirements 100KB ya 200KB limit constraints resolve karne ke liye.</li>
              <li><strong>Document Transcripts:</strong> Certificates transcripts ko compile karke PDF merge ya compress under 500KB format me convert karne ke liye.</li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-2xl font-bold text-gray-900">100% Private Browser-Side Technology (Safety Guarantee)</h2>
            <p className="text-sm text-gray-600 leading-relaxed mt-2 flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                Privacy hamari absolute priority hai. SizeSnap online tools me files transfer or server copy save nahi hoti hain. Processing directly browser-side WebAssembly aur Canvas APIs local execution nodes me process hoti hai, jisse dynamic database safety 100% stable rehti hai.
              </span>
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Frequently Asked Questions (FAQs)
          </h2>
          <div className="space-y-4">
            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                <span>Kya SizeSnap ka use karne ke liye login ya payment zaroori hai?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
                Bilkul nahi. SizeSnap ek 100% free online tool suite hai. Yahan koi paywalls, registration steps, ya hidden subscription charges nahi hain. Aap bina login kiye unlimited compress aur download kar sakte hain.
              </p>
            </details>
            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                <span>Mera document SizeSnap servers par safe rehta hai kya?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
                SizeSnap 100% client-side technology par run karta hai. Iska matlab hai ki aapka koi bhi personal marksheet, Aadhaar scan, ya photo hamare server par upload hi nahi hota hai. Sabhi file processing directly aapke mobile ya computer browser ke RAM me local execute hoti hai.
              </p>
            </details>
            <details className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                <span>Mobile user SizeSnap tools kaise run karein?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
                Aap directly apne Android ya iPhone device ke Chrome/Safari browser me sizesnap.in search karke home screen se koi bhi utility tool open kar sakte hain. Upload button par tab karke file select karein aur direct fix download karein.
              </p>
            </details>
          </div>
        </section>

      </div>
    </>
  )
}

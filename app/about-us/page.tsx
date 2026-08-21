import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Zap, Lock, Code, ServerOff } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Who is the Owner of SizeSnap? | SizeSnap',
  description: 'Learn more about SizeSnap.in and its owner Pawan Prajapati. We build free, fast, and secure client-side tools for sizing images and processing PDFs.',
  alternates: {
    canonical: 'https://sizesnap.in/about-us'
  },
  openGraph: {
    title: 'About Us | Owner of SizeSnap - Pawan Prajapati',
    description: 'Free, fast, and secure client-side tools for sizing images and processing PDFs.',
    url: 'https://sizesnap.in/about-us',
    siteName: 'SizeSnap',
    locale: 'en_US',
    type: 'website',
  }
}

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://sizesnap.in/about-us',
        'url': 'https://sizesnap.in/about-us',
        'name': 'About SizeSnap.in',
        'description': 'Learn more about SizeSnap.in and its founder & owner Pawan Prajapati.'
      },
      {
        '@type': 'Person',
        '@id': 'https://sizesnap.in/about-us#founder',
        'name': 'Pawan Prajapati',
        'jobTitle': 'Owner, Founder & Developer',
        'url': 'https://sizesnap.in/about-us#founder',
        'knowsAbout': ['Web Development', 'Client-side Image Processing', 'PDF Optimization'],
        'worksFor': {
          '@type': 'Organization',
          'name': 'SizeSnap'
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">About SizeSnap.in</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            An entirely free and incredibly fast toolkit designed to help you process, resize, and compress images and PDFs natively in your browser.
          </p>
        </div>

        {/* Founder Bio Card */}
        <div id="founder" className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 flex-shrink-0 shadow-sm">
            <img 
              src="/pawan.jpeg" 
              alt="Pawan Prajapati" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Who is the owner of SizeSnap?</h2>
            <p className="text-blue-600 font-medium mb-4">Pawan Prajapati is the Owner and Founder of SizeSnap.in</p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Currently a B.Tech student, <strong>Pawan Prajapati</strong> is an active Software Development Engineer (SDE) candidate and the sole developer behind SizeSnap. 
              He built SizeSnap to help fellow students and job seekers resize passport photos and signature scans 
              for competitive exams (SSC CGL, RRB NTPC, UPSC, NEET) without uploading sensitive documents to third-party servers.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-50 p-6 rounded-xl text-center border border-slate-100">
            <ServerOff className="w-8 h-8 mx-auto text-indigo-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">100% Client-Side</h3>
            <p className="text-sm text-gray-600">Zero Server Storage. Your files never leave your device.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl text-center border border-slate-100">
            <Zap className="w-8 h-8 mx-auto text-amber-500 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">WASM Powered</h3>
            <p className="text-sm text-gray-600">Lightning fast local processing directly in your browser.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl text-center border border-slate-100">
            <Lock className="w-8 h-8 mx-auto text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Completely Free</h3>
            <p className="text-sm text-gray-600">No watermarks, no paywalls, and no login required.</p>
          </div>
        </div>

        <div className="prose prose-blue max-w-none">
          <h2>Who is this for?</h2>
          <p>This platform was meticulously designed for:</p>
          <ul>
            <li><strong>Students & Candidates:</strong> Submitting application portals (SSC, UPSC, NEET, Universities) that strictly demand 20KB to 50KB image and signature uploads.</li>
            <li><strong>Professionals:</strong> Dealing with strict email attachment limitations or e-filing payloads where PDFs must be reduced below a megabyte.</li>
            <li><strong>General Web Users:</strong> Anyone looking for a fast, no-nonsense utility that simply gets the job done securely in the quickest time possible.</li>
          </ul>
          
          <div className="mt-8 flex gap-4">
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition no-underline">
              Explore Tools
            </Link>
            <Link href="/contact" className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition no-underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

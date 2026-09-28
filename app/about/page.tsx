import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ServerOff, Zap, Lock } from 'lucide-react';

export const metadata = {
  title: 'About Us - Who is the Owner of SizeSnap? | SizeSnap',
  description: 'Learn more about SizeSnap, its mission, and its owner Pawan Prajapati. We build free, fast, and secure client-side tools for sizing images and processing PDFs.',
};

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://sizesnap.in/about-us',
        'url': 'https://sizesnap.in/about-us',
        'name': 'About SizeSnap',
        'description': 'Learn more about SizeSnap and its founder & owner Pawan Prajapati.'
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#414FA8] hover:underline mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
        </Link>
        <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">About SizeSnap</h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            SizeSnap is an entirely free and incredibly fast toolkit designed to help you process, resize, and compress images and PDFs natively in your browser.
          </p>

          <div id="founder" className="bg-[#FAFAFC] border border-gray-200 rounded-md p-6 flex flex-col md:flex-row gap-6 items-start mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 flex-shrink-0 relative">
              <Image 
                src="/pawan.jpeg" 
                alt="Pawan Prajapati" 
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Who is the owner of SizeSnap?</h2>
              <p className="text-[#414FA8] text-sm font-medium mb-3">Pawan Prajapati is the Owner and Founder of SizeSnap</p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Currently a B.Tech student, <strong>Pawan Prajapati</strong> is an active Software Development Engineer (SDE) candidate and the sole developer behind SizeSnap. 
                He built SizeSnap to help fellow students and job seekers resize passport photos and signature scans 
                for competitive exams (SSC CGL, RRB NTPC, UPSC, NEET) without uploading sensitive documents to third-party servers.
              </p>
            </div>
          </div>

          <h2 className="text-base font-bold text-gray-800 mb-3">Core Principles</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-200 p-4 rounded text-center bg-[#FAFAFC]">
              <ServerOff className="h-6 w-6 text-[#414FA8] mx-auto mb-2" />
              <h3 className="font-bold text-sm text-gray-900 mb-1">100% Client-Side</h3>
              <p className="text-xs text-gray-600">Zero Server Storage. Your files never leave your device.</p>
            </div>
            <div className="border border-gray-200 p-4 rounded text-center bg-[#FAFAFC]">
              <Zap className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-gray-900 mb-1">WASM Powered</h3>
              <p className="text-xs text-gray-600">Lightning fast local processing directly in your browser.</p>
            </div>
            <div className="border border-gray-200 p-4 rounded text-center bg-[#FAFAFC]">
              <Lock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-gray-900 mb-1">Completely Free</h3>
              <p className="text-xs text-gray-600">No watermarks, no paywalls, and no login required.</p>
            </div>
          </div>

          <h2 className="text-base font-bold text-gray-800 mb-2">Who is this for?</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-700 mb-6">
            <li><strong>Students & Candidates:</strong> Submitting application portals (SSC, UPSC, NEET, Universities) that strictly demand 20KB to 50KB image and signature uploads.</li>
            <li><strong>Professionals:</strong> Dealing with strict email attachment limitations or e-filing payloads where PDFs must be reduced below a megabyte.</li>
            <li><strong>General Web Users:</strong> Anyone looking for a fast, no-nonsense utility that simply gets the job done securely in the quickest time possible.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Secure Browser Processing | SizeSnap',
  description: 'Learn how SizeSnap protects your privacy. We process all files locally in your browser and do not upload your images or PDFs to any server.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#414FA8] hover:underline mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
        </Link>
        <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-6 w-6 text-[#414FA8]" />
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xs text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">1. Introduction</h2>
              <p>
                Welcome to SizeSnap (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), owned by Pawan Prajapati. We respect your privacy and are committed to protecting it. SizeSnap provides free, browser-based utilities for compressing, resizing, and converting images and PDF files.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">2. Absolute Privacy: No File Uploads</h2>
              <p className="mb-2"><strong>This is the core foundation of our service:</strong> We do not store or upload user files. All file processing happens 100% locally on your device, within your web browser. To ensure this, we leverage standard Web APIs such as HTML5 Canvas and WebAssembly. These technologies execute the compression scripts natively in your system&apos;s RAM without transferring data over the internet.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>No files are uploaded to any server.</strong></li>
                <li><strong>All processing is done securely in your browser.</strong></li>
                <li>We cannot see, access, or analyze the files you process.</li>
                <li>No login or registration is required to use any of our tools.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">3. Data Protection & Privacy Assurance</h2>
              <p>
                Because our scripts run entirely client-side, your personal documents (photos, signatures, IDs, PDFs) are inherently secure. Nothing is transmitted across our network regarding your file contents, ensuring unparalleled data protection.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">4. Cookies & Third-Party Services</h2>
              <p>
                We may utilize standard non-identifying telemetry or ad network cookies (like Google AdSense) to measure page load speeds and sustain the free services. You can disable cookies at any time in your browser settings.
              </p>
            </div>
            
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">5. Third-Party Links</h2>
              <p>
                SizeSnap may contain links to external sites. We are not responsible for the privacy practices of external web destinations.
              </p>
            </div>
            
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">6. Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:diplomawithbtech@gmail.com" className="text-[#414FA8] hover:underline">diplomawithbtech@gmail.com</a>.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

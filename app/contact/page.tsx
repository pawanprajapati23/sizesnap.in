import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Mail, Clock, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Contact Us & Support - SizeSnap',
  description: 'Get in touch with the SizeSnap team and owner Pawan Prajapati for support, feature suggestions, or feedback.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#414FA8] hover:underline mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
        </Link>
        <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Contact Us & Support</h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            Have a question, feedback, or feature request? Get in touch with the SizeSnap support team. We respond within 24 to 48 hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 rounded border border-gray-200 bg-[#FAFAFC] space-y-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#414FA8]" /> Website Owner Info
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Developer/Owner:</span>
                  <span className="font-semibold text-gray-800">Pawan Prajapati</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Profession:</span>
                  <span className="font-semibold text-gray-800">B.Tech Student & SDE Aspirant</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span>Email:</span>
                  <a href="mailto:diplomawithbtech@gmail.com" className="font-semibold text-[#414FA8] hover:underline">diplomawithbtech@gmail.com</a>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Response Time:</span>
                  <span className="font-semibold text-gray-800">24–48 hours</span>
                </div>
              </div>
              <a
                href="mailto:diplomawithbtech@gmail.com"
                className="w-full py-2 bg-[#414FA8] hover:bg-[#344085] text-white font-medium rounded transition-all text-center block text-sm"
              >
                Email Directly
              </a>
            </div>

            <div className="bg-amber-50/60 border border-amber-200 rounded p-5 space-y-3 flex flex-col justify-center">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700" /> Privacy & Data Note
              </h4>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                Because all files are processed locally via your browser, <strong>no files are uploaded to any server</strong>. We do not store, see, or have access to any images or PDFs you compress. If a file fails to load or process, we cannot inspect it unless you choose to send it via email attachments.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

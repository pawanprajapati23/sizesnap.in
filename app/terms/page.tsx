import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | SizeSnap',
  description: 'Read the Terms of Service for using SizeSnap. Understand your rights and responsibilities while using our free online image and PDF processing tools.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#414FA8] hover:underline mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
        </Link>
        <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-6 w-6 text-[#414FA8]" />
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-xs text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using SizeSnap (the &quot;Website&quot;), you accept and agree to be bound by the terms and provision of this agreement. SizeSnap is owned and operated by Pawan Prajapati.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">2. Use of Service (Free Tool Disclaimer)</h2>
              <p>
                SizeSnap provides free online tools to resize, compress, and convert images and PDF files directly in your web browser. This service is provided <strong>&quot;as is&quot; and &quot;as available&quot;</strong> without any warranties of any kind. We do not charge users for the utilization of these tools.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">3. User Responsibility & No File Storage</h2>
              <p>
                All processing is done securely in your browser. No files are uploaded to any server. Therefore, you are solely responsible for ensuring you have backups of your original files. Once a browser tab is closed, any unsaved processed files are immediately lost. You are completely responsible for the files you process and any consequences resulting from using modified files in official portals.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">4. Limitation of Liability</h2>
              <p>
                In no event shall SizeSnap, Pawan Prajapati, or associated developers be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of our tools. We hold <strong>no liability for data loss</strong>, corrupted files, rejected application forms due to incorrect dimensions, or any financial/professional damages resulting from tool usage.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">5. Lawful Use</h2>
              <p>
                You agree not to use SizeSnap to process illegal, obscene, defamatory, or copyright-infringing materials. SizeSnap reserves the right to block malicious traffic patterns or bots attempting to disrupt service availability.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">6. Service Availability & Modifications</h2>
              <p>
                While we strive to provide excellent service, we do not guarantee continuous or uninterrupted availability of the site. We reserve the right to modify, pause, or discontinue any feature without prior notice.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">7. Intellectual Property</h2>
              <p>
                The scripts, design, layout, and graphics of SizeSnap are the property of Pawan Prajapati. Copying, scraping, or redistributing the tool&apos;s source code without explicit permission is strictly prohibited.
              </p>
            </div>
            
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:diplomawithbtech@gmail.com" className="text-[#414FA8] hover:underline">diplomawithbtech@gmail.com</a>.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

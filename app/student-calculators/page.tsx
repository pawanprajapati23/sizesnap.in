import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import StudentCalculatorsClient from './StudentCalculatorsClient';

export const metadata: Metadata = {
  title: 'Student Calculators – Percentage, CGPA, SGPA & More | SizeSnap',
  description: 'Calculate percentages, CGPA, SGPA, attendance, exam marks and study hours with free online student calculators. Fast, simple and mobile-friendly tools.',
  alternates: {
    canonical: 'https://sizesnap.in/student-calculators',
  },
  openGraph: {
    title: 'Student Calculators – Percentage, CGPA, SGPA & More | SizeSnap',
    description: 'Calculate percentages, CGPA, SGPA, attendance, exam marks and study hours with free online student calculators. Fast, simple and mobile-friendly tools.',
    url: 'https://sizesnap.in/student-calculators',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Calculators – Percentage, CGPA, SGPA & More | SizeSnap',
    description: 'Calculate percentages, CGPA, SGPA, attendance, exam marks and study hours with free online student calculators. Fast, simple and mobile-friendly tools.',
  },
};

export default function StudentCalculatorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://sizesnap.in/' },
              { '@type': 'ListItem', 'position': 2, 'name': 'Student Calculators', 'item': 'https://sizesnap.in/student-calculators' }
            ]
          })
        }}
      />
      <Navbar />
      
      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs sm:text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#414FA8] transition-colors">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Student Calculators</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9">
            
            {/* Hero Section */}
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#414FA8]/5 rounded-full blur-xl pointer-events-none"></div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                Free Student Calculators
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-0 max-w-3xl leading-relaxed">
                A complete suite of free tools for students. Easily calculate percentages, convert CGPA and SGPA, check attendance requirements, estimate exam marks, and plan study hours—all directly in your browser.
              </p>
            </section>

            {/* Interactive Grid with Search */}
            <StudentCalculatorsClient />

            {/* Informational Section */}
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mt-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use These Calculators</h2>
              <div className="text-gray-700 space-y-4 text-sm sm:text-base leading-relaxed">
                <p>
                  Our student calculators are designed to be fast, accurate, and incredibly easy to use. Simply select the calculator that matches your need—whether it&apos;s converting your CGPA to a percentage, checking your current attendance status, or calculating the exact marks required in your final exam to achieve your target grade.
                </p>
                <p>
                  No sign-ups or downloads are required. All calculations happen instantly in your browser, ensuring privacy and lightning-fast performance across mobile phones, tablets, and desktop computers.
                </p>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Are these calculators completely free?</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Yes, all our student calculators are completely free to use without any limitations, subscriptions, or hidden charges.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do these calculators work for all universities?</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Yes! The CGPA and percentage calculators use standard formulas. If your university has a specific conversion factor (like multiplying by 9.5 or 10), our advanced calculators let you adjust the multiplier to match your specific university guidelines.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do I need internet access to use these tools?</h3>
                  <p className="text-gray-600 text-sm sm:text-base">You need internet access to load the page initially, but all calculation logic runs directly on your device, ensuring maximum speed and privacy.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I save my calculation results?</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Currently, results are displayed instantly on the screen but are not saved across sessions to ensure your privacy. You can easily take a screenshot if you need to keep a record.</p>
                </div>
              </div>
            </section>

          </div>

          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function CalculatorLayout({ title, description, children }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      
      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs sm:text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#414FA8] transition-colors">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/student-calculators" className="hover:text-[#414FA8] transition-colors">Student Calculators</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* Header Section */}
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#414FA8]/5 rounded-full blur-xl pointer-events-none"></div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-0 max-w-3xl leading-relaxed">
                {description}
              </p>
            </section>

            {/* Main Calculator Content */}
            {children}

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

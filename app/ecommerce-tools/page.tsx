import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'E-commerce Seller Tools | SizeSnap',
  description: 'Free online utilities for e-commerce sellers. Format shipping labels to A4, compress product images, and optimize for Meesho, Flipkart, and Amazon.',
};

export default function EcommerceToolsPage() {

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />
      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 max-w-7xl mx-auto">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">E-commerce Tools</span>
        </nav>

        <div className="max-w-7xl mx-auto text-center mb-8">
           <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] tracking-tight mb-2">
              E-commerce Seller Tools
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Free, client-side tools designed for sellers. Print shipping labels, compress product images, and streamline your workflow.
            </p>
        </div>

        {/* Similar to ToolDirectory but filtered or custom for sellers */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/tools/meesho-shipping-label-to-a4" className="block p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                 <h3 className="font-semibold text-[#333333] mb-1">Meesho Shipping Label to A4</h3>
                 <p className="text-sm text-gray-500">Print 4 labels per page easily.</p>
              </Link>
              <Link href="/tools/shipping-label-to-a4" className="block p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                 <h3 className="font-semibold text-[#333333] mb-1">Shipping Label to A4</h3>
                 <p className="text-sm text-gray-500">Generic label arranger.</p>
              </Link>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

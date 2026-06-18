'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Wrench } from 'lucide-react'
import { tools } from '@/lib/toolConfigs'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Image src="/logo.png" alt="SizeSnap Logo" width={32} height={32} className="w-8 h-8 object-contain" />
          SizeSnap
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/resize-image/to-50kb" className="hover:text-blue-600 transition-colors">Resize Image</Link>
          <Link href="/compress-pdf/to-100kb" className="hover:text-blue-600 transition-colors">Compress PDF</Link>
          <Link href="/compress-image/to-50kb" className="hover:text-blue-600 transition-colors">Compress Image</Link>
          <Link href="/#all-tools" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            All Tools
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {tools.map(tool => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}/${tool.variants[0].slug}`}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <span>{tool.icon}</span>
              {tool.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Image as ImageIcon, FileText, Shield, ArrowRight, Layers, FileCode2 } from 'lucide-react'

interface ToolMenuItem {
  label: string
  path: string
  icon: any
}

interface CategoryGroup {
  name: string
  items: ToolMenuItem[]
}

const CATEGORIES: CategoryGroup[] = [
  {
    name: 'Image Utilities',
    items: [
      { label: 'Resize Image to 50KB', path: '/resize-image-to-50kb', icon: ImageIcon },
      { label: 'Passport Photo Maker', path: '/passport-size-photo-maker', icon: ImageIcon },
      { label: 'Add Name & Date', path: '/add-name-and-date-on-photo-online', icon: ImageIcon },
      { label: 'Background Changer', path: '/change-photo-background-to-white', icon: ImageIcon },
      { label: '300 DPI Converter', path: '/convert-image-to-300-dpi', icon: ImageIcon }
    ]
  },
  {
    name: 'PDF & Documents',
    items: [
      { label: 'Compress PDF', path: '/compress-pdf-to-100kb', icon: FileText },
      { label: 'Extract PDF Pages', path: '/split-pdf-extract-pages', icon: FileText },
      { label: 'PDF to JPG images', path: '/pdf-to-jpg/extract', icon: FileText }
    ]
  },
  {
    name: 'Cards & Scans',
    items: [
      { label: 'Merge Aadhaar Card', path: '/merge-aadhaar-card-front-and-back', icon: Layers },
      { label: 'Remove Shadow from scan', path: '/remove-shadow-from-document', icon: Layers },
      { label: 'Sharpen Scanned Signature', path: '/sharpen-scanned-signature', icon: Layers }
    ]
  }
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50 shadow-xs border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      
      {/* Live Exam Alert Bar */}
      <div className="bg-slate-900 text-white text-[11px] md:text-xs py-2.5 px-4 font-medium shadow-inner flex items-center justify-center gap-2 text-center border-b border-slate-800">
        <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
        <span className="text-slate-300 truncate">Railway RRB, SSC MTS, and NEET resizers are active.</span>
        <Link href="/exam-photo-specifications" className="text-white hover:text-blue-300 underline font-bold shrink-0 flex items-center gap-0.5 ml-1 transition-colors">
          Specs List <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <header className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg text-slate-900 tracking-tight">
          <Image src="/logo.png" alt="SizeSnap Logo" width={30} height={30} className="w-7.5 h-7.5 object-contain" />
          <span>SizeSnap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 uppercase tracking-wider">
          <Link href="/resize-image-to-50kb" className="hover:text-blue-600 transition-colors">Resize Image</Link>
          <Link href="/compress-pdf-to-100kb" className="hover:text-blue-600 transition-colors">Compress PDF</Link>
          <Link href="/change-photo-background-to-white" className="hover:text-blue-600 transition-colors">Background Changer</Link>
          <Link href="/#all-tools" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-xs text-center lowercase first-letter:uppercase tracking-normal font-semibold">
            All Tools
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
      </header>

      {/* Slide-over Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-100 animate-slideIn">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-150">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Image src="/logo.png" alt="SizeSnap Logo" width={24} height={24} className="w-6 h-6 object-contain" />
                <span className="text-sm">Navigation Menu</span>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Categories List */}
            <div className="flex-1 py-6 space-y-6 overflow-y-auto">
              {CATEGORIES.map(category => (
                <div key={category.name} className="space-y-2">
                  <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map(item => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.label}
                          href={item.path}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all"
                        >
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-150 space-y-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Client-Side Safe</span>
              </div>
              <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                <Link href="/about-us" onClick={() => setMenuOpen(false)} className="hover:text-slate-600">About</Link>
                <Link href="/privacy-policy" onClick={() => setMenuOpen(false)} className="hover:text-slate-600">Privacy</Link>
                <Link href="/terms-of-service" onClick={() => setMenuOpen(false)} className="hover:text-slate-600">Terms</Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

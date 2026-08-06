'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Image as ImageIcon, FileText, Shield, ArrowRight, Layers, FileCode2, ScanText, Lock, Unlock, RotateCw, Crop, Sparkles, Zap, Printer, FileCheck, Fingerprint, Hash } from 'lucide-react'

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
    name: '⚡ Sarkari Exam & Pro Studio',
    items: [
      { label: '1-Click Exam Pack Generator', path: '/sarkari-exam-pack-generator', icon: Zap },
      { label: 'Thumb Impression Resizer (LTI/RTI)', path: '/thumb-impression-resizer-for-ssc-and-neet', icon: Fingerprint },
      { label: 'Photo & Signature Joint Maker', path: '/combine-photo-and-signature-for-exam', icon: Layers },
      { label: 'Marksheet & ID 1-Page A4 Merger', path: '/merge-marksheet-and-aadhaar-card-pdf', icon: FileText },
      { label: 'Add Name & Date (DOP) on Photo', path: '/add-name-and-date-on-photo-for-ssc', icon: ImageIcon },
      { label: 'Signature Ink Converter & BG Remover', path: '/make-signature-transparent-and-convert-ink', icon: Sparkles },
      { label: 'Sarkari Exam Age Calculator', path: '/sarkari-exam-age-calculator', icon: Shield },
      { label: '4x6 / A4 Print Sheet Maker', path: '/passport-photo-print-sheet-maker', icon: Printer },
      { label: 'Photo AI Compliance Checker', path: '/photo-compliance-checker', icon: FileCheck }
    ]
  },
  {
    name: 'Image & AI Tools',
    items: [
      { label: 'Photo Clarifier & Unblur', path: '/unblur-photo-and-marksheet', icon: Sparkles },
      { label: 'Resize in CM, MM & Inches', path: '/resize-image-in-cm-and-mm', icon: ImageIcon },
      { label: 'Resize to 50KB / 20KB', path: '/resize-image-to-50kb', icon: ImageIcon },
      { label: 'Passport Photo Maker', path: '/passport-size-photo-maker', icon: ImageIcon },
      { label: 'AI Background Remover', path: '/remove-background-to-transparent', icon: Sparkles },
      { label: 'Crop & Circle Avatar', path: '/crop-image-to-square', icon: Crop },
      { label: 'Add Name & Date on Photo', path: '/add-name-and-date-on-photo-online', icon: ImageIcon },
      { label: '300 DPI Converter', path: '/convert-image-to-300-dpi', icon: ImageIcon }
    ]
  },
  {
    name: 'PDF Security & Utilities',
    items: [
      { label: 'Add Page Numbers to PDF', path: '/add-page-numbers-to-pdf-online', icon: Hash },
      { label: 'Merge PDF Online', path: '/merge-pdf-online', icon: FileText },
      { label: 'JPG to PDF Converter', path: '/jpg-to-pdf', icon: FileText },
      { label: 'PDF to JPG Converter', path: '/pdf-to-jpg', icon: FileText },
      { label: 'Compress PDF (100KB/200KB)', path: '/compress-pdf-to-100kb', icon: FileText },
      { label: 'Lock & Protect PDF', path: '/password-protect-pdf', icon: Lock },
      { label: 'Unlock Protected PDF', path: '/unlock-pdf-remove-password', icon: Unlock },
      { label: 'Rotate & Reorder Pages', path: '/rotate-and-reorder-pdf-pages', icon: RotateCw },
      { label: 'Extract PDF Pages', path: '/split-pdf-extract-pages', icon: FileText }
    ]
  },
  {
    name: 'Cards & Smart OCR',
    items: [
      { label: 'OCR Text Extractor', path: '/ocr-extract-text-from-marksheet', icon: ScanText },
      { label: 'Merge Aadhaar Front & Back', path: '/merge-aadhaar-card-front-and-back', icon: Layers },
      { label: 'Remove Shadow from scan', path: '/remove-shadow-from-document', icon: Layers },
      { label: 'Sharpen Scanned Signature', path: '/sharpen-scanned-signature', icon: Layers }
    ]
  }
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
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
            <Link href="/resize-image-to-50kb" className={`hover:text-blue-600 transition-colors ${pathname === '/resize-image-to-50kb' ? 'text-blue-600' : ''}`}>Resize Image</Link>
            <Link href="/compress-pdf-to-100kb" className={`hover:text-blue-600 transition-colors ${pathname === '/compress-pdf-to-100kb' ? 'text-blue-600' : ''}`}>Compress PDF</Link>
            <Link href="/change-photo-background-to-white" className={`hover:text-blue-600 transition-colors ${pathname === '/change-photo-background-to-white' ? 'text-blue-600' : ''}`}>Background Changer</Link>
            <Link href="/#all-tools" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-xs text-center lowercase first-letter:uppercase tracking-normal font-semibold">
              All Tools
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
        </header>
      </div>

      {/* Slide-over Mobile Navigation Drawer - Moved outside sticky backdrop-blur container */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs animate-backdropFade"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 animate-slideIn">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-2.5 font-extrabold text-slate-900">
                <Image src="/logo.png" alt="SizeSnap Logo" width={24} height={24} className="w-6 h-6 object-contain" />
                <span className="text-base tracking-tight">Navigation</span>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Categories List */}
            <div className="flex-1 py-5 space-y-6 overflow-y-auto min-h-0 scrollbar-thin">
              {CATEGORIES.map(category => (
                <div key={category.name} className="space-y-2">
                  <h3 className="text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map(item => {
                      const Icon = item.icon
                      const isActive = pathname === item.path
                      return (
                        <Link
                          key={item.label}
                          href={item.path}
                          onClick={() => setMenuOpen(false)}
                          className={`group flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none ${
                            isActive 
                              ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 rounded-l-none' 
                              : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                          }`}
                        >
                          <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                            isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-200/60 space-y-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Client-Side Safe</span>
              </div>
              <div className="flex justify-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Link href="/about-us" onClick={() => setMenuOpen(false)} className="hover:text-slate-700 transition-colors">About</Link>
                <Link href="/privacy-policy" onClick={() => setMenuOpen(false)} className="hover:text-slate-700 transition-colors">Privacy</Link>
                <Link href="/terms-of-service" onClick={() => setMenuOpen(false)} className="hover:text-slate-700 transition-colors">Terms</Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

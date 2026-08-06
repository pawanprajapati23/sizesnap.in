'use client'
import { useState } from 'react'
import {
  Share2,
  Bookmark,
  Smartphone,
  Copy,
  Check,
  Zap,
  MessageCircle
} from 'lucide-react'

export default function ViralShareWidget() {
  const [copied, setCopied] = useState(false)

  const shareText = encodeURIComponent(
    'Bhai Sarkari Exam (SSC, NEET, UPSC, Police) form ke liye Photo (with Name/Date), Signature aur PDF ko 1-Click me resize karne ka best free tool: https://sizesnap.in'
  )

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://sizesnap.in')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-500/20 shadow-2xl relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left text */}
        <div className="lg:col-span-7 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Share with Study Groups & Cyber Cafes
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Helping Friends Prepare for Sarkari Exam Forms?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Share SizeSnap with your WhatsApp study groups or bookmark it on your Cyber Cafe PC for instant 1-click form formatting.
          </p>
        </div>

        {/* Right buttons */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
          {/* WhatsApp Direct Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Share on WhatsApp
          </a>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

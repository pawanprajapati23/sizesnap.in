'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Download, X, Sparkles, ShieldCheck } from 'lucide-react'

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if previously dismissed in session
    const dismissed = sessionStorage.getItem('sizesnap_pwa_dismissed')
    if (dismissed) return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('sizesnap_pwa_dismissed', 'true')
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-bounce-short">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 shrink-0 flex items-center justify-center shadow-md">
            <Image
              src="/logo.png"
              alt="SizeSnap App"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-black text-white tracking-tight">
                Install SizeSnap App
              </h4>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-500/30 text-blue-300 rounded">
                0 MB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Instant 1-Tap launch & 100% offline tools
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Dismiss app install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

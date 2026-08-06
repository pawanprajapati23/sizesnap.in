'use client'
import { useEffect, useState } from 'react'
import { WifiOff, Download, X, CheckCircle2 } from 'lucide-react'

export default function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check for worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('SizeSnap: New version available. Refresh to update.')
                }
              }
            }
          }
        })
        .catch((err) => {
          console.warn('SizeSnap ServiceWorker registration error:', err)
        })
    }

    // 2. Monitor Online/Offline Status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    // 3. PWA Install Prompt Listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Check if user previously dismissed
      const dismissed = localStorage.getItem('sizesnap_pwa_dismissed')
      if (!dismissed) {
        setShowInstallBanner(true)
      }
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallBanner(false)
    }
    setDeferredPrompt(null)
  }

  const dismissInstall = () => {
    setShowInstallBanner(false)
    localStorage.setItem('sizesnap_pwa_dismissed', 'true')
  }

  return (
    <>
      {/* Offline Status Alert */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 bg-amber-900/90 backdrop-blur-md text-amber-100 border border-amber-500/30 px-4 py-2.5 rounded-xl shadow-xl animate-fadeIn text-xs sm:text-sm font-medium">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span>Offline Mode Active: SizeSnap works 100% privately on your device.</span>
        </div>
      )}

      {/* PWA Install Floating Banner */}
      {showInstallBanner && !installed && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl animate-fadeIn flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-100">Install SizeSnap App</p>
            <p className="text-[11px] text-slate-400 line-clamp-1">Faster access & 100% offline tools</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition shadow-sm"
          >
            Install
          </button>
          <button
            onClick={dismissInstall}
            className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )
}

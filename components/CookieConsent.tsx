'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if consent is already given
    if (!localStorage.getItem('sizesnap_cookie_consent')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('sizesnap_cookie_consent', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-3 sm:p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-50 animate-in slide-in-from-bottom-5">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="text-[11px] sm:text-sm text-gray-300 leading-snug sm:leading-normal">
          <p>
            <strong className="text-white">We use cookies:</strong> This site uses cookies to ensure the best experience and serve personalized ads.
            <span className="hidden md:inline"> All file processing happens locally in your browser.</span>
            <Link href="/privacy-policy" className="underline ml-1 text-white hover:text-blue-300">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={accept}
            className="bg-blue-600 hover:bg-blue-700 font-bold px-3 py-1.5 sm:px-6 sm:py-2 rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">Got it</span>
            <span className="hidden sm:inline">I Accept</span>
          </button>
        </div>
      </div>
    </div>
  )
}

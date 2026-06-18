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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-xl z-50 animate-in slide-in-from-bottom-5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p>
            <strong>We use cookies:</strong> This website uses cookies and local storage to ensure you get the best experience, including personalized ads by Google AdSense. 
            All file processing happens locally in your browser. 
            <Link href="/privacy-policy" className="underline ml-1 hover:text-blue-300">Read our Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={accept}
            className="bg-blue-600 hover:bg-blue-700 font-bold px-6 py-2 rounded text-sm transition-colors whitespace-nowrap"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  )
}

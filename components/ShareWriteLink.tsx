'use client'

import { Share2, Check } from 'lucide-react'
import { useState } from 'react'

export function ShareWriteLink() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = 'https://sizesnap.in/blog/write'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Write a Guest Post on SizeSnap',
          text: 'Share your tips and guides on SizeSnap! Submit a guest post here:',
          url: url
        })
      } catch (err) {
        // Fallback to copy if share is cancelled/fails
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      title="Share the Write Post link"
    >
      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Invite Writers'}</span>
    </button>
  )
}

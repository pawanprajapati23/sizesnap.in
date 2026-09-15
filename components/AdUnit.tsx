'use client'
import { useEffect } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

export default function AdUnit({ slot, format = 'auto', className = '' }: Props) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  // During development, show placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ minHeight: format === 'rectangle' ? '250px' : '90px' }}>
        📢 Ad Unit — Slot: {slot}
      </div>
    )
  }

  return (
    <div className={className} style={{ minHeight: format === 'rectangle' ? '250px' : '90px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5696239388754680"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

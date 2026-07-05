'use client'
import { useState, useRef, useEffect } from 'react'

interface Props {
  originalUrl: string
  resultUrl: string
  className?: string
}

export default function CompareSlider({ originalUrl, resultUrl, className = '' }: Props) {
  const [sliderPosition, setSliderPosition] = useState(50) // percentage value
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  return (
    <div 
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center ${className}`}
      style={{ touchAction: 'none' }}
    >
      <div className="relative w-full max-h-80 md:max-h-96 flex items-center justify-center p-2">
        {/* Original (Before) Image - Bottom Layer */}
        <img 
          src={originalUrl} 
          alt="Original" 
          className="max-h-80 md:max-h-96 w-auto object-contain select-none pointer-events-none"
        />
        
        {/* Overlay holding the Compressed (After) Image - Top Layer */}
        <div 
          className="absolute inset-y-2 left-0 right-0 overflow-hidden flex justify-center"
          style={{ 
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <img 
            src={resultUrl} 
            alt="Compressed" 
            className="max-h-80 md:max-h-96 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* Labels */}
        <span className="absolute bottom-4 right-4 bg-gray-950/70 text-white font-bold text-[10px] px-2.5 py-1 rounded backdrop-blur-sm z-10 pointer-events-none uppercase tracking-wider shadow-sm">
          After
        </span>
        <span className="absolute bottom-4 left-4 bg-blue-600/80 text-white font-bold text-[10px] px-2.5 py-1 rounded backdrop-blur-sm z-10 pointer-events-none uppercase tracking-wider shadow-sm">
          Before
        </span>

        {/* Drag Handle Line */}
        <div 
          className="absolute inset-y-0 z-20 w-[2px] bg-white cursor-ew-resize hover:bg-blue-400 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Handle Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white text-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg select-none font-bold text-sm pointer-events-none">
            ↔
          </div>
        </div>
      </div>
    </div>
  )
}

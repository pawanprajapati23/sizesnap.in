'use client'
import { useState, useEffect } from 'react'
import { Download, FolderDown, X, FileCheck, ExternalLink } from 'lucide-react'

export interface DownloadedItem {
  id: string
  name: string
  url: string
  sizeKb: number
  type: string
}

export default function SessionDownloadTray() {
  const [items, setItems] = useState<DownloadedItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Listen for custom dispatch events when user downloads files from any tool
    const handleFileAdded = (e: CustomEvent<DownloadedItem>) => {
      if (e.detail && e.detail.url) {
        setItems((prev) => [e.detail, ...prev.filter((p) => p.name !== e.detail.name)])
        setIsOpen(true)
      }
    }

    window.addEventListener('sizesnap_file_ready' as any, handleFileAdded)
    return () => {
      window.removeEventListener('sizesnap_file_ready' as any, handleFileAdded)
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 rounded-full bg-slate-900 text-white border border-slate-700 shadow-xl flex items-center gap-2 hover:bg-blue-600 transition-all text-xs font-bold"
        >
          <FolderDown className="w-4 h-4 text-emerald-400" />
          <span>Session Files ({items.length})</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl w-80 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <FolderDown className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                Session Files ({items.length})
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
            {items.map((item) => (
              <div
                key={item.id || item.name}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                    {item.name}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {item.sizeKb} KB · {item.type}
                  </span>
                </div>
                <a
                  href={item.url}
                  download={item.name}
                  className="p-1.5 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 rounded-lg transition-colors shrink-0"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setItems([])}
              className="text-rose-500 hover:underline font-medium"
            >
              Clear Tray
            </button>
            <span className="text-slate-400">Saved in browser</span>
          </div>
        </div>
      )}
    </div>
  )
}

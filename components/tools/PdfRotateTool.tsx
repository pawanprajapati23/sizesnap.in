'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Download,
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Layers,
  LayoutGrid
} from 'lucide-react'
import { PDFDocument, degrees } from 'pdf-lib'

interface PageItem {
  pageIndex: number // 0-based original index
  thumbnailUrl: string
  rotation: number // 0, 90, 180, 270
}

type Status = 'idle' | 'loading_pages' | 'editing' | 'saving' | 'done' | 'error'

export default function PdfRotateTool() {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageItem[]>([])
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSize, setResultSize] = useState<number>(0)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [dragOver, setDragOver] = useState<boolean>(false)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      pages.forEach((p) => {
        if (p.thumbnailUrl) URL.revokeObjectURL(p.thumbnailUrl)
      })
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [pages, resultUrl])

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid PDF document.')
      setStatus('error')
      return
    }

    if (file.size > 80 * 1024 * 1024) {
      setErrorMsg('PDF file too large (Max 80MB).')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    setStatus('loading_pages')
    setErrorMsg('')
    setLoadingProgress(10)

    try {
      // Dynamically load pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      const totalPages = pdf.numPages

      const items: PageItem[] = []

      for (let i = 1; i <= totalPages; i++) {
        setLoadingProgress(10 + Math.round((i / totalPages) * 80))
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 0.5 })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: context, viewport, canvas: canvas } as any).promise

        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.85))
        if (blob) {
          const url = URL.createObjectURL(blob)
          items.push({
            pageIndex: i - 1,
            thumbnailUrl: url,
            rotation: 0
          })
        }
      }

      setPages(items)
      setStatus('editing')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Failed to render PDF pages.')
      setStatus('error')
    }
  }

  // Rotate single page
  const rotatePage = (index: number, angleDelta: number) => {
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p
        const nextRotation = (p.rotation + angleDelta + 360) % 360
        return { ...p, rotation: nextRotation }
      })
    )
  }

  // Rotate all pages
  const rotateAllPages = (angleDelta: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + angleDelta + 360) % 360
      }))
    )
  }

  // Move page position
  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return
    setPages((prev) => {
      const next = [...prev]
      const [removed] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, removed)
      return next
    })
  }

  // Delete page
  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      setErrorMsg('PDF must have at least 1 page.')
      return
    }
    setPages((prev) => prev.filter((_, i) => i !== index))
  }

  // Save and generate new organized PDF
  const handleSavePdf = async () => {
    if (!originalFile || pages.length === 0) return

    setStatus('saving')
    setErrorMsg('')

    try {
      const buffer = await originalFile.arrayBuffer()
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
      const newDoc = await PDFDocument.create()

      // Copy pages in the new order and apply rotation
      for (const pageItem of pages) {
        const [copiedPage] = await newDoc.copyPages(srcDoc, [pageItem.pageIndex])
        
        if (pageItem.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle
          copiedPage.setRotation(degrees((currentRotation + pageItem.rotation) % 360))
        }

        newDoc.addPage(copiedPage)
      }

      const pdfBytes = await newDoc.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(url)
      setResultSize(blob.size)
      setStatus('done')

      // Download
      const a = document.createElement('a')
      a.href = url
      a.download = `reordered-${originalFile.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Failed to save reorganized PDF.')
      setStatus('error')
    }
  }

  const resetAll = () => {
    setStatus('idle')
    setOriginalFile(null)
    setPages([])
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setErrorMsg('')
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-2">
            <LayoutGrid className="w-3.5 h-3.5" />
            Visual Page Reorder & Rotation
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rotate & Reorder PDF Pages Online</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rotate individual or all pages, delete unwanted pages, and reorder document sequence visually.
          </p>
        </div>

        {status !== 'idle' && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Upload New PDF
          </button>
        )}
      </div>

      {/* Upload Zone */}
      {status === 'idle' && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0])
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            accept="application/pdf"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
            <RotateCw className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Select PDF Document to Organize
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports multi-page documents (Up to 80MB)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% In-Browser Privacy
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Visual Thumbnails
            </span>
          </div>
        </div>
      )}

      {/* Loading PDF pages state */}
      {status === 'loading_pages' && (
        <div className="mt-8 p-10 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Rendering visual page thumbnails...</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{loadingProgress}% completed</p>
          </div>
        </div>
      )}

      {/* Editing State — Interactive Grid */}
      {(status === 'editing' || status === 'saving' || status === 'done') && (
        <div className="mt-6 space-y-6">
          {/* Global Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Total Pages: {pages.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => rotateAllPages(-90)}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 cursor-pointer transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Rotate All -90°
              </button>

              <button
                type="button"
                onClick={() => rotateAllPages(90)}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 cursor-pointer transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Rotate All +90°
              </button>

              <button
                type="button"
                onClick={handleSavePdf}
                disabled={status === 'saving'}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                {status === 'saving' ? 'Generating PDF...' : 'Download Organized PDF'}
              </button>
            </div>
          </div>

          {/* Visual Page Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((page, idx) => (
              <div
                key={page.pageIndex}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-xs hover:shadow-md transition flex flex-col items-center justify-between gap-3 group"
              >
                {/* Page Number & Delete */}
                <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Page {idx + 1}</span>
                  <button
                    onClick={() => deletePage(idx)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer transition"
                    title="Delete page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail with rotation */}
                <div className="w-full h-44 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={page.thumbnailUrl}
                    alt={`Page ${idx + 1}`}
                    className="max-h-full max-w-full object-contain rounded transition-transform duration-300"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  />
                </div>

                {/* Card Controls */}
                <div className="w-full flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => rotatePage(idx, -90)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer transition"
                      title="Rotate counter-clockwise"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => rotatePage(idx, 90)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer transition"
                      title="Rotate clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePage(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer transition"
                      title="Move earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePage(idx, idx + 1)}
                      disabled={idx === pages.length - 1}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer transition"
                      title="Move later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Success Banner */}
          {status === 'done' && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Reorganized PDF saved and downloaded! Size: <strong>{Math.round(resultSize / 1024)} KB</strong>.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg || 'An error occurred while organizing the PDF.'}</span>
        </div>
      )}
    </div>
  )
}

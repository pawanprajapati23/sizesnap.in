'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Download,
  Copy,
  Check,
  RefreshCw,
  FileText,
  ScanText,
  Sparkles,
  ShieldCheck,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Sliders,
  AlignLeft,
  Share2
} from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface Props {
  config?: any
}

type Status = 'idle' | 'preprocessing' | 'recognizing' | 'done' | 'error'

export default function OcrTextExtractorTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [progressMsg, setProgressMsg] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [language, setLanguage] = useState<'eng' | 'hin' | 'eng+hin'>('eng')
  const [dragOver, setDragOver] = useState<boolean>(false)

  // OCR Preprocessing settings
  const [autoContrast, setAutoContrast] = useState<boolean>(true)
  const [removeNoise, setRemoveNoise] = useState<boolean>(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // Clean URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
    }
  }, [originalUrl])

  // Handle uploaded file
  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a clear JPG, PNG, or WEBP image of the document or marksheet.')
      setStatus('error')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Image size too large. Please upload an image under 20MB.')
      setStatus('error')
      return
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl)
    const url = URL.createObjectURL(file)
    setOriginalFile(file)
    setOriginalUrl(url)
    setErrorMsg('')
    runOcrPipeline(file, url)
  }

  // Preprocess Image and Run Optical Character Recognition
  const runOcrPipeline = async (file: File, fileUrl: string) => {
    setStatus('preprocessing')
    setProgress(15)
    setProgressMsg('Enhancing image contrast & thresholding...')

    try {
      // 1. Load image onto canvas for binarization & contrast enhancement
      const img = new Image()
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image.'))
        img.src = fileUrl
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height
      ctx.drawImage(img, 0, 0)

      if (autoContrast) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          // High contrast black & white separation for clearer text glyphs
          const binarized = avg > 140 ? 255 : Math.max(0, avg * 0.7)
          data[i] = binarized
          data[i + 1] = binarized
          data[i + 2] = binarized
        }
        ctx.putImageData(imgData, 0, 0)
      }

      setProgress(35)
      setProgressMsg('Initializing client-side OCR engine...')
      setStatus('recognizing')

      // 2. Load Tesseract.js dynamically from CDN to maintain zero bundle penalty
      let Tesseract: any = (window as any).Tesseract
      if (!Tesseract) {
        setProgressMsg('Loading lightweight OCR module (cached locally)...')
        // Dynamically load Tesseract script
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Unable to initialize OCR parser.'))
          document.head.appendChild(script)
        })
        Tesseract = (window as any).Tesseract
      }

      setProgress(50)
      setProgressMsg('Recognizing text characters and sentences...')

      const processedDataUrl = canvas.toDataURL('image/png')
      const langParam = language === 'eng+hin' ? 'eng+hin' : language === 'hin' ? 'hin' : 'eng'

      const worker = await Tesseract.createWorker(langParam, 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text' && m.progress) {
            setProgress(50 + Math.round(m.progress * 45))
            setProgressMsg(`Reading text (${Math.round(m.progress * 100)}%)...`)
          }
        }
      })

      const ret = await worker.recognize(processedDataUrl)
      await worker.terminate()

      const text = ret.data.text.trim()
      setExtractedText(text || 'No legible text could be detected. Please ensure the document is clear and well-lit.')
      setProgress(100)
      setStatus('done')
    } catch (err: any) {
      console.error('OCR Error:', err)
      setErrorMsg(err.message || 'OCR recognition failed. Please try a clearer picture.')
      setStatus('error')
    }
  }

  // Copy extracted text
  const handleCopy = () => {
    if (!extractedText) return
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download as TXT
  const handleDownloadTxt = () => {
    if (!extractedText) return
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `extracted-text-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download as Clean PDF Document
  const handleDownloadPdf = async () => {
    if (!extractedText) return
    try {
      const pdfDoc = await PDFDocument.create()
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      let page = pdfDoc.addPage([595.28, 841.89]) // A4
      const { width, height } = page.getSize()

      const fontSize = 11
      const lineHeight = 16
      const margin = 50
      const maxLineWidth = width - margin * 2

      const lines = extractedText.split('\n')
      let y = height - margin

      for (const line of lines) {
        // Simple word wrap
        const words = line.split(' ')
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const lineWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize)

          if (lineWidth > maxLineWidth) {
            if (y < margin + lineHeight) {
              page = pdfDoc.addPage([595.28, 841.89])
              y = height - margin
            }
            page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont, color: rgb(0.1, 0.1, 0.1) })
            y -= lineHeight
            currentLine = word
          } else {
            currentLine = testLine
          }
        }

        if (currentLine) {
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([595.28, 841.89])
            y = height - margin
          }
          page.drawText(currentLine, { x: margin, y, size: fontSize, font: timesRomanFont, color: rgb(0.1, 0.1, 0.1) })
          y -= lineHeight
        }
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ocr-extracted-document.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (pdfErr) {
      console.error(pdfErr)
    }
  }

  // Formatting Cleaners
  const cleanWhitespace = () => {
    setExtractedText((prev) => prev.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim())
  }

  const removeLineBreaks = () => {
    setExtractedText((prev) => prev.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').trim())
  }

  const resetAll = () => {
    setStatus('idle')
    setOriginalFile(null)
    setOriginalUrl(null)
    setExtractedText('')
    setErrorMsg('')
    setProgress(0)
  }

  // Word and Character Counts
  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0
  const charCount = extractedText.length

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold mb-2">
            <ScanText className="w-3.5 h-3.5" />
            100% Client-Side OCR Engine
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Document & Image OCR Text Extractor</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Extract text from marksheet scans, certificates, books, and ID cards with instant copy & PDF export.
          </p>
        </div>

        {status !== 'idle' && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Extract Another Image
          </button>
        )}
      </div>

      {/* Language & Settings Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">OCR Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="eng">English (General Docs & Marks)</option>
            <option value="hin">Hindi (हिन्दी दस्तावेज़)</option>
            <option value="eng+hin">English + Hindi (Mixed)</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoContrast}
              onChange={(e) => setAutoContrast(e.target.checked)}
              className="rounded accent-emerald-600 cursor-pointer"
            />
            <span>Auto Contrast Binarization</span>
          </label>
        </div>
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
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-pulse">
            <ScanText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Upload Document Image or Marksheet Photo
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports Marksheets, Certificates, Invoices, Aadhaar text, Handwritten notes (Up to 20MB)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Private (No External Uploads)
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              WASM Engine
            </span>
          </div>
        </div>
      )}

      {/* Processing State */}
      {(status === 'preprocessing' || status === 'recognizing') && (
        <div className="mt-8 p-8 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{progressMsg}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Processing locally on device</p>
          </div>
          <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Done State — Extracted Text Workspace */}
      {status === 'done' && (
        <div className="mt-6 space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span>Words: <strong className="text-slate-900 dark:text-slate-100">{wordCount}</strong></span>
              <span>•</span>
              <span>Characters: <strong className="text-slate-900 dark:text-slate-100">{charCount}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={cleanWhitespace}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer transition"
                title="Remove extra spaces"
              >
                Clean Spaces
              </button>

              <button
                onClick={removeLineBreaks}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer transition"
                title="Merge paragraphs into single continuous line"
              >
                Single Line
              </button>

              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={12}
              className="w-full p-4 text-sm font-mono text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition leading-relaxed"
              placeholder="Extracted text will appear here..."
            />
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            <button
              onClick={handleDownloadTxt}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download .TXT File
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export to Clean PDF
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-500/20 rounded-xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg || 'An error occurred during OCR recognition.'}</span>
        </div>
      )}
    </div>
  )
}

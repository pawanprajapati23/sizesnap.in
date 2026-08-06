'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Sparkles,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Hash,
  Layers
} from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

type PositionType = 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-right'
type StyleType = 'page-of-n' | 'number-only' | 'roll-number'

export default function PdfPageNumbererTool({ config }: { config?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)

  const [position, setPosition] = useState<PositionType>('bottom-right')
  const [style, setStyle] = useState<StyleType>('page-of-n')
  const [rollNumber, setRollNumber] = useState<string>('ROLL-12345')
  const [fontSize, setFontSize] = useState<number>(10)
  const [startFromPage, setStartFromPage] = useState<number>(1)

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) return
    setFile(f)
    const arrayBuffer = await f.arrayBuffer()
    setPdfBytes(arrayBuffer)

    try {
      const pdf = await PDFDocument.load(arrayBuffer)
      setPageCount(pdf.getPageCount())
    } catch (e) {
      console.error(e)
    }
  }

  const generateNumberedPdf = useCallback(async () => {
    if (!pdfBytes) return
    setIsProcessing(true)

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes)
      const pages = pdfDoc.getPages()
      const total = pages.length
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

      for (let i = 0; i < total; i++) {
        const pageIndex = i + 1
        if (pageIndex < startFromPage) continue

        const page = pages[i]
        const { width, height } = page.getSize()

        let text = ''
        if (style === 'page-of-n') {
          text = `Page ${pageIndex} of ${total}`
        } else if (style === 'number-only') {
          text = `${pageIndex}`
        } else if (style === 'roll-number') {
          text = `${rollNumber.toUpperCase()} | Page ${pageIndex} of ${total}`
        }

        const textWidth = font.widthOfTextAtSize(text, fontSize)
        const textHeight = font.heightAtSize(fontSize)

        let x = 0
        let y = 0
        const margin = 25

        if (position === 'bottom-right') {
          x = width - margin - textWidth
          y = margin
        } else if (position === 'bottom-center') {
          x = (width - textWidth) / 2
          y = margin
        } else if (position === 'bottom-left') {
          x = margin
          y = margin
        } else if (position === 'top-right') {
          x = width - margin - textWidth
          y = height - margin - textHeight
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.25, 0.35)
        })
      }

      const modifiedPdfBytes = await pdfDoc.save()
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })
      const outUrl = URL.createObjectURL(blob)
      setOutputUrl(outUrl)
      const finalKb = Math.round(blob.size / 1024)
      setOutputSize(finalKb)

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('sizesnap_file_ready', {
            detail: {
              id: Date.now().toString(),
              name: `numbered-${file?.name || 'document.pdf'}`,
              url: outUrl,
              sizeKb: finalKb,
              type: 'Numbered PDF Document'
            }
          })
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }, [pdfBytes, position, style, rollNumber, fontSize, startFromPage, file])

  useEffect(() => {
    if (pdfBytes) {
      generateNumberedPdf()
    }
  }, [pdfBytes, position, style, rollNumber, fontSize, startFromPage, generateNumberedPdf])

  return (
    <div className="space-y-6">
      {/* Upload Screen */}
      {!pdfBytes && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-300 dark:border-blue-700/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/40 rounded-3xl p-10 text-center cursor-pointer transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Hash className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Upload PDF to Add Page Numbers
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Insert official page numbering, candidate roll numbers, and headers onto multi-page PDF documents locally in your browser.
          </p>
          <button className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> Select PDF Document
          </button>
        </div>
      )}

      {/* Editor & Studio */}
      {pdfBytes && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-600" />
                Page Numbering Settings
              </h3>
              <button
                onClick={() => {
                  setPdfBytes(null)
                  setFile(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Change PDF
              </button>
            </div>

            {/* Position Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Number Position on Page
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bottom-right', label: 'Bottom Right', icon: AlignRight },
                  { id: 'bottom-center', label: 'Bottom Center', icon: AlignCenter },
                  { id: 'bottom-left', label: 'Bottom Left', icon: AlignLeft },
                  { id: 'top-right', label: 'Top Right', icon: AlignRight }
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPosition(item.id as PositionType)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                        position === item.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Numbering Format Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Numbering Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'page-of-n', label: 'Page 1 of N' },
                  { id: 'number-only', label: '1, 2, 3...' },
                  { id: 'roll-number', label: 'Roll No + Page' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStyle(item.id as StyleType)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      style === item.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Roll Number Input if selected */}
            {style === 'roll-number' && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  Candidate Roll Number / Text
                </span>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                />
              </div>
            )}

            {/* Font Size & Starting Page */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Font Size: {fontSize}pt
                </span>
                <input
                  type="range"
                  min="8"
                  max="16"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Start From Page: {startFromPage}
                </span>
                <input
                  type="range"
                  min="1"
                  max={Math.max(1, pageCount)}
                  value={startFromPage}
                  onChange={(e) => setStartFromPage(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  PDF Document Ready
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {pageCount} Pages Numbered
                </span>
              </div>

              {/* Status Box */}
              <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-150 flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {file?.name || 'Document.pdf'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Page numbers successfully stamped in {position} position.
                </p>
                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-600">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Total Pages: {pageCount}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Size: {outputSize} KB
                  </span>
                </div>
              </div>
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={outputUrl}
                  download={`numbered-${file?.name || 'document.pdf'}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Numbered PDF ({outputSize} KB)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

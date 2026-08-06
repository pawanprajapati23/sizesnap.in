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
  Layers,
  FileType,
  BookOpen
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

export default function CertificateIdMergerA4Tool({ config }: { config?: any }) {
  const [doc1File, setDoc1File] = useState<File | null>(null)
  const [doc2File, setDoc2File] = useState<File | null>(null)
  const [doc1Url, setDoc1Url] = useState<string | null>(null)
  const [doc2Url, setDoc2Url] = useState<string | null>(null)

  const [doc1Label, setDoc1Label] = useState<string>('Document 1: Marksheet / Certificate')
  const [doc2Label, setDoc2Label] = useState<string>('Document 2: Aadhaar Card / ID Proof')
  const [showLabels, setShowLabels] = useState<boolean>(true)
  const [targetKb, setTargetKb] = useState<number>(200)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [isPdfDownloading, setIsPdfDownloading] = useState<boolean>(false)

  const doc1InputRef = useRef<HTMLInputElement>(null)
  const doc2InputRef = useRef<HTMLInputElement>(null)

  const handleDoc1 = (f: File) => {
    setDoc1File(f)
    setDoc1Url(URL.createObjectURL(f))
  }

  const handleDoc2 = (f: File) => {
    setDoc2File(f)
    setDoc2Url(URL.createObjectURL(f))
  }

  const generateA4Sheet = useCallback(async () => {
    if (!doc1Url || !doc2Url) return
    setIsProcessing(true)

    try {
      const loadImg = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = url
        })

      const [img1, img2] = await Promise.all([loadImg(doc1Url), loadImg(doc2Url)])

      // Standard A4 Ratio: 1240 x 1754 px (150 DPI)
      const a4W = 1240
      const a4H = 1754
      const canvas = document.createElement('canvas')
      canvas.width = a4W
      canvas.height = a4H
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      // White A4 Sheet background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, a4W, a4H)

      const margin = 40
      const contentW = a4W - margin * 2
      const slotH = (a4H - margin * 3) / 2 // Half A4 page for each doc

      // 1. Draw Document 1 (Top Half)
      const label1H = showLabels ? 35 : 0
      const maxDrawH1 = slotH - label1H - 10
      const scale1 = Math.min(contentW / img1.width, maxDrawH1 / img1.height, 1)
      const drawW1 = img1.width * scale1
      const drawH1 = img1.height * scale1
      const x1 = (a4W - drawW1) / 2
      const y1 = margin + label1H + (maxDrawH1 - drawH1) / 2

      if (showLabels) {
        ctx.fillStyle = '#0F172A'
        ctx.font = 'bold 22px Inter, Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(doc1Label.toUpperCase(), a4W / 2, margin + 22)
      }

      ctx.drawImage(img1, x1, y1, drawW1, drawH1)
      ctx.strokeStyle = '#CBD5E1'
      ctx.lineWidth = 1.5
      ctx.strokeRect(x1, y1, drawW1, drawH1)

      // Divider Line between two documents
      ctx.strokeStyle = '#E2E8F0'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.moveTo(margin, a4H / 2)
      ctx.lineTo(a4W - margin, a4H / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // 2. Draw Document 2 (Bottom Half)
      const startY2 = a4H / 2 + margin / 2
      const label2H = showLabels ? 35 : 0
      const maxDrawH2 = slotH - label2H - 10
      const scale2 = Math.min(contentW / img2.width, maxDrawH2 / img2.height, 1)
      const drawW2 = img2.width * scale2
      const drawH2 = img2.height * scale2
      const x2 = (a4W - drawW2) / 2
      const y2 = startY2 + label2H + (maxDrawH2 - drawH2) / 2

      if (showLabels) {
        ctx.fillStyle = '#0F172A'
        ctx.font = 'bold 22px Inter, Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(doc2Label.toUpperCase(), a4W / 2, startY2 + 22)
      }

      ctx.drawImage(img2, x2, y2, drawW2, drawH2)
      ctx.strokeStyle = '#CBD5E1'
      ctx.lineWidth = 1.5
      ctx.strokeRect(x2, y2, drawW2, drawH2)

      // Outer A4 Border
      ctx.strokeStyle = '#94A3B8'
      ctx.lineWidth = 2
      ctx.strokeRect(10, 10, a4W - 20, a4H - 20)

      // Compress to target KB
      let minQ = 0.4
      let maxQ = 0.95
      let bestBlob: Blob | null = null

      for (let i = 0; i < 5; i++) {
        const mid = (minQ + maxQ) / 2
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, 'image/jpeg', mid)
        )
        if (!blob) break
        const sizeKb = blob.size / 1024
        bestBlob = blob
        if (sizeKb > targetKb) maxQ = mid
        else minQ = mid
      }

      if (bestBlob) {
        const outUrl = URL.createObjectURL(bestBlob)
        setOutputUrl(outUrl)
        const finalKb = Math.round(bestBlob.size / 1024)
        setOutputSize(finalKb)

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sizesnap_file_ready', {
              detail: {
                id: Date.now().toString(),
                name: `combined-a4-document-${finalKb}kb.jpg`,
                url: outUrl,
                sizeKb: finalKb,
                type: 'A4 Single-Page Document'
              }
            })
          )
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }, [doc1Url, doc2Url, doc1Label, doc2Label, showLabels, targetKb])

  useEffect(() => {
    if (doc1Url && doc2Url) {
      generateA4Sheet()
    }
  }, [doc1Url, doc2Url, doc1Label, doc2Label, showLabels, targetKb, generateA4Sheet])

  const downloadA4Pdf = async () => {
    if (!outputUrl) return
    setIsPdfDownloading(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595.28, 841.89]) // Standard A4 points
      const imageBytes = await fetch(outputUrl).then((res) => res.arrayBuffer())
      const embeddedImg = await pdfDoc.embedJpg(imageBytes)

      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89
      })

      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
      const pdfDownloadUrl = URL.createObjectURL(pdfBlob)

      const link = document.createElement('a')
      link.href = pdfDownloadUrl
      link.download = `combined-marksheet-aadhaar-a4-${targetKb}kb.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error(e)
    } finally {
      setIsPdfDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Dual Box */}
      {(!doc1Url || !doc2Url) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doc 1 Upload */}
          <div
            onClick={() => doc1InputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              doc1Url
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-blue-300 dark:border-blue-700/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <input
              ref={doc1InputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleDoc1(e.target.files[0])}
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              1. Upload Marksheet / Certificate (Top Half)
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              {doc1File ? `Uploaded: ${doc1File.name}` : '10th/12th Marksheet, Caste Certificate, or Degree'}
            </p>
          </div>

          {/* Doc 2 Upload */}
          <div
            onClick={() => doc2InputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              doc2Url
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-indigo-300 dark:border-indigo-700/50 hover:bg-indigo-50/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <input
              ref={doc2InputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleDoc2(e.target.files[0])}
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              2. Upload Aadhaar / ID Card (Bottom Half)
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              {doc2File ? `Uploaded: ${doc2File.name}` : 'Aadhaar, PAN Card, Voter ID or Domicile'}
            </p>
          </div>
        </div>
      )}

      {/* Main Studio Interface */}
      {doc1Url && doc2Url && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                A4 Document Layout Settings
              </h3>
              <button
                onClick={() => {
                  setDoc1Url(null)
                  setDoc2Url(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Reset Images
              </button>
            </div>

            {/* Labels Customization */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
                <span>Include Official Document Heading Titles</span>
              </label>

              {showLabels && (
                <div className="space-y-2 pl-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Top Document Heading</span>
                    <input
                      type="text"
                      value={doc1Label}
                      onChange={(e) => setDoc1Label(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Bottom Document Heading</span>
                    <input
                      type="text"
                      value={doc2Label}
                      onChange={(e) => setDoc2Label(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Target Size Presets */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Maximum File Size Limit
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 200, 300, 500].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKb(kb)}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      targetKb === kb
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ≤{kb}KB {kb === 200 && '⭐ (Exam)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  A4 Page Preview
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Official A4 Standard
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative mx-auto min-h-[280px] max-h-[380px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-150 overflow-hidden">
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Merged A4 Document"
                    className="max-h-[320px] w-auto object-contain rounded-lg shadow-md border border-slate-300 bg-white"
                  />
                )}
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    File Size: {outputSize} KB (Target: ≤{targetKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Page: Single A4 Sheet
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={downloadA4Pdf}
                  disabled={isPdfDownloading}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {isPdfDownloading ? 'Creating PDF...' : 'Download Single-Page A4 PDF'}
                </button>

                <a
                  href={outputUrl}
                  download={`combined-a4-document-${outputSize}kb.jpg`}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download JPG Image
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

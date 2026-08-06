'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Layers,
  Upload,
  Download,
  CheckCircle2,
  Sliders,
  Type,
  Calendar,
  ShieldCheck,
  FileText,
  Sparkles,
  ArrowDown,
  ArrowRight
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

type LayoutType = 'vertical' | 'horizontal'

export default function PhotoSignatureJoinerTool({ config }: { config?: any }) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [signFile, setSignFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [signUrl, setSignUrl] = useState<string | null>(null)

  const [layout, setLayout] = useState<LayoutType>('vertical')
  const [includeNameDate, setIncludeNameDate] = useState<boolean>(false)
  const [candidateName, setCandidateName] = useState<string>('NAME HERE')
  const [dateText, setDateText] = useState<string>(() => {
    const today = new Date()
    const d = String(today.getDate()).padStart(2, '0')
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const y = today.getFullYear()
    return `DOP: ${d}/${m}/${y}`
  })
  const [borderWidth, setBorderWidth] = useState<number>(2)
  const [targetKb, setTargetKb] = useState<number>(50)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [isPdfDownloading, setIsPdfDownloading] = useState<boolean>(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const signInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handlePhotoUpload = (f: File) => {
    setPhotoFile(f)
    setPhotoUrl(URL.createObjectURL(f))
  }

  const handleSignUpload = (f: File) => {
    setSignFile(f)
    setSignUrl(URL.createObjectURL(f))
  }

  const generateJoinedImage = useCallback(async () => {
    if (!photoUrl || !signUrl) return
    setIsProcessing(true)

    try {
      const loadImg = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = url
        })

      const [pImg, sImg] = await Promise.all([loadImg(photoUrl), loadImg(signUrl)])

      const canvas = document.createElement('canvas')
      let canvasW = 0
      let canvasH = 0

      if (layout === 'vertical') {
        // Standard exam vertical joint: 400px width, ~560px height
        canvasW = 400
        const photoH = 380
        const signH = 140
        const nameH = includeNameDate ? 50 : 0
        canvasH = photoH + nameH + signH + borderWidth * 3

        canvas.width = canvasW
        canvas.height = canvasH
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas not supported')

        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvasW, canvasH)

        // 1. Draw Photo (top)
        const pScale = Math.max(canvasW / pImg.width, photoH / pImg.height)
        const pDrawW = pImg.width * pScale
        const pDrawH = pImg.height * pScale
        const pOffsetX = (canvasW - pDrawW) / 2
        const pOffsetY = (photoH - pDrawH) / 2

        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, canvasW, photoH)
        ctx.clip()
        ctx.drawImage(pImg, pOffsetX, pOffsetY, pDrawW, pDrawH)
        ctx.restore()

        let currentY = photoH

        // 2. Optional Name & DOP banner
        if (includeNameDate) {
          ctx.fillStyle = '#F8FAFC'
          ctx.fillRect(0, currentY, canvasW, nameH)
          ctx.strokeStyle = '#E2E8F0'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, currentY)
          ctx.lineTo(canvasW, currentY)
          ctx.stroke()

          ctx.fillStyle = '#0F172A'
          ctx.font = 'bold 15px Inter, Arial, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(candidateName.toUpperCase(), canvasW / 2, currentY + 16)

          ctx.font = 'bold 13px Inter, Arial, sans-serif'
          ctx.fillStyle = '#475569'
          ctx.fillText(dateText.toUpperCase(), canvasW / 2, currentY + 36)

          currentY += nameH
        }

        // 3. Divider Line
        ctx.strokeStyle = '#CBD5E1'
        ctx.lineWidth = borderWidth
        ctx.beginPath()
        ctx.moveTo(0, currentY)
        ctx.lineTo(canvasW, currentY)
        ctx.stroke()

        // 4. Draw Signature (bottom)
        const sFitH = signH - 10
        const sFitW = canvasW - 20
        const sScale = Math.min(sFitW / sImg.width, sFitH / sImg.height, 1)
        const sDrawW = sImg.width * sScale
        const sDrawH = sImg.height * sScale
        const sOffsetX = (canvasW - sDrawW) / 2
        const sOffsetY = currentY + (signH - sDrawH) / 2

        ctx.drawImage(sImg, sOffsetX, sOffsetY, sDrawW, sDrawH)

        // Outer border
        if (borderWidth > 0) {
          ctx.strokeStyle = '#94A3B8'
          ctx.lineWidth = borderWidth
          ctx.strokeRect(0, 0, canvasW, canvasH)
        }
      } else {
        // Horizontal side by side: 600px width, 300px height
        canvasW = 600
        canvasH = 300
        canvas.width = canvasW
        canvas.height = canvasH
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas not supported')

        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvasW, canvasH)

        const photoW = 280
        const signW = canvasW - photoW

        // Photo on Left
        const pScale = Math.max(photoW / pImg.width, canvasH / pImg.height)
        const pDrawW = pImg.width * pScale
        const pDrawH = pImg.height * pScale
        const pOffsetX = (photoW - pDrawW) / 2
        const pOffsetY = (canvasH - pDrawH) / 2

        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, photoW, canvasH)
        ctx.clip()
        ctx.drawImage(pImg, pOffsetX, pOffsetY, pDrawW, pDrawH)
        ctx.restore()

        // Divider
        ctx.strokeStyle = '#CBD5E1'
        ctx.lineWidth = borderWidth
        ctx.beginPath()
        ctx.moveTo(photoW, 0)
        ctx.lineTo(photoW, canvasH)
        ctx.stroke()

        // Signature on Right
        const sFitH = canvasH - 30
        const sFitW = signW - 20
        const sScale = Math.min(sFitW / sImg.width, sFitH / sImg.height, 1)
        const sDrawW = sImg.width * sScale
        const sDrawH = sImg.height * sScale
        const sOffsetX = photoW + (signW - sDrawW) / 2
        const sOffsetY = (canvasH - sDrawH) / 2

        ctx.drawImage(sImg, sOffsetX, sOffsetY, sDrawW, sDrawH)

        if (borderWidth > 0) {
          ctx.strokeStyle = '#94A3B8'
          ctx.lineWidth = borderWidth
          ctx.strokeRect(0, 0, canvasW, canvasH)
        }
      }

      // Quality compression under target KB
      let minQ = 0.4
      let maxQ = 0.98
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
                name: `photo-signature-joint-${finalKb}kb.jpg`,
                url: outUrl,
                sizeKb: finalKb,
                type: 'JPG (Photo + Signature Joint)'
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
  }, [photoUrl, signUrl, layout, includeNameDate, candidateName, dateText, borderWidth, targetKb])

  useEffect(() => {
    if (photoUrl && signUrl) {
      generateJoinedImage()
    }
  }, [photoUrl, signUrl, layout, includeNameDate, candidateName, dateText, borderWidth, targetKb, generateJoinedImage])

  const downloadPdf = async () => {
    if (!outputUrl) return
    setIsPdfDownloading(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595.28, 841.89]) // A4
      const imageBytes = await fetch(outputUrl).then((res) => res.arrayBuffer())
      const embeddedImg = await pdfDoc.embedJpg(imageBytes)

      const imgDims = embeddedImg.scale(0.8)
      page.drawImage(embeddedImg, {
        x: (595.28 - imgDims.width) / 2,
        y: (841.89 - imgDims.height) / 2,
        width: imgDims.width,
        height: imgDims.height
      })

      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
      const pdfDownloadUrl = URL.createObjectURL(pdfBlob)

      const link = document.createElement('a')
      link.href = pdfDownloadUrl
      link.download = `photo-signature-joint-document.pdf`
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
      {(!photoUrl || !signUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Photo Upload */}
          <div
            onClick={() => photoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              photoUrl
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-blue-300 dark:border-blue-700/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              1. Upload Passport Photo
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              {photoFile ? `Uploaded: ${photoFile.name}` : 'Click to select candidate photo'}
            </p>
          </div>

          {/* 2. Signature Upload */}
          <div
            onClick={() => signInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              signUrl
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-indigo-300 dark:border-indigo-700/50 hover:bg-indigo-50/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <input
              ref={signInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSignUpload(e.target.files[0])}
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              2. Upload Signature Photo
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              {signFile ? `Uploaded: ${signFile.name}` : 'Click to select signature photo'}
            </p>
          </div>
        </div>
      )}

      {/* Main Studio Interface */}
      {photoUrl && signUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Joint Layout &amp; Settings
              </h3>
              <button
                onClick={() => {
                  setPhotoUrl(null)
                  setSignUrl(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Reset Images
              </button>
            </div>

            {/* Layout Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Joint Arrangement Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLayout('vertical')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    layout === 'vertical'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-700'
                  }`}
                >
                  <ArrowDown className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-xs font-bold block">Vertical Stack</span>
                    <span className="text-[10px] text-slate-400 block">Photo Top + Sign Bottom</span>
                  </div>
                </button>

                <button
                  onClick={() => setLayout('horizontal')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    layout === 'horizontal'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-700'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="text-xs font-bold block">Side by Side</span>
                    <span className="text-[10px] text-slate-400 block">Photo Left + Sign Right</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Optional Name & Date Bar Toggle */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNameDate}
                    onChange={(e) => setIncludeNameDate(e.target.checked)}
                    className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                  />
                  <span>Add Name &amp; Date of Photo (DOP) Bar</span>
                </label>
              </div>

              {includeNameDate && (
                <div className="grid grid-cols-2 gap-2 pl-6 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Candidate Name</span>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Photo Date (DOP)</span>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => setDateText(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Target KB Limit */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Maximum Size Limit
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 500].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKb(kb)}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      targetKb === kb
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ≤{kb}KB {kb === 50 && '⭐'}
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
                  Combined Document Preview
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Form Upload Ready
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative mx-auto min-h-[260px] max-h-[360px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-150 overflow-hidden">
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Photo & Signature Combined"
                    className="max-h-[300px] w-auto object-contain rounded-lg shadow-md border border-slate-300 bg-white"
                  />
                )}
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Size: {outputSize} KB (Limit: ≤{targetKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Format: JPG &amp; PDF
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={outputUrl}
                  download={`photo-signature-joint-${outputSize}kb.jpg`}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download JPG ({outputSize} KB)
                </a>

                <button
                  onClick={downloadPdf}
                  disabled={isPdfDownloading}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {isPdfDownloading ? 'Creating PDF...' : 'Download as A4 PDF'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

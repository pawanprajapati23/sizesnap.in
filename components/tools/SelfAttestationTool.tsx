'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  PenTool,
  Upload,
  Download,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

export default function SelfAttestationTool({ config }: { config?: any }) {
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docUrl, setDocUrl] = useState<string | null>(null)

  const [signFile, setSignFile] = useState<File | null>(null)
  const [signUrl, setSignUrl] = useState<string | null>(null)

  const [candidateName, setCandidateName] = useState<string>('CANDIDATE SIGNATURE')
  const [attestText, setAttestText] = useState<string>('Self Attested')
  const [dateText, setDateText] = useState<string>(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  )
  const [stampPosition, setStampPosition] = useState<'bottom-right' | 'bottom-left' | 'bottom-center'>('bottom-right')
  const [targetKb, setTargetKb] = useState<number>(200)

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [isPdfDownloading, setIsPdfDownloading] = useState<boolean>(false)

  const docInputRef = useRef<HTMLInputElement>(null)
  const signInputRef = useRef<HTMLInputElement>(null)

  const handleDocUpload = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setDocFile(f)
    setDocUrl(URL.createObjectURL(f))
  }

  const handleSignUpload = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setSignFile(f)
    setSignUrl(URL.createObjectURL(f))
  }

  const generateAttestedDoc = useCallback(async () => {
    if (!docUrl) return
    setIsProcessing(true)

    try {
      const docImg = new Image()
      docImg.crossOrigin = 'anonymous'
      await new Promise((res, rej) => {
        docImg.onload = res
        docImg.onerror = rej
        docImg.src = docUrl
      })

      let signImg: HTMLImageElement | null = null
      if (signUrl) {
        signImg = new Image()
        signImg.crossOrigin = 'anonymous'
        await new Promise((res, rej) => {
          signImg!.onload = res
          signImg!.onerror = rej
          signImg!.src = signUrl!
        })
      }

      // Maintain original doc dimensions or scale to standard A4 (approx 1200 x 1700 px)
      const canvasW = Math.max(1000, docImg.width)
      const canvasH = Math.round((canvasW / docImg.width) * docImg.height)

      const canvas = document.createElement('canvas')
      canvas.width = canvasW
      canvas.height = canvasH
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      // Draw base document
      ctx.drawImage(docImg, 0, 0, canvasW, canvasH)

      // Self Attestation Stamp Box configuration
      const stampBoxW = Math.round(canvasW * 0.32)
      const stampBoxH = Math.round(stampBoxW * 0.45)
      const margin = Math.round(canvasW * 0.04)

      let stampX = canvasW - stampBoxW - margin
      let stampY = canvasH - stampBoxH - margin

      if (stampPosition === 'bottom-left') {
        stampX = margin
      } else if (stampPosition === 'bottom-center') {
        stampX = (canvasW - stampBoxW) / 2
      }

      // Draw semi-transparent white backing for stamp clarity
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
      ctx.strokeStyle = '#2563EB'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(stampX, stampY, stampBoxW, stampBoxH, 10)
      ctx.fill()
      ctx.stroke()

      // Header: "Self Attested"
      ctx.fillStyle = '#1E3A8A'
      ctx.font = `bold ${Math.round(stampBoxW * 0.085)}px Inter, Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(attestText, stampX + stampBoxW / 2, stampY + stampBoxH * 0.22)

      // Signature area (Image or Text)
      if (signImg) {
        const sDrawW = stampBoxW * 0.7
        const sDrawH = stampBoxH * 0.45
        const sX = stampX + (stampBoxW - sDrawW) / 2
        const sY = stampY + stampBoxH * 0.28
        ctx.drawImage(signImg, sX, sY, sDrawW, sDrawH)
      } else {
        // Digital candidate signature cursive placeholder
        ctx.fillStyle = '#0F172A'
        ctx.font = `italic bold ${Math.round(stampBoxW * 0.075)}px 'Brush Script MT', cursive, Georgia, serif`
        ctx.fillText(candidateName, stampX + stampBoxW / 2, stampY + stampBoxH * 0.55)
      }

      // Divider Line
      ctx.strokeStyle = '#CBD5E1'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(stampX + 15, stampY + stampBoxH * 0.75)
      ctx.lineTo(stampX + stampBoxW - 15, stampY + stampBoxH * 0.75)
      ctx.stroke()

      // Date of Attestation
      ctx.fillStyle = '#475569'
      ctx.font = `bold ${Math.round(stampBoxW * 0.065)}px Inter, Arial, sans-serif`
      ctx.fillText(`Date: ${dateText}`, stampX + stampBoxW / 2, stampY + stampBoxH * 0.9)

      // Compress to target KB
      let minQ = 0.4
      let maxQ = 0.96
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
                name: `self-attested-doc-${finalKb}kb.jpg`,
                url: outUrl,
                sizeKb: finalKb,
                type: 'Self Attested Document'
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
  }, [docUrl, signUrl, candidateName, attestText, dateText, stampPosition, targetKb])

  useEffect(() => {
    if (docUrl) {
      generateAttestedDoc()
    }
  }, [docUrl, signUrl, candidateName, attestText, dateText, stampPosition, targetKb, generateAttestedDoc])

  const downloadPdf = async () => {
    if (!outputUrl) return
    setIsPdfDownloading(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595.28, 841.89]) // Standard A4
      const imageBytes = await fetch(outputUrl).then((res) => res.arrayBuffer())
      const embeddedImg = await pdfDoc.embedJpg(imageBytes)

      // Fit to A4
      const imgAspect = embeddedImg.width / embeddedImg.height
      const pageAspect = 595.28 / 841.89

      let drawW = 595.28
      let drawH = 841.89

      if (imgAspect > pageAspect) {
        drawW = 595.28 - 20
        drawH = drawW / imgAspect
      } else {
        drawH = 841.89 - 20
        drawW = drawH * imgAspect
      }

      page.drawImage(embeddedImg, {
        x: (595.28 - drawW) / 2,
        y: (841.89 - drawH) / 2,
        width: drawW,
        height: drawH
      })

      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
      const pdfDownloadUrl = URL.createObjectURL(pdfBlob)

      const link = document.createElement('a')
      link.href = pdfDownloadUrl
      link.download = `self-attested-document-${targetKb}kb.pdf`
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
      {/* Upload Screen */}
      {!docUrl && (
        <div
          onClick={() => docInputRef.current?.click()}
          className="border-2 border-dashed border-blue-300 dark:border-blue-700/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/40 rounded-3xl p-10 text-center cursor-pointer transition-all"
        >
          <input
            ref={docInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleDocUpload(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Upload Marksheet, Certificate or Aadhaar Card
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Add official &quot;Self Attested&quot; stamp, your signature, and date on any document for college admission &amp; sarkari exam forms.
          </p>
          <button className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> Select Document Photo
          </button>
        </div>
      )}

      {/* Editor & Studio */}
      {docUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                Attestation Stamp Settings
              </h3>
              <button
                onClick={() => {
                  setDocUrl(null)
                  setSignUrl(null)
                  setOutputUrl(null)
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Change Document
              </button>
            </div>

            {/* Optional Signature Upload */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-blue-600" /> Upload Scanned Signature (Optional)
                </span>
                {signUrl && (
                  <button
                    onClick={() => setSignUrl(null)}
                    className="text-[10px] text-rose-500 font-bold hover:underline"
                  >
                    Remove Signature
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Upload your signature image or type your name below for automated cursive sign.
              </p>
              <input
                ref={signInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleSignUpload(e.target.files[0])}
              />
              <button
                onClick={() => signInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                {signFile && signUrl ? `Selected: ${signFile.name}` : 'Click to Upload Signature Photo'}
              </button>
            </div>

            {/* Candidate Name if no sign uploaded */}
            {!signUrl && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Candidate Signature Text</span>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            )}

            {/* Attestation Header & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Stamp Title</span>
                <input
                  type="text"
                  value={attestText}
                  onChange={(e) => setAttestText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Attestation Date</span>
                <input
                  type="text"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* Stamp Position */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Stamp Placement on Document
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'bottom-center', label: 'Bottom Center' },
                  { id: 'bottom-left', label: 'Bottom Left' }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setStampPosition(pos.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      stampPosition === pos.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Size Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Maximum Size Limit
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
                    ≤{kb}KB {kb === 200 && '⭐'}
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
                  Attested Document Preview
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready for Upload
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative mx-auto min-h-[260px] max-h-[360px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-150 overflow-hidden">
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Self Attested Document"
                    className="max-h-[300px] w-auto object-contain rounded-lg shadow-md border border-slate-300 bg-white"
                  />
                )}
              </div>

              {outputUrl && (
                <div className="flex items-center justify-center gap-3 text-xs pt-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    File Size: {outputSize} KB (Limit: ≤{targetKb}KB)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Format: JPG &amp; A4 PDF
                  </span>
                </div>
              )}
            </div>

            {outputUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={downloadPdf}
                  disabled={isPdfDownloading}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {isPdfDownloading ? 'Generating PDF...' : 'Download as A4 PDF'}
                </button>

                <a
                  href={outputUrl}
                  download={`self-attested-document-${outputSize}kb.jpg`}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download JPG ({outputSize} KB)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

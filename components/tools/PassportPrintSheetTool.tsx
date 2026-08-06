'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Upload,
  Download,
  Printer,
  Grid,
  Scissors,
  User,
  Sparkles,
  RefreshCw,
  FileText,
  ShieldCheck,
  CheckCircle,
  Sliders,
  Maximize2
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

type PaperSize = '4x6' | 'a4' | '5x7'

interface PrintPreset {
  id: PaperSize
  label: string
  widthMm: number
  heightMm: number
  defaultRows: number
  defaultCols: number
  popularCount: number
}

const PRESETS: Record<PaperSize, PrintPreset> = {
  '4x6': {
    id: '4x6',
    label: '4x6 Inch Glossy Photo Paper (Most Popular)',
    widthMm: 101.6,
    heightMm: 152.4,
    defaultRows: 2,
    defaultCols: 4,
    popularCount: 8
  },
  a4: {
    id: 'a4',
    label: 'A4 Document Paper (210 x 297 mm)',
    widthMm: 210,
    heightMm: 297,
    defaultRows: 6,
    defaultCols: 5,
    popularCount: 30
  },
  '5x7': {
    id: '5x7',
    label: '5x7 Inch Photo Paper',
    widthMm: 127,
    heightMm: 177.8,
    defaultRows: 3,
    defaultCols: 4,
    popularCount: 12
  }
}

export default function PassportPrintSheetTool() {
  const [paper, setPaper] = useState<PaperSize>('4x6')
  const [rows, setRows] = useState<number>(2)
  const [cols, setCols] = useState<number>(4)
  const [showCuttingGuides, setShowCuttingGuides] = useState<boolean>(true)
  const [photoBorder, setPhotoBorder] = useState<boolean>(true)
  const [nameDateBanner, setNameDateBanner] = useState<boolean>(false)
  const [candidateName, setCandidateName] = useState<string>('')
  const [photoDate, setPhotoDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [photoCount, setPhotoCount] = useState<number>(8)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgElementRef = useRef<HTMLImageElement | null>(null)

  // Handle Preset change
  const handlePaperChange = (newPaper: PaperSize) => {
    setPaper(newPaper)
    const p = PRESETS[newPaper]
    setRows(p.defaultRows)
    setCols(p.defaultCols)
    setPhotoCount(p.popularCount)
  }

  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imgElementRef.current = img
      setImageSrc(url)
    }
    img.src = url
  }

  // Render the print sheet at high resolution (300 DPI)
  const renderSheet = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgElementRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const preset = PRESETS[paper]
    // 300 DPI calculation: 1 inch = 25.4 mm => pixels = (mm / 25.4) * 300
    const dpi = 300
    const dpmm = dpi / 25.4
    const sheetW = Math.round(preset.widthMm * dpmm)
    const sheetH = Math.round(preset.heightMm * dpmm)

    canvas.width = sheetW
    canvas.height = sheetH

    // Fill white paper background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, sheetW, sheetH)

    // Standard Indian Passport photo is 35mm x 45mm
    const photoWMm = 35
    const photoHMm = 45
    const photoWPx = Math.round(photoWMm * dpmm)
    const photoHPx = Math.round(photoHMm * dpmm)

    const totalCols = cols
    const totalRows = rows
    const totalSlots = totalCols * totalRows

    // Margins and gap calculations
    const gapX = Math.round(4 * dpmm) // 4mm gap
    const gapY = Math.round(4 * dpmm) // 4mm gap

    const gridTotalW = totalCols * photoWPx + (totalCols - 1) * gapX
    const gridTotalH = totalRows * photoHPx + (totalRows - 1) * gapY

    const startX = Math.round((sheetW - gridTotalW) / 2)
    const startY = Math.round((sheetH - gridTotalH) / 2)

    let drawn = 0
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < totalCols; c++) {
        if (drawn >= photoCount) break

        const x = startX + c * (photoWPx + gapX)
        const y = startY + r * (photoHPx + gapY)

        // Draw individual passport photo
        ctx.save()
        // Center crop image to 35:45
        ctx.beginPath()
        ctx.rect(x, y, photoWPx, photoHPx)
        ctx.clip()

        const imgAspect = img.naturalWidth / img.naturalHeight
        const photoAspect = photoWPx / photoHPx
        let dw = photoWPx
        let dh = photoHPx
        let dx = x
        let dy = y

        if (imgAspect > photoAspect) {
          dw = photoHPx * imgAspect
          dx = x + (photoWPx - dw) / 2
        } else {
          dh = photoWPx / imgAspect
          dy = y + (photoHPx - dh) / 2
        }

        ctx.drawImage(img, dx, dy, dw, dh)

        // Name & Date Banner overlay if requested
        if (nameDateBanner && (candidateName || photoDate)) {
          const bH = Math.round(photoHPx * 0.17)
          const bY = y + photoHPx - bH

          ctx.fillStyle = '#ffffff'
          ctx.fillRect(x, bY, photoWPx, bH)

          ctx.strokeStyle = '#cbd5e1'
          ctx.lineWidth = 1
          ctx.strokeRect(x, bY, photoWPx, bH)

          ctx.fillStyle = '#000000'
          ctx.textAlign = 'center'
          const fontSize = Math.round(bH * 0.38)
          ctx.font = `bold ${fontSize}px sans-serif`

          if (candidateName && photoDate) {
            ctx.fillText(candidateName.toUpperCase(), x + photoWPx / 2, bY + bH * 0.42)
            ctx.font = `600 ${Math.round(fontSize * 0.85)}px sans-serif`
            ctx.fillText(`DOP: ${photoDate}`, x + photoWPx / 2, bY + bH * 0.85)
          } else if (candidateName) {
            ctx.fillText(candidateName.toUpperCase(), x + photoWPx / 2, bY + bH * 0.65)
          } else if (photoDate) {
            ctx.fillText(`DOP: ${photoDate}`, x + photoWPx / 2, bY + bH * 0.65)
          }
        }

        ctx.restore()

        // Photo border
        if (photoBorder) {
          ctx.strokeStyle = '#94a3b8'
          ctx.lineWidth = 1
          ctx.strokeRect(x, y, photoWPx, photoHPx)
        }

        // Scissor cutting guide lines around photo
        if (showCuttingGuides) {
          ctx.strokeStyle = '#cbd5e1'
          ctx.lineWidth = 1
          ctx.setLineDash([4, 4])
          ctx.strokeRect(x - 2, y - 2, photoWPx + 4, photoHPx + 4)
          ctx.setLineDash([])
        }

        drawn++
      }
    }
  }, [paper, rows, cols, photoCount, showCuttingGuides, photoBorder, nameDateBanner, candidateName, photoDate])

  useEffect(() => {
    if (imageSrc) {
      renderSheet()
    }
  }, [renderSheet, imageSrc])

  // Download High-Res JPG Sheet
  const handleDownloadJpg = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/jpeg', 0.98)
    a.download = `passport-photo-print-sheet-${paper}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Download Print-Ready 300 DPI PDF Sheet (Ready for Ctrl+P)
  const handleDownloadPdf = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsGeneratingPdf(true)
    try {
      const preset = PRESETS[paper]
      const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95)
      const imgBytes = await (await fetch(imgDataUrl)).arrayBuffer()

      const pdfDoc = await PDFDocument.create()
      // Convert mm to points (1 inch = 72 pt, 1 inch = 25.4 mm)
      const ptPerMm = 72 / 25.4
      const pageWidthPt = preset.widthMm * ptPerMm
      const pageHeightPt = preset.heightMm * ptPerMm

      const page = pdfDoc.addPage([pageWidthPt, pageHeightPt])
      const embeddedImg = await pdfDoc.embedJpg(imgBytes)

      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: pageWidthPt,
        height: pageHeightPt
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `passport-print-sheet-300dpi-${paper}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to create PDF.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-2">
            <Printer className="w-3.5 h-3.5" />
            CSC & Cyber Cafe Pro Studio
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1-Click 4x6 & A4 Passport Photo Print Sheet Maker
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Arrange 6, 8, 12, or 30 passport size photos (35x45mm) on 4x6 inch or A4 paper with cutting lines ready for printing.
          </p>
        </div>

        {imageSrc && (
          <button
            onClick={() => {
              setImageSrc(null)
              setImageFile(null)
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Photo
          </button>
        )}
      </div>

      {/* Upload Screen */}
      {!imageSrc && (
        <div className="mt-8 max-w-xl mx-auto border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-12 text-center bg-slate-50/50 dark:bg-slate-800/20 transition cursor-pointer">
          <label className="cursor-pointer flex flex-col items-center justify-center gap-4">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
              <Grid className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                Upload 1 Passport Photo to Create Print Sheet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG photos (Creates instant 6, 8, 12, or 30 photo grid on 4x6 / A4)
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Editor & Preview Grid */}
      {imageSrc && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Paper Size Preset Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Paper Size / Sheet Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['4x6', 'a4', '5x7'] as PaperSize[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePaperChange(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition text-center ${
                      paper === p
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Count & Grid Rows/Cols */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Total Photos on Sheet:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{photoCount} Photos</span>
              </div>
              <input
                type="range"
                min="1"
                max={rows * cols}
                value={photoCount}
                onChange={(e) => setPhotoCount(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Toggles: Scissor cutting lines & borders */}
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCuttingGuides}
                  onChange={(e) => setShowCuttingGuides(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <Scissors className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium">Show Scissor Cutting Guides (Dashed Lines)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={photoBorder}
                  onChange={(e) => setPhotoBorder(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Add Thin Dark Photo Border</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nameDateBanner}
                  onChange={(e) => setNameDateBanner(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium">Add Candidate Name & Date on Each Photo</span>
              </label>
            </div>

            {/* Candidate Name & Date Input */}
            {nameDateBanner && (
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/40 space-y-2">
                <input
                  type="text"
                  placeholder="Candidate Name (e.g. AMIT SHARMA)"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs uppercase"
                />
                <input
                  type="date"
                  value={photoDate}
                  onChange={(e) => setPhotoDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs"
                />
              </div>
            )}

            {/* Print & Download Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <FileText className="w-4 h-4" />
                {isGeneratingPdf ? 'Rendering 300 DPI PDF...' : 'Download 300 DPI Print PDF (Ready for Print)'}
              </button>

              <button
                onClick={handleDownloadJpg}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download High-Res JPG Sheet
              </button>
            </div>
          </div>

          {/* Visual Sheet Live Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[460px] border border-slate-800">
            <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Live Sheet Preview: {paper.toUpperCase()} ({photoCount} Photos)
              </span>
            </div>
            <div className="max-w-full max-h-[500px] overflow-auto rounded-lg shadow-2xl p-2 bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-h-[440px] w-auto object-contain rounded border border-slate-700 shadow-md bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

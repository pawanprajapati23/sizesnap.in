'use client'
import { useState, useRef, useEffect } from 'react'
import { Upload, Download, Printer, Grid, Scissors, CheckCircle, RefreshCw, ZoomIn, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface Props {
  config?: any
}

type PaperSize = 'A4' | '4x6'

export default function PassportPrintGridTool({ config }: Props) {
  const [status, setStatus] = useState<'idle' | 'editing' | 'processing' | 'done' | 'error'>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const [paperSize, setPaperSize] = useState<PaperSize>('A4')
  const [copies, setCopies] = useState<number>(30)
  const [gap, setGap] = useState<number>(15)
  const [includeBorders, setIncludeBorders] = useState<boolean>(true)
  const [exportFormat, setExportFormat] = useState<'jpg' | 'pdf'>('jpg')

  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (f: File) => {
    if (!f.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file.')
      setStatus('error')
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setStatus('editing')
    setErrorMsg('')
    if (paperSize === 'A4') setCopies(30)
    else setCopies(8)
  }

  useEffect(() => {
    if (paperSize === 'A4' && copies > 40) setCopies(30)
    if (paperSize === '4x6' && copies > 8) setCopies(8)
  }, [paperSize, copies])

  const generateGrid = async () => {
    const img = imgRef.current
    if (!img) return
    setStatus('processing')

    try {
      // 300 DPI calculations
      // 1 inch = 2.54 cm
      // 3.5cm x 4.5cm passport size
      const passW = Math.round((3.5 / 2.54) * 300) // ~413px
      const passH = Math.round((4.5 / 2.54) * 300) // ~531px

      let paperW = 0, paperH = 0
      let maxCols = 0, maxRows = 0

      if (paperSize === 'A4') {
        paperW = 2480
        paperH = 3508
        maxCols = 5
        maxRows = 6
      } else {
        // 4x6 inches
        paperW = 1200
        paperH = 1800
        maxCols = 2
        maxRows = 4
      }

      const canvas = document.createElement('canvas')
      canvas.width = paperW
      canvas.height = paperH
      const ctx = canvas.getContext('2d')!
      
      // White background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, paperW, paperH)

      // Calculate margins to center the grid
      const actualCols = Math.min(maxCols, copies)
      const actualRows = Math.ceil(copies / maxCols)
      
      const gridTotalW = (maxCols * passW) + ((maxCols - 1) * gap)
      const gridTotalH = (maxRows * passH) + ((maxRows - 1) * gap)
      
      const startX = (paperW - gridTotalW) / 2
      const startY = (paperH - gridTotalH) / 2

      let drawn = 0
      for (let r = 0; r < maxRows; r++) {
        for (let c = 0; c < maxCols; c++) {
          if (drawn >= copies) break

          const x = startX + c * (passW + gap)
          const y = startY + r * (passH + gap)

          // Draw Image
          ctx.drawImage(img, x, y, passW, passH)

          // Draw cut border
          if (includeBorders) {
            ctx.strokeStyle = '#CCCCCC'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, passW, passH)
          }
          drawn++
        }
      }

      if (exportFormat === 'jpg') {
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.95))
        if (!blob) throw new Error("Failed to generate JPG")
        setResultUrl(URL.createObjectURL(blob))
      } else {
        // PDF generation
        const pdfDoc = await PDFDocument.create()
        // A4 in points (72 DPI) is 595 x 842. 4x6 is 288 x 432
        const pdfW = paperSize === 'A4' ? 595.28 : 288
        const pdfH = paperSize === 'A4' ? 841.89 : 432
        const page = pdfDoc.addPage([pdfW, pdfH])

        const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.95)
        const pdfImg = await pdfDoc.embedJpg(jpgDataUrl)
        
        page.drawImage(pdfImg, {
          x: 0,
          y: 0,
          width: pdfW,
          height: pdfH
        })

        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
        setResultUrl(URL.createObjectURL(blob))
      }

      setStatus('done')
    } catch (e: any) {
      console.error(e)
      setErrorMsg('Failed to generate grid. Please try again.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setPreviewUrl(null)
    setResultUrl(null)
  }

  return (
    <div className="space-y-6">
      {status === 'idle' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-400/60 rounded-3xl p-10 text-center cursor-pointer hover:bg-blue-50/40 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Grid className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Upload Passport Photo</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload a single passport photo to generate a ready-to-print A4 or 4x6 grid.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">{errorMsg}</p>
          <button onClick={() => setStatus('idle')} className="ml-auto underline text-xs font-bold">Try Again</button>
        </div>
      )}

      {(status === 'editing' || status === 'processing' || status === 'done') && previewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600" />
              <h3 className="font-black text-slate-900">Print Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Paper Size</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaperSize('A4')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${paperSize === 'A4' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                  >
                    A4 Sheet (30 Photos)
                  </button>
                  <button
                    onClick={() => setPaperSize('4x6')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${paperSize === '4x6' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                  >
                    4x6 Inch (8 Photos)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block flex justify-between">
                  <span>Number of Copies</span>
                  <span className="text-blue-600">{copies}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max={paperSize === 'A4' ? 30 : 8}
                  value={copies}
                  onChange={e => setCopies(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block flex justify-between">
                  <span>Photo Gap (Padding)</span>
                  <span className="text-blue-600">{gap}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={gap}
                  onChange={e => setGap(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-bold text-gray-700">Cut Borders</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={includeBorders} onChange={e => setIncludeBorders(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Download Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportFormat('jpg')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all border ${exportFormat === 'jpg' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                  >
                    High-Res JPG
                  </button>
                  <button
                    onClick={() => setExportFormat('pdf')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all border ${exportFormat === 'pdf' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                  >
                    PDF Document
                  </button>
                </div>
              </div>
            </div>

            {status !== 'done' ? (
              <button
                onClick={generateGrid}
                disabled={status === 'processing'}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {status === 'processing' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Grid className="w-5 h-5" />}
                {status === 'processing' ? 'Generating Print Grid...' : 'Generate Print Ready File'}
              </button>
            ) : (
              <div className="space-y-3">
                <a
                  href={resultUrl!}
                  download={`passport_print_grid_${paperSize}.${exportFormat}`}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 animate-pulse"
                >
                  <Download className="w-5 h-5" />
                  Download {exportFormat.toUpperCase()} to Print
                </a>
                <button
                  onClick={handleReset}
                  className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Create Another Grid
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl p-6 border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[400px]">
            <img ref={imgRef} src={previewUrl} className="hidden" alt="source" />
            
            {status === 'done' && resultUrl ? (
              <div className="text-center w-full">
                <span className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Final Output Preview</span>
                <div className="bg-white p-2 rounded shadow-md inline-block max-w-full overflow-hidden">
                  {exportFormat === 'jpg' ? (
                    <img src={resultUrl} className="max-h-[500px] w-auto mx-auto object-contain" alt="Grid" />
                  ) : (
                    <iframe src={resultUrl} className="w-full h-[500px] border-0" title="PDF Preview" />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Source Photo</span>
                <div className="w-32 h-40 mx-auto rounded overflow-hidden shadow border border-gray-200">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Source Preview" />
                </div>
                <p className="text-[10px] text-slate-400 max-w-xs text-center">
                  Adjust the settings on the left to layout this photo onto a printable sheet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, CheckCircle, RefreshCw, Download, AlertCircle, Maximize, Printer } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import confetti from 'canvas-confetti'

interface Props {
  config?: any
}

type Status = 'idle' | 'processing' | 'done' | 'error'

export default function SmartAadharPrintTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [frontUrl, setFrontUrl] = useState<string | null>(null)
  const [backUrl, setBackUrl] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (frontUrl) URL.revokeObjectURL(frontUrl)
      if (backUrl) URL.revokeObjectURL(backUrl)
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [frontUrl, backUrl, pdfUrl])

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (frontUrl) URL.revokeObjectURL(frontUrl)
      setFrontUrl(URL.createObjectURL(file))
      setStatus('idle')
    }
  }

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (backUrl) URL.revokeObjectURL(backUrl)
      setBackUrl(URL.createObjectURL(file))
      setStatus('idle')
    }
  }

  const generateA4Print = async () => {
    if (!frontUrl || !backUrl) {
      setErrorMsg('Please upload both Front and Back sides.')
      setStatus('error')
      return
    }
    
    setStatus('processing')
    try {
      const pdfDoc = await PDFDocument.create()
      
      // Standard A4 sizes in points (72 points per inch)
      // A4 = 210mm x 297mm = 595.28 x 841.89 points
      const A4_WIDTH = 595.28
      const A4_HEIGHT = 841.89
      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])

      // Load Images
      const fetchImage = async (url: string) => {
        const res = await fetch(url)
        return res.arrayBuffer()
      }

      const [frontBytes, backBytes] = await Promise.all([
        fetchImage(frontUrl),
        fetchImage(backUrl)
      ])

      // Embed logic (Try JPG, fallback to PNG)
      let frontImg, backImg
      try {
        frontImg = await pdfDoc.embedJpg(frontBytes)
      } catch (e) {
        frontImg = await pdfDoc.embedPng(frontBytes)
      }
      try {
        backImg = await pdfDoc.embedJpg(backBytes)
      } catch (e) {
        backImg = await pdfDoc.embedPng(backBytes)
      }

      // Standard PVC Card size: 85.6mm x 53.98mm
      // 1 mm = 2.83465 points
      const cardWidth = 85.6 * 2.83465
      const cardHeight = 54.0 * 2.83465

      // Placement on A4: Top Center, some margin from top.
      const marginY = 80 // distance from top
      const gapY = 20 // gap between front and back
      const centerX = (A4_WIDTH - cardWidth) / 2

      // Draw Front
      page.drawImage(frontImg, {
        x: centerX,
        y: A4_HEIGHT - marginY - cardHeight,
        width: cardWidth,
        height: cardHeight,
      })

      // Draw Back (Below Front)
      page.drawImage(backImg, {
        x: centerX,
        y: A4_HEIGHT - marginY - cardHeight - gapY - cardHeight,
        width: cardWidth,
        height: cardHeight,
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const newPdfUrl = URL.createObjectURL(blob)
      
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      setPdfUrl(newPdfUrl)
      setStatus('done')
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Error generating PDF.')
      setStatus('error')
    }
  }

  const resetAll = () => {
    setFrontUrl(null)
    setBackUrl(null)
    setPdfUrl(null)
    setStatus('idle')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-xl leading-tight flex items-center gap-2">
            <Printer className="w-5 h-5" /> Smart Aadhar Print Maker
          </h3>
          <p className="text-blue-100 text-sm mt-1">Perfectly align Front & Back of Aadhar/PAN on A4 sheet for standard PVC card printing.</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {status === 'done' && pdfUrl ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Print Ready!</h3>
            <p className="text-gray-500 mb-8">A4 PDF generated with exact 85x54mm PVC Card Dimensions.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <a 
                href={pdfUrl}
                download="Smart_Aadhar_Print.pdf"
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download A4 PDF
              </a>
              <button 
                onClick={resetAll}
                className="py-3.5 px-6 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Make Another
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* FRONT UPLOAD */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">1. Upload Front Side</label>
                <div 
                  onClick={() => frontInputRef.current?.click()}
                  className={\`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden \${frontUrl ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}\`}
                >
                  {frontUrl ? (
                    <img src={frontUrl} alt="Front" className="absolute inset-0 w-full h-full object-contain p-2" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Select Front Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" ref={frontInputRef} onChange={handleFrontUpload} />
                </div>
              </div>

              {/* BACK UPLOAD */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">2. Upload Back Side</label>
                <div 
                  onClick={() => backInputRef.current?.click()}
                  className={\`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden \${backUrl ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}\`}
                >
                  {backUrl ? (
                    <img src={backUrl} alt="Back" className="absolute inset-0 w-full h-full object-contain p-2" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Select Back Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" ref={backInputRef} onChange={handleBackUpload} />
                </div>
              </div>

            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
              <Maximize className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-900 text-sm">Automated Resizing</h4>
                <p className="text-xs text-indigo-700 mt-1">Both images will be automatically converted to 85.6mm x 54.0mm (standard PVC card dimension) and placed perfectly in the center of an A4 sheet for easy printing.</p>
              </div>
            </div>

            <button
              onClick={generateA4Print}
              disabled={status === 'processing' || !frontUrl || !backUrl}
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'processing' ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> Generating A4 PDF...</>
              ) : (
                <><FileText className="w-5 h-5" /> Generate Print-Ready PDF</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

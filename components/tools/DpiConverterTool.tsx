'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, ShieldCheck, Cpu, Sliders, Target, Share2 } from 'lucide-react'

interface Props {
  config: {
    dpi?: number
  }
}

type Status = 'idle' | 'processing' | 'done' | 'error'

// Simple CRC32 table helper for PNG chunk formatting
const CRC_TABLE = new Int32Array(256)
for (let i = 0; i < 256; i++) {
  let temp = i
  for (let j = 0; j < 8; j++) {
    if ((temp & 1) !== 0) {
      temp = 0xEDB88320 ^ (temp >>> 1)
    } else {
      temp = temp >>> 1
    }
  }
  CRC_TABLE[i] = temp
}

function crc32(data: Uint8Array): number {
  let c = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    c = CRC_TABLE[(c ^ data[i]) & 0xFF] ^ (c >>> 8)
  }
  return (c ^ 0xFFFFFFFF) >>> 0
}

// Client-side JFIF header modifier to force custom DPI density settings in JPEGs
function changeJfifDpi(arrayBuffer: ArrayBuffer, dpi: number): ArrayBuffer {
  const view = new DataView(arrayBuffer)
  const uint8 = new Uint8Array(arrayBuffer)

  if (view.getUint16(0) !== 0xFFD8) {
    return arrayBuffer // Not a valid JPEG SOI
  }

  let offset = 2
  const length = view.byteLength

  while (offset < length - 4) {
    const marker = view.getUint16(offset)
    const segmentLength = view.getUint16(offset + 2)

    if (marker === 0xFFE0) { // APP0 Marker
      if (
        uint8[offset + 4] === 0x4A && // 'J'
        uint8[offset + 5] === 0x46 && // 'F'
        uint8[offset + 6] === 0x49 && // 'I'
        uint8[offset + 7] === 0x46 && // 'F'
        uint8[offset + 8] === 0x00
      ) {
        view.setUint8(offset + 9, 1) // Density unit: 1 = dots per inch (DPI)
        view.setUint16(offset + 10, dpi) // X density
        view.setUint16(offset + 12, dpi) // Y density
        return arrayBuffer
      }
    }
    offset += 2 + segmentLength
  }

  // Prepend JFIF segment if missing (common in some raw canvas outputs)
  // Standard JFIF segment is 18 bytes: FF E0 00 10 4A 46 49 46 00 01 01 01 00 48 00 48 00 00
  const jfifSegment = new Uint8Array([
    0xFF, 0xE0, // APP0 Marker
    0x00, 0x10, // Segment Length (16 bytes)
    0x4A, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
    0x01, 0x01, // Version 1.01
    0x01, // Units: 1 = DPI
    (dpi >> 8) & 0xFF, dpi & 0xFF, // X density
    (dpi >> 8) & 0xFF, dpi & 0xFF, // Y density
    0x00, 0x00 // Thumbnail dimensions
  ])

  const newBuffer = new Uint8Array(arrayBuffer.byteLength + jfifSegment.length)
  newBuffer.set(uint8.subarray(0, 2), 0) // SOI
  newBuffer.set(jfifSegment, 2) // Prepend JFIF marker
  newBuffer.set(uint8.subarray(2), 2 + jfifSegment.length) // Remaining body
  return newBuffer.buffer
}

// Client-side PNG chunk modifier to insert/update pHYs (Physical Pixel Dimensions) chunk for DPI values
function changePngDpi(arrayBuffer: ArrayBuffer, dpi: number): ArrayBuffer {
  const dpm = Math.round(dpi / 0.0254) // convert dots per inch to pixels per meter
  const view = new DataView(arrayBuffer)
  const uint8 = new Uint8Array(arrayBuffer)

  // Verify PNG header signature
  if (
    uint8[0] !== 0x89 || uint8[1] !== 0x50 ||
    uint8[2] !== 0x4E || uint8[3] !== 0x47 ||
    uint8[4] !== 0x0D || uint8[5] !== 0x0A ||
    uint8[6] !== 0x1A || uint8[7] !== 0x0A
  ) {
    return arrayBuffer
  }

  let offset = 8
  const length = view.byteLength
  let physFound = false

  while (offset < length - 12) {
    const chunkLength = view.getUint32(offset)
    const chunkType = String.fromCharCode(
      uint8[offset + 4],
      uint8[offset + 5],
      uint8[offset + 6],
      uint8[offset + 7]
    )

    if (chunkType === 'pHYs') {
      physFound = true
      view.setUint32(offset + 8, dpm) // X pixels per meter
      view.setUint32(offset + 12, dpm) // Y pixels per meter
      view.setUint8(offset + 16, 1) // Unit: 1 = meter

      // Recompile chunk CRC
      const crcStart = offset + 4
      const crcLength = 4 + chunkLength
      const newCrc = crc32(uint8.subarray(crcStart, crcStart + crcLength))
      view.setUint32(offset + 8 + chunkLength, newCrc)
      return arrayBuffer
    }

    if (chunkType === 'IEND') break
    offset += 12 + chunkLength
  }

  // Prepend pHYs segment if missing, place right after IHDR chunk (offset 33 in standard PNGs)
  if (!physFound && uint8.length > 33) {
    // pHYs chunk: Length (00 00 00 09), Type (pHYs), Data (9 bytes), CRC (4 bytes) = 21 bytes
    const physChunk = new Uint8Array(21)
    const physView = new DataView(physChunk.buffer)
    physView.setUint32(0, 9) // Length: 9 bytes
    physChunk[4] = 0x70 // 'p'
    physChunk[5] = 0x48 // 'H'
    physChunk[6] = 0x59 // 'Y'
    physChunk[7] = 0x73 // 's'
    physView.setUint32(8, dpm) // X pixels/meter
    physView.setUint32(12, dpm) // Y pixels/meter
    physChunk[16] = 1 // Unit specifier: meter

    const crcVal = crc32(physChunk.subarray(4, 17))
    physView.setUint32(17, crcVal)

    // Insert pHYs chunk right after IHDR chunk (which ends at offset 33: signature (8) + IHDR length (12) + IHDR type (4) + data (13) + crc (4) = 33)
    const ihdrEndOffset = 33
    const newBuffer = new Uint8Array(arrayBuffer.byteLength + physChunk.length)
    newBuffer.set(uint8.subarray(0, ihdrEndOffset), 0)
    newBuffer.set(physChunk, ihdrEndOffset)
    newBuffer.set(uint8.subarray(ihdrEndOffset), ihdrEndOffset + physChunk.length)
    return newBuffer.buffer
  }

  return arrayBuffer
}

export default function DpiConverterTool({ config }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [finalFile, setFinalFile] = useState<Blob | null>(null)

  // Target settings
  const [targetDpi, setTargetDpi] = useState<number>(config.dpi || 300)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-run if targetDpi changes
  const processImageDpi = useCallback(async (file: File, dpi: number) => {
    setStatus('processing')
    try {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          if (!arrayBuffer) throw new Error("Could not read file binary.")

          let modifiedBuffer: ArrayBuffer
          if (file.type === 'image/png') {
            modifiedBuffer = changePngDpi(arrayBuffer, dpi)
          } else {
            modifiedBuffer = changeJfifDpi(arrayBuffer, dpi)
          }

          const outputBlob = new Blob([modifiedBuffer], { type: file.type || 'image/jpeg' })
          
          if (resultUrl) URL.revokeObjectURL(resultUrl)
          setFinalFile(outputBlob)
          setResultUrl(URL.createObjectURL(outputBlob))
          setStatus('done')
          setErrorMsg('')
        } catch (err: any) {
          setErrorMsg(err.message || "Failed modifying image metadata.")
          setStatus('error')
        }
      }

      reader.onerror = () => {
        setErrorMsg("Failed reading image file.")
        setStatus('error')
      }

      reader.readAsArrayBuffer(file)
    } catch (e: any) {
      setErrorMsg(e.message || "Execution exception occurred.")
      setStatus('error')
    }
  }, [resultUrl])

  // Handle uploaded file
  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png') && !file.type.startsWith('image/jpg')) {
      setErrorMsg('Invalid format. Please select a JPG, JPEG or PNG image to change DPI.')
      setStatus('error')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('Image size is too large (Max 25MB).')
      setStatus('error')
      return
    }

    setOriginalFile(file)
    processImageDpi(file, targetDpi)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDpi])

  const handleReset = () => {
    setStatus('idle')
    setOriginalFile(null)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setResultUrl(null)
    setFinalFile(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleShare = async () => {
    if (!resultUrl || !originalFile) return
    try {
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const file = new File([blob], `dpi-${originalFile.name}`, { type: originalFile.type || 'image/jpeg' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My DPI Converted Photo - SizeSnap',
          text: `I changed my image to ${targetDpi} DPI locally using SizeSnap.in!`,
        })
      } else {
        await navigator.clipboard.writeText("https://sizesnap.in")
        alert("Link copied to clipboard! You can paste and share it with your friends on WhatsApp.")
      }
    } catch (err) {
      console.error("Share failed", err)
    }
  }

  // Update DPI on the fly
  const handleDpiChange = (newDpi: number) => {
    setTargetDpi(newDpi)
    if (originalFile) {
      processImageDpi(originalFile, newDpi)
    }
  }

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight font-sans">Change Image DPI Online</h3>
          <p className="text-blue-100 text-xs mt-1">Convert image density to 200 DPI, 300 DPI, or 600 DPI instantly.</p>
        </div>
        <div className="bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-xs font-semibold self-start sm:self-auto">
          DENSITY TARGET: <span className="font-extrabold text-amber-300">{targetDpi} DPI</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State 1: File Upload */}
        {status === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/30'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base mb-1">
              Select Photo or Scanned Document
            </h4>
            <p className="text-xs text-gray-500">Supports JPEG, JPG, and PNG images up to 25MB.</p>
            
            <button className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-2">
              Choose Image File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* State 2: Processing */}
        {status === 'processing' && (
          <div className="text-center py-10 bg-slate-50/40 border border-gray-100 rounded-2xl animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin stroke-1.5" />
            <h4 className="font-bold text-gray-800 text-base">Modifying Resolution Metadata...</h4>
            <p className="text-xs text-gray-500 mt-1">Processing image binary chunks client-side.</p>
          </div>
        )}

        {/* State 3: Error */}
        {status === 'error' && (
          <div className="text-center py-10 bg-red-50/30 border border-red-100 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-1.5" />
            <h4 className="font-bold text-red-800 text-base">DPI Conversion Failed</h4>
            <p className="text-sm text-red-700 mt-1 max-w-sm mx-auto px-4">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-5 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              Reset and Retry
            </button>
          </div>
        )}

        {/* State 4: Done & Customizer */}
        {status === 'done' && resultUrl && originalFile && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Image Info */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 self-start mb-2 uppercase tracking-wider">Processed File:</span>
                <div className="w-full min-h-[220px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Dpi result"
                    className="max-w-xs max-h-56 object-contain rounded shadow-md border border-gray-200 bg-white"
                  />
                </div>
                <div className="mt-3 text-xs text-slate-500 font-medium">
                  File name: <span className="font-semibold text-slate-700">{originalFile.name}</span>
                </div>
              </div>

              {/* Right Column: Customizer Selector */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 shadow-inner space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    Select Target DPI density
                  </span>

                  {/* Preset DPI buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {[200, 300, 600].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleDpiChange(d)}
                        className={`py-2 text-sm font-bold border rounded-xl transition-all text-center ${
                          targetDpi === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {d} DPI
                      </button>
                    ))}
                  </div>

                  {/* Custom DPI Slider */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-indigo-500" />
                        Custom DPI density:
                      </span>
                      <span className="text-blue-600 font-extrabold">{targetDpi} DPI</span>
                    </div>
                    <input
                      type="range"
                      min={72}
                      max={1200}
                      step={1}
                      value={targetDpi}
                      onChange={e => handleDpiChange(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-gray-400">
                      <span>72 DPI</span>
                      <span>300 DPI (Standard)</span>
                      <span>1200 DPI</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
              <a
                href={resultUrl}
                download={`dpi-${targetDpi}-${originalFile.name}`}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-center text-sm cursor-pointer"
              >
                <Download className="w-5 h-5" />
                Download {targetDpi} DPI Image
              </a>
              <button
                onClick={handleShare}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm cursor-pointer border-none"
              >
                <Share2 className="w-4 h-4" />
                Share / Send
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Security Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-gray-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span><strong>Client-Side:</strong> Image header modification is done inside browser.</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span><strong>100% Secure:</strong> Scanned files are never uploaded to any servers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

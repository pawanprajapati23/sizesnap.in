'use client'
import dynamic from 'next/dynamic'

const ImageResizeTool = dynamic(() => import('@/components/tools/ImageResizeTool'), { ssr: false })
const ImageCompressTool = dynamic(() => import('@/components/tools/ImageCompressTool'), { ssr: false })
const PdfCompressTool = dynamic(() => import('@/components/tools/PdfCompressTool'), { ssr: false })
const ConvertImageTool = dynamic(() => import('@/components/tools/ConvertImageTool'), { ssr: false })
const ImageToPdfTool = dynamic(() => import('@/components/tools/ImageToPdfTool'), { ssr: false })
const MergePdfTool = dynamic(() => import('@/components/tools/MergePdfTool'), { ssr: false })
const PassportPhotoTool = dynamic(() => import('@/components/tools/PassportPhotoTool'), { ssr: false })
const SignatureResizeTool = dynamic(() => import('@/components/tools/SignatureResizeTool'), { ssr: false })
const HeicToJpgTool = dynamic(() => import('@/components/tools/HeicToJpgTool'), { ssr: false })
const BulkImageCompressTool = dynamic(() => import('@/components/tools/BulkImageCompressTool'), { ssr: false })
const PdfToJpgTool = dynamic(() => import('@/components/tools/PdfToJpgTool'), { ssr: false })
const DocumentScannerTool = dynamic(() => import('@/components/tools/DocumentScannerTool'), { ssr: false })
const WatermarkImageTool = dynamic(() => import('@/components/tools/WatermarkImageTool'), { ssr: false })
const WhatsAppDpTool = dynamic(() => import('@/components/tools/WhatsAppDpTool'), { ssr: false })

export default function ToolWrapper({ toolSlug, config }: { toolSlug: string, config: any }) {
  if (toolSlug === 'resize-image') return <ImageResizeTool config={config} />
  if (toolSlug === 'compress-image') return <ImageCompressTool config={config} />
  if (toolSlug === 'compress-pdf') return <PdfCompressTool config={config} />
  if (toolSlug === 'convert-image') return <ConvertImageTool config={config} />
  if (toolSlug === 'image-to-pdf') return <ImageToPdfTool config={config} />
  if (toolSlug === 'merge-pdf') return <MergePdfTool config={config} />
  if (toolSlug === 'passport-photo') return <PassportPhotoTool config={config} />
  if (toolSlug === 'signature-resize') return <SignatureResizeTool config={config} />
  if (toolSlug === 'heic-to-jpg') return <HeicToJpgTool config={config} />
  if (toolSlug === 'bulk-image-compress') return <BulkImageCompressTool config={config} />
  if (toolSlug === 'pdf-to-jpg') return <PdfToJpgTool config={config} />
  if (toolSlug === 'document-scanner') return <DocumentScannerTool config={config} />
  if (toolSlug === 'watermark-image') return <WatermarkImageTool config={config} />
  if (toolSlug === 'whatsapp-dp') return <WhatsAppDpTool config={config} />
  return null
}

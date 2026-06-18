export type ToolVariant = {
  slug: string
  label: string
  metaTitle: string
  metaDescription: string
  h1: string
  introParagraph: string
  config: {
    maxKB?: number
    width?: number
    height?: number
    format?: string
  }
}

export type Tool = {
  slug: string
  name: string
  shortName: string
  category: 'image' | 'pdf' | 'form'
  description: string
  icon: string
  variants: ToolVariant[]
}

const sizesKb = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900];
const sizesMb = [1, 1.5, 2, 3, 4, 5];

function buildSizeVariants(
  toolType: 'Resize Image' | 'Compress Image' | 'Compress PDF',
  baseSlug: string,
  extraIntro: string = ''
): ToolVariant[] {
  const variants: ToolVariant[] = [];

  for (const kb of sizesKb) {
    variants.push({
      slug: `to-${kb}kb`,
      label: `${kb} KB`,
      metaTitle: `${toolType} to ${kb}KB Online Free — Fast & Secure | SizeSnap`,
      metaDescription: `Free tool to ${toolType.toLowerCase()} to ${kb}KB online. Works in your browser. No watermark, no signup, 100% private.`,
      h1: `${toolType} to ${kb}KB Online Free`,
      introParagraph: `Need your file under ${kb}KB? This free online tool will ${toolType.toLowerCase()} to exactly ${kb}KB or less. ${extraIntro}`,
      config: { maxKB: kb }
    });
  }

  for (const mb of sizesMb) {
    const maxKB = mb * 1024;
    variants.push({
      slug: `to-${mb.toString().replace('.', '-')}mb`,
      label: `${mb} MB`,
      metaTitle: `${toolType} to ${mb}MB Online Free — Fast & Secure | SizeSnap`,
      metaDescription: `Free tool to ${toolType.toLowerCase()} to ${mb}MB online. Works in your browser. No watermark, no signup, 100% private.`,
      h1: `${toolType} to ${mb}MB Online Free`,
      introParagraph: `Need your file under ${mb}MB? This free online tool will ${toolType.toLowerCase()} to exactly ${mb}MB or less. ${extraIntro}`,
      config: { maxKB: maxKB }
    });
  }

  return variants;
}

const passportVariants: ToolVariant[] = [
  { slug: 'indian-passport', label: 'Indian Passport', metaTitle: 'Indian Passport Photo Maker Online Free | 35x45mm', metaDescription: 'Create standard Indian passport size photos (35x45mm) online for free.', h1: 'Indian Passport Photo Maker (35x45mm)', introParagraph: 'Easily set your image to exactly 35x45mm as required for Indian passport and Visa applications.', config: { width: 413, height: 531 } },
  { slug: 'us-visa', label: 'US Visa (2x2 inch)', metaTitle: 'US Visa Photo Maker Online Free | 2x2 inch', metaDescription: 'Create US Visa photos (2x2 inch / 600x600px) online for free.', h1: 'US Visa Photo Maker (2x2 inch)', introParagraph: 'Resize your photo to standard US Visa and Passport dimensions (600x600 pixels / 2x2 inches).', config: { width: 600, height: 600 } },
  { slug: 'uk-passport', label: 'UK Passport', metaTitle: 'UK Passport Photo Maker Online Free | 35x45mm', metaDescription: 'Create UK passport size photos (35x45mm) online for free.', h1: 'UK Passport Photo Maker', introParagraph: 'Resize your photo to standard UK Passport dimensions automatically.', config: { width: 413, height: 531 } },
  { slug: 'pan-card', label: 'PAN Card', metaTitle: 'PAN Card Photo Resize Online Free | 213x213px', metaDescription: 'Resize your photo for PAN card application (213x213px) online for free.', h1: 'PAN Card Photo Resizer (213x213px)', introParagraph: 'Format your photo perfectly for NSDL PAN card application (213x213 pixels, under 30KB).', config: { width: 213, height: 213, maxKB: 30 } },
  { slug: 'gate-exam', label: 'GATE Exam', metaTitle: 'GATE Exam Photo Resize Online Free | 3.5x4.5cm', metaDescription: 'Resize photo for GATE exam application (3.5x4.5 cm) online.', h1: 'GATE Exam Photo Resizer', introParagraph: 'Create a perfect passport size photo tailored for GATE exam applications dimensions.', config: { width: 413, height: 531, maxKB: 100 } }
];

const signatureVariants: ToolVariant[] = [
  { slug: '10kb', label: '10 KB', metaTitle: 'Resize Signature to 10KB Online Free', metaDescription: 'Resize your signature image to 10KB online. Perfect for government forms and exams.', h1: 'Resize Signature to 10KB', introParagraph: 'Compress your scanned signature to exactly 10KB. Often required for SSC, UPSC, and state-level exams.', config: { maxKB: 10 } },
  { slug: '20kb', label: '20 KB', metaTitle: 'Resize Signature to 20KB Online Free', metaDescription: 'Resize your signature image to 20KB online. Perfect for PAN card and forms.', h1: 'Resize Signature to 20KB', introParagraph: 'Compress your scanned signature to exactly 20KB. Often required for banking and central exams.', config: { maxKB: 20 } },
  { slug: '30kb', label: '30 KB', metaTitle: 'Resize Signature to 30KB Online Free', metaDescription: 'Resize your signature image to 30KB online.', h1: 'Resize Signature to 30KB', introParagraph: 'Compress your scanned signature to exactly 30KB.', config: { maxKB: 30 } },
  { slug: '50kb', label: '50 KB', metaTitle: 'Resize Signature to 50KB Online Free', metaDescription: 'Resize your signature image to 50KB online.', h1: 'Resize Signature to 50KB', introParagraph: 'Compress your scanned signature to exactly 50KB.', config: { maxKB: 50 } },
  { slug: 'pan-card-signature', label: 'PAN Card Sign', metaTitle: 'Resize Signature for PAN Card (10KB)', metaDescription: 'Resize your signature specifically for PAN Card application (under 10KB).', h1: 'PAN Card Signature Resizer', introParagraph: 'Format your signature image for NSDL PAN card application (under 10KB, 400x200px equivalent).', config: { width: 400, height: 200, maxKB: 10 } },
  { slug: 'ssc-signature', label: 'SSC Sign', metaTitle: 'Resize Signature for SSC Exam (10-20KB)', metaDescription: 'Resize your signature for SSC application forms. 4cm x 2cm.', h1: 'SSC Exam Signature Resizer', introParagraph: 'Resize your signature image exactly for SSC portal norms (4.0cm width x 2.0cm height, 10-20KB limit).', config: { width: 140, height: 60, maxKB: 20 } }
];

export const tools: Tool[] = [
  {
    slug: 'resize-image',
    name: 'Resize Image Online',
    shortName: 'Resize Image',
    category: 'image',
    description: 'Resize your image to any size in KB or MB instantly. No quality loss.',
    icon: '🖼️',
    variants: buildSizeVariants('Resize Image', 'resize-image', 'Perfect for government forms, ID proofs, and websites with strict file size limits. Done completely in your browser.')
  },
  {
    slug: 'compress-image',
    name: 'Compress Image Online',
    shortName: 'Compress Image',
    category: 'image',
    description: 'Compress images online without losing quality. Fast and private.',
    icon: '🗜️',
    variants: buildSizeVariants('Compress Image', 'compress-image', 'Reduce file size while keeping visual quality high. Your files are never uploaded to any server.')
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF Online',
    shortName: 'Compress PDF',
    category: 'pdf',
    description: 'Reduce PDF file size online without losing quality.',
    icon: '📄',
    variants: buildSizeVariants('Compress PDF', 'compress-pdf', 'Shrink your document for email attachments or portals. Secure, fast, client-side compression.')
  },
  {
    slug: 'passport-photo',
    name: 'Passport Photo Maker',
    shortName: 'Passport Maker',
    category: 'image',
    description: 'Create standard passport and visa photos online.',
    icon: '🛂',
    variants: passportVariants
  },
  {
    slug: 'signature-resize',
    name: 'Signature Resize Tool',
    shortName: 'Resize Signature',
    category: 'image',
    description: 'Resize signature scans for online applications and forms.',
    icon: '✍️',
    variants: signatureVariants
  },
  {
    slug: 'convert-image',
    name: 'Convert Image Format Online',
    shortName: 'Convert Image',
    category: 'image',
    description: 'Convert images to JPG, PNG, or WEBP instantly.',
    icon: '🔄',
    variants: [
      { slug: 'to-jpg', label: 'To JPG', metaTitle: 'Convert Image to JPG Online Free', metaDescription: 'Convert PNG, WEBP to JPG.', h1: 'Convert Image to JPG', introParagraph: 'Seamlessly convert your images to JPG format.', config: { format: 'jpg' } },
      { slug: 'to-png', label: 'To PNG', metaTitle: 'Convert Image to PNG Online Free', metaDescription: 'Convert JPG, WEBP to PNG.', h1: 'Convert Image to PNG', introParagraph: 'Instantly turn your photos into PNGs.', config: { format: 'png' } },
      { slug: 'to-webp', label: 'To WEBP', metaTitle: 'Convert Image to WEBP Online Free', metaDescription: 'Convert JPG and PNG to WEBP.', h1: 'Convert Image to WEBP', introParagraph: 'Optimize your images by converting them to WEBP.', config: { format: 'webp' } }
    ]
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF Converter',
    shortName: 'Image to PDF',
    category: 'pdf',
    description: 'Convert JPG, PNG, and other images to PDF document.',
    icon: '📸',
    variants: [
      { slug: 'convert', label: 'Image to PDF', metaTitle: 'Image to PDF Converter Online Free', metaDescription: 'Convert images to PDF format instantly.', h1: 'Convert Image to PDF Online', introParagraph: 'Need to turn your photos into a PDF? Convert images into a PDF document.', config: { format: 'pdf' } }
    ]
  },
  {
    slug: 'merge-pdf',
    name: 'Merge PDF Online',
    shortName: 'Merge PDF',
    category: 'pdf',
    description: 'Combine multiple PDF files into one single document.',
    icon: '🔗',
    variants: [
      { slug: 'combine', label: 'Combine PDFs', metaTitle: 'Merge PDF Online Free', metaDescription: 'Combine two or more PDF files into a single PDF.', h1: 'Merge PDF Files Online Free', introParagraph: 'Seamlessly combine multiple PDF documents into one.', config: { format: 'merge' } }
    ]
  },
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG Converter',
    shortName: 'HEIC to JPG',
    category: 'image',
    description: 'Convert iPhone HEIC photos to standard JPG format directly in your browser.',
    icon: '🍏',
    variants: [
      { slug: 'convert', label: 'HEIC to JPG', metaTitle: 'HEIC to JPG Converter Online Free | Apple Photo to JPG', metaDescription: 'Convert iPhone HEIC format images to JPG online instantly. Free, secure, client-side processing.', h1: 'Convert HEIC to JPG Online', introParagraph: 'Easily change your iPhone Apple Photos formats (HEIC) into standard JPG format for uploading anywhere.', config: {} }
    ]
  },
  {
    slug: 'bulk-image-compress',
    name: 'Bulk Image Compressor',
    shortName: 'Bulk Compress Images',
    category: 'image',
    description: 'Select up to 20 images and compress them all at once to a specific file size.',
    icon: '📚',
    variants: [
      { slug: 'batch', label: 'Bulk Compress', metaTitle: 'Bulk Image Compressor Online Free | Batch Resize to 50KB', metaDescription: 'Compress multiple images at once. Bulk resize to 50KB, 100KB, etc.', h1: 'Bulk Image Compressor', introParagraph: 'Select multiple photos and compress them together to save time. Perfect for uploading batches of photos.', config: {} }
    ]
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Extractor',
    shortName: 'PDF to Image',
    category: 'pdf',
    description: 'Extract every page of a PDF file into separate high-quality JPG images.',
    icon: '📑',
    variants: [
      { slug: 'extract', label: 'PDF to JPG', metaTitle: 'PDF to JPG Online Fast | Extract PDF Pages to Image', metaDescription: 'Convert a PDF to JPG online. Extract all your PDF pages to standard JPG images free.', h1: 'Extract PDF to JPG Images', introParagraph: 'Upload a PDF to instantly extract each page into its own individual JPG image file.', config: {} }
    ]
  },
  {
    slug: 'document-scanner',
    name: 'Document Scanner (B&W Filter)',
    shortName: 'Doc Scanner',
    category: 'image',
    description: 'Apply a black & white scanner filter to document photos (Marksheet, Aadhar) to remove shadows and improve readability.',
    icon: '🖨️',
    variants: [
      { slug: 'bw-filter', label: 'B&W Filter', metaTitle: 'Image to Black & White Scanner Online Free', metaDescription: 'Apply a scanner filter to your document photos. Make background white and text black.', h1: 'Document Scanner Filter', introParagraph: 'Easily remove shadows and make your phone photos look like they were scanned from a real printer.', config: {} }
    ]
  },
  {
    slug: 'watermark-image',
    name: 'Add Text & Date on Photo',
    shortName: 'Add Name/Date',
    category: 'image',
    description: 'Easily add your name, date, or watermark on your photo as required by many exam application forms.',
    icon: '🏷️',
    variants: [
      { slug: 'add-text', label: 'Add Name & Date', metaTitle: 'Add Name and Date on Photo Online Free', metaDescription: 'Add your name and date on your passport photo for exam application forms instantly online.', h1: 'Add Name & Date on Photo', introParagraph: 'Some forms require your photo to have your name and the date printed at the bottom. Use this tool to add it in seconds.', config: {} }
    ]
  },
  {
    slug: 'whatsapp-dp',
    name: 'No Crop WhatsApp DP Maker',
    shortName: 'DP Maker',
    category: 'image',
    description: 'Make your rectangular photo fully square with a blurred background so you don\'t have to crop it for WhatsApp or Instagram.',
    icon: '⬛',
    variants: [
      { slug: 'no-crop', label: 'Square Photo', metaTitle: 'WhatsApp DP Without Crop Online Free | Square Fit Image', metaDescription: 'Set full picture as WhatsApp DP without cropping. Add blur or white background to make square photos.', h1: 'Make WhatsApp DP Without Cropping', introParagraph: 'Stop cropping away the best parts of your picture! Fit your entire rectangular photo into a perfect square by adding a beautiful blurred background.', config: {} }
    ]
  }
]

export function getAllPaths() {
  return tools.flatMap(tool =>
    tool.variants.map(variant => ({
      tool: tool.slug,
      variant: variant.slug
    }))
  )
}

export function getToolAndVariant(toolSlug: string, variantSlug: string) {
  const tool = tools.find(t => t.slug === toolSlug)
  if (!tool) return null
  const variant = tool.variants.find(v => v.slug === variantSlug)
  if (!variant) return null
  return { tool, variant }
}

export function getToolsByCategory(category: Tool['category']) {
  return tools.filter(t => t.category === category)
}

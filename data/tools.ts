export type ToolCategoryId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface ToolCategory {
  id: ToolCategoryId;
  title: string;
  description: string;
}

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  categoryId: ToolCategoryId;
  categoryTitle: string;
  shortDesc?: string;
  popular?: boolean;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'A',
    title: 'Most Used Tools',
    description: 'Frequently accessed image resizing, compression, and photo utilities',
  },
  {
    id: 'B',
    title: 'Basic Editing',
    description: 'Essential image manipulation, cropping, background, and metadata tools',
  },
  {
    id: 'C',
    title: 'Blur, Pixelate and Special Effects',
    description: 'Filter effects, artistic enhancements, facial retouching, and censoring',
  },
  {
    id: 'D',
    title: 'DPI & Quality',
    description: 'High-resolution conversion, print DPI adjustments, and image upscaling',
  },
  {
    id: 'E',
    title: 'General Resizing',
    description: 'Pixel, metric, imperial, bulk, and AI-powered dimension scaling',
  },
  {
    id: 'F',
    title: 'Resize Other Official Sizes',
    description: 'Standard dimensions for government examinations, identity cards, and documents',
  },
  {
    id: 'G',
    title: 'Compress & Convert',
    description: 'File size reduction by target KB and format transformations between JPG, PNG, WebP, and PDF',
  },
];

export const ALL_TOOLS: ToolItem[] = [
  // SECTION A: Most Used Tools
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    slug: 'passport-photo-maker',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'reduce-image-size-in-kb',
    name: 'Reduce Image Size in KB',
    slug: 'reduce-image-size-in-kb',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'resize-image-pixel',
    name: 'Resize Image Pixel',
    slug: 'resize-image-pixel',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'text-to-handwriting',
    name: 'Text to Handwriting',
    slug: 'text-to-handwriting',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'image-to-text-ocr',
    name: 'Image to Text (OCR)',
    slug: 'image-to-text-ocr',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'photo-collage-maker',
    name: 'Photo Collage Maker',
    slug: 'photo-collage-maker',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'generate-signature',
    name: 'Generate Signature',
    slug: 'generate-signature',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'increase-image-size-in-kb',
    name: 'Increase Image Size in KB',
    slug: 'increase-image-size-in-kb',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'ai-photo-enhancer',
    name: 'AI Photo Enhancer',
    slug: 'ai-photo-enhancer',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'resize-signature',
    name: 'Resize Signature',
    slug: 'resize-signature',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'resize-image-in-centimeter',
    name: 'Resize Image in Centimeter',
    slug: 'resize-image-in-centimeter',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },
  {
    id: 'resize-image-3-5cm-4-5cm',
    name: 'Resize Image (3.5cm x 4.5cm)',
    slug: 'resize-image-3-5cm-4-5cm',
    categoryId: 'A',
    categoryTitle: 'Most Used Tools',
    popular: true,
  },

  // SECTION B: Basic Editing
  {
    id: 'blur-background',
    name: 'Blur Background',
    slug: 'blur-background',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    slug: 'remove-background',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'remove-object-from-photo',
    name: 'Remove Object from Photo',
    slug: 'remove-object-from-photo',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'add-name-dob-on-photo',
    name: 'Add Name & DOB on Photo',
    slug: 'add-name-dob-on-photo',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'rotate-image',
    name: 'Rotate Image',
    slug: 'rotate-image',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'flip-image',
    name: 'Flip Image',
    slug: 'flip-image',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'watermark-images',
    name: 'Watermark Images',
    slug: 'watermark-images',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'freehand-crop',
    name: 'Freehand Crop',
    slug: 'freehand-crop',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'circle-crop',
    name: 'Circle Crop',
    slug: 'circle-crop',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'square-crop',
    name: 'Square Crop',
    slug: 'square-crop',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'round-corners',
    name: 'Round Corners',
    slug: 'round-corners',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'change-aspect-ratio',
    name: 'Change Aspect Ratio',
    slug: 'change-aspect-ratio',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'merge-photo-signature',
    name: 'Merge Photo & Signature',
    slug: 'merge-photo-signature',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'join-multiple-images',
    name: 'Join Multiple Images',
    slug: 'join-multiple-images',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'split-image',
    name: 'Split Image',
    slug: 'split-image',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'image-color-picker',
    name: 'Image Color Picker',
    slug: 'image-color-picker',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'edit-metadata',
    name: 'Edit Metadata',
    slug: 'edit-metadata',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'view-metadata',
    name: 'View Metadata',
    slug: 'view-metadata',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'remove-metadata',
    name: 'Remove Metadata',
    slug: 'remove-metadata',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'crop-png',
    name: 'Crop PNG',
    slug: 'crop-png',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },

  // SECTION C: Blur, Pixelate and Special Effects
  {
    id: 'beautify-image',
    name: 'Beautify Image',
    slug: 'beautify-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'deep-fry-photo',
    name: 'Deep Fry Photo',
    slug: 'deep-fry-photo',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'unblur-image',
    name: 'Unblur Image',
    slug: 'unblur-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'blur-image',
    name: 'Blur Image',
    slug: 'blur-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'blur-face',
    name: 'Blur Face',
    slug: 'blur-face',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'unblur-face',
    name: 'Unblur Face',
    slug: 'unblur-face',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'add-border-to-image',
    name: 'Add Border To Image',
    slug: 'add-border-to-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'pixelate-image',
    name: 'Pixelate Image',
    slug: 'pixelate-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'pixelate-face',
    name: 'Pixelate Face',
    slug: 'pixelate-face',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'censor-photo',
    name: 'Censor Photo',
    slug: 'censor-photo',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'motion-blur',
    name: 'Motion Blur',
    slug: 'motion-blur',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'grayscale-image',
    name: 'Grayscale Image',
    slug: 'grayscale-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'black-and-white',
    name: 'Black & White',
    slug: 'black-and-white',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'picture-to-pixel-art',
    name: 'Picture to Pixel Art',
    slug: 'picture-to-pixel-art',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'add-white-border-to-image',
    name: 'Add White Border To Image',
    slug: 'add-white-border-to-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'ai-face-generator',
    name: 'AI Face Generator',
    slug: 'ai-face-generator',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'blemishes-remover',
    name: 'Blemishes Remover',
    slug: 'blemishes-remover',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'retouch-image',
    name: 'Retouch Image',
    slug: 'retouch-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'add-text-to-image',
    name: 'Add Text to Image',
    slug: 'add-text-to-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },
  {
    id: 'add-logo-to-image',
    name: 'Add Logo to Image',
    slug: 'add-logo-to-image',
    categoryId: 'C',
    categoryTitle: 'Blur, Pixelate and Special Effects',
  },

  // SECTION D: DPI & Quality
  {
    id: 'increase-image-quality',
    name: 'Increase Image Quality',
    slug: 'increase-image-quality',
    categoryId: 'D',
    categoryTitle: 'DPI & Quality',
  },
  {
    id: 'convert-dpi-200-300-600',
    name: 'Convert DPI (200, 300, 600)',
    slug: 'convert-dpi-200-300-600',
    categoryId: 'D',
    categoryTitle: 'DPI & Quality',
  },
  {
    id: 'check-image-dpi',
    name: 'Check Image DPI',
    slug: 'check-image-dpi',
    categoryId: 'D',
    categoryTitle: 'DPI & Quality',
  },
  {
    id: 'super-resolution',
    name: 'Super Resolution',
    slug: 'super-resolution',
    categoryId: 'D',
    categoryTitle: 'DPI & Quality',
  },

  // SECTION E: General Resizing
  {
    id: 'resize-image-by-pixel',
    name: 'Resize Image by Pixel',
    slug: 'resize-image-by-pixel',
    categoryId: 'E',
    categoryTitle: 'General Resizing',
  },
  {
    id: 'resize-in-centimeters',
    name: 'Resize in Centimeters',
    slug: 'resize-in-centimeters',
    categoryId: 'E',
    categoryTitle: 'General Resizing',
  },
  {
    id: 'resize-in-millimeters',
    name: 'Resize in Millimeters',
    slug: 'resize-in-millimeters',
    categoryId: 'E',
    categoryTitle: 'General Resizing',
  },
  {
    id: 'resize-in-inches',
    name: 'Resize in Inches',
    slug: 'resize-in-inches',
    categoryId: 'E',
    categoryTitle: 'General Resizing',
  },
  {
    id: 'bulk-image-resizer',
    name: 'Bulk Image Resizer',
    slug: 'bulk-image-resizer',
    categoryId: 'E',
    categoryTitle: 'General Resizing',
  },
  {
    id: 'upscale-image-with-ai',
    name: 'Upscale Image With AI',
    slug: 'upscale-image-with-ai',
    categoryId: 'E',
    categoryTitle: 'General Resizing',
  },

  // SECTION F: Resize Other Official Sizes
  {
    id: 'a4-size',
    name: 'A4 Size',
    slug: 'a4-size',
    categoryId: 'F',
    categoryTitle: 'Resize Other Official Sizes',
  },
  {
    id: 'ssc-photo-resize',
    name: 'SSC Photo Resize',
    slug: 'ssc-photo-resize',
    categoryId: 'F',
    categoryTitle: 'Resize Other Official Sizes',
  },
  {
    id: 'pan-card',
    name: 'PAN Card',
    slug: 'pan-card',
    categoryId: 'F',
    categoryTitle: 'Resize Other Official Sizes',
  },
  {
    id: 'upsc-photo',
    name: 'UPSC Photo',
    slug: 'upsc-photo',
    categoryId: 'F',
    categoryTitle: 'Resize Other Official Sizes',
  },
  {
    id: 'psc-photo',
    name: 'PSC Photo',
    slug: 'psc-photo',
    categoryId: 'F',
    categoryTitle: 'Resize Other Official Sizes',
  },

  // SECTION G: Compress & Convert
  {
    id: 'compress-image',
    name: 'Compress Image',
    slug: 'compress-image',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'compress-image-to-20kb',
    name: 'Compress Image to 20KB',
    slug: 'compress-image-to-20kb',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'compress-image-to-50kb',
    name: 'Compress Image to 50KB',
    slug: 'compress-image-to-50kb',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'compress-image-to-100kb',
    name: 'Compress Image to 100KB',
    slug: 'compress-image-to-100kb',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    slug: 'jpg-to-png',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    slug: 'png-to-jpg',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG',
    slug: 'webp-to-jpg',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'jpg-to-webp',
    name: 'JPG to WebP',
    slug: 'jpg-to-webp',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    slug: 'image-to-pdf',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    slug: 'pdf-to-images',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'merge-pdfs',
    name: 'Merge PDFs',
    slug: 'merge-pdfs',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    slug: 'rotate-pdf',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    slug: 'delete-pdf-pages',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    slug: 'extract-pdf-pages',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'add-page-numbers-pdf',
    name: 'Add Page Numbers to PDF',
    slug: 'add-page-numbers-pdf',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'add-watermark-pdf',
    name: 'Add Watermark to PDF',
    slug: 'add-watermark-pdf',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    slug: 'crop-image',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
    popular: true,
  },
  {
    id: 'image-to-webp',
    name: 'Image to WebP',
    slug: 'image-to-webp',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'image-to-avif',
    name: 'Image to AVIF',
    slug: 'image-to-avif',
    categoryId: 'G',
    categoryTitle: 'Compress & Convert',
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    slug: 'image-to-base64',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'base64-to-image',
    name: 'Base64 to Image',
    slug: 'base64-to-image',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'image-metadata-viewer',
    name: 'Image Metadata Viewer',
    slug: 'image-metadata-viewer',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    slug: 'favicon-generator',
    categoryId: 'B',
    categoryTitle: 'Basic Editing',
    popular: true,
  },
  // SECTION E: Student Calculators
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: true,
  },
  {
    id: 'cgpa-to-percentage',
    name: 'CGPA to Percentage Calculator',
    slug: 'cgpa-to-percentage',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: true,
  },
  {
    id: 'sgpa-to-percentage',
    name: 'SGPA to Percentage Calculator',
    slug: 'sgpa-to-percentage',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: true,
  },
  {
    id: 'marks-percentage-calculator',
    name: 'Marks Percentage Calculator',
    slug: 'marks-percentage-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: true,
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    slug: 'attendance-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: true,
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: false,
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    slug: 'cgpa-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: false,
  },
  {
    id: 'required-marks-calculator',
    name: 'Required Marks Calculator',
    slug: 'required-marks-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: false,
  },
  {
    id: 'exam-percentage-calculator',
    name: 'Exam Percentage Calculator',
    slug: 'exam-percentage-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: false,
  },
  {
    id: 'study-hours-calculator',
    name: 'Study Hours Calculator',
    slug: 'study-hours-calculator',
    categoryId: 'E',
    categoryTitle: 'Student Calculators',
    popular: false,
  },
];

// Sidebar quick links specified by the user
export interface SidebarLink {
  title: string;
  slug: string;
}

export const SIDEBAR_QUICK_LINKS: SidebarLink[] = [
  { title: 'Increase Image Size in KB', slug: 'increase-image-size-in-kb' },
  { title: 'PDF To Images', slug: 'pdf-to-images' },
  { title: 'Remove Background', slug: 'remove-background' },
  { title: 'SizeSnap PDF Tools', slug: 'compress-pdf' },
  { title: 'Images To PDF', slug: 'image-to-pdf' },
  { title: 'Signature Maker', slug: 'generate-signature' },
  { title: 'Blur Background', slug: 'blur-background' },
  { title: 'Increase Image Quality', slug: 'increase-image-quality' },
];

// Navigation menu configuration
export interface NavDropdownItem {
  name: string;
  slug: string;
  href?: string;
}

export interface NavMenu {
  label: string;
  href?: string;
  items?: NavDropdownItem[];
}

export const NAV_MENUS: NavMenu[] = [
  {
    label: 'Image Tools',
    items: [
      { name: 'Passport Photo Maker', slug: 'passport-photo-maker' },
      { name: 'Remove Background', slug: 'remove-background' },
      { name: 'Blur Background', slug: 'blur-background' },
      { name: 'Circle Crop', slug: 'circle-crop' },
      { name: 'Watermark Images', slug: 'watermark-images' },
      { name: 'AI Photo Enhancer', slug: 'ai-photo-enhancer' },
      { name: 'Photo Collage Maker', slug: 'photo-collage-maker' },
    ],
  },
  {
    label: 'Resize Image',
    items: [
      { name: 'Resize Image Pixel', slug: 'resize-image-pixel' },
      { name: 'Resize in Centimeters', slug: 'resize-in-centimeters' },
      { name: 'Resize in Millimeters', slug: 'resize-in-millimeters' },
      { name: 'Resize in Inches', slug: 'resize-in-inches' },
      { name: 'Resize (3.5cm x 4.5cm)', slug: 'resize-image-3-5cm-4-5cm' },
      { name: 'SSC Photo Resize', slug: 'ssc-photo-resize' },
      { name: 'PAN Card Photo', slug: 'pan-card' },
    ],
  },
  {
    label: 'Compress Image',
    items: [
      { name: 'Compress Image (Auto)', slug: 'compress-image' },
      { name: 'Reduce Image Size in KB', slug: 'reduce-image-size-in-kb' },
      { name: 'Compress to 20KB', slug: 'compress-image-to-20kb' },
      { name: 'Compress to 50KB', slug: 'compress-image-to-50kb' },
      { name: 'Compress to 100KB', slug: 'compress-image-to-100kb' },
      { name: 'Increase Image Size in KB', slug: 'increase-image-size-in-kb' },
    ],
  },
  {
    label: 'PDF Tools',
    items: [
      { name: 'Image to PDF', slug: 'image-to-pdf' },
      { name: 'PDF to Images', slug: 'pdf-to-images' },
      { name: 'Compress PDF', slug: 'compress-pdf' },
      { name: 'Merge PDFs', slug: 'merge-pdfs' },
      { name: 'Split PDF', slug: 'split-pdf' },
    ],
  },
  {
    label: 'Convert Image',
    items: [
      { name: 'JPG to PNG', slug: 'jpg-to-png' },
      { name: 'PNG to JPG', slug: 'png-to-jpg' },
      { name: 'WebP to JPG', slug: 'webp-to-jpg' },
      { name: 'JPG to WebP', slug: 'jpg-to-webp' },
    ],
  },
  {
    label: 'Govt Exams',
    href: '/exams',
    items: [
      { name: 'All Govt Exam Presets', slug: 'exams-hub', href: '/exams' },
      { name: 'SSC (CGL, CHSL, GD, MTS)', slug: 'ssc-photo-signature-resizer', href: '/exams/ssc-photo-signature-resizer' },
      { name: 'UPSC (CSE, NDA, OTR)', slug: 'upsc-photo-signature-resizer', href: '/exams/upsc-photo-signature-resizer' },
      { name: 'Delhi Police Constable', slug: 'delhi-police-photo-resizer', href: '/exams/delhi-police-photo-resizer' },
      { name: 'UP Police Bharti (20-50KB)', slug: 'up-police-photo-resizer', href: '/exams/up-police-photo-resizer' },
      { name: 'IBPS / SBI Bank 4-in-1', slug: 'ibps-bank-photo-signature-resizer', href: '/exams/ibps-bank-photo-signature-resizer' },
    ],
  },
  {
    label: 'Student Calculators',
    href: '/student-calculators',
    items: [
      { name: 'Percentage Calculator', slug: 'percentage-calculator', href: '/percentage-calculator' },
      { name: 'CGPA to Percentage', slug: 'cgpa-to-percentage', href: '/cgpa-to-percentage' },
      { name: 'SGPA to Percentage', slug: 'sgpa-to-percentage', href: '/sgpa-to-percentage' },
      { name: 'Attendance Calculator', slug: 'attendance-calculator', href: '/attendance-calculator' },
      { name: 'Study Hours Calculator', slug: 'study-hours-calculator', href: '/study-hours-calculator' },
      { name: 'View All Calculators', slug: 'all-calculators', href: '/student-calculators' },
    ],
  },
  {
    label: 'All Tools',
    href: '/#directory',
  },
];

export function getToolBySlug(slug: string): ToolItem | undefined {
  return ALL_TOOLS.find((tool) => tool.slug === slug);
}

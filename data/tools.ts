export type ToolCategoryId = 'image' | 'pdf' | 'ecommerce' | 'exam' | 'student' | 'calculator' | 'text' | 'social' | 'seo' | 'developer';

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
  shortDescription?: string;
  keywords?: string[];
  aliases?: string[];
  searchIntent?: string;
  relatedTools?: string[];
  supportedFormats?: string[];
  processingType?: 'client' | 'server';
  status?: 'production' | 'draft' | 'deprecated';
  seoPriority?: 'High' | 'Medium' | 'Low';
  analyticsIdentifier?: string;
  popular?: boolean;
  shortDesc?: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: 'text', title: 'Text Tools', description: 'Essential formatting, counting, and string manipulation utilities' },
  { id: 'image', title: 'Image Tools', description: 'Frequently accessed image resizing, compression, and photo utilities' },
  { id: 'pdf', title: 'PDF Tools', description: 'Essential PDF manipulation, compression, and conversion tools' },
  { id: 'calculator', title: 'Calculator Tools', description: 'Percentage, attendance, and general calculator tools' },
  { id: 'exam', title: 'Exam Tools', description: 'Standard dimensions for government examinations and documents' },
  { id: 'ecommerce', title: 'E-commerce Tools', description: 'Tools for e-commerce sellers' },
];

export const ALL_TOOLS: ToolItem[] = [

  {
    id: 'character-frequency-counter',
    name: 'Character Frequency Counter',
    slug: 'character-frequency-counter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Count the frequency of each character, letter, or symbol in a text block instantly.',
    keywords: ['character frequency', 'letter frequency', 'count letters'],
    aliases: ['letter frequency counter', 'word letter count', 'symbol frequency'],
    searchIntent: 'Utility',
    relatedTools: ['character-counter', 'word-counter'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'character-frequency-counter'
  },
  {
    id: 'line-counter',
    name: 'Line Counter',
    slug: 'line-counter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Count total lines, empty lines, and lines with content in any text file or block.',
    keywords: ['line counter', 'count lines', 'number of lines'],
    aliases: ['count empty lines', 'text line counter'],
    searchIntent: 'Utility',
    relatedTools: ['remove-empty-lines', 'word-counter'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'line-counter'
  },

  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Free online word counter. Count words, characters, sentences, paragraphs, and estimate reading time instantly.',
    keywords: ['word counter', 'word count', 'count words', 'character counter'],
    aliases: ['word count', 'count words', 'word count checker', 'count words online', 'word counter online'],
    searchIntent: 'Utility',
    relatedTools: ['character-counter', 'sentence-counter', 'reading-time-calculator'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'High',
    analyticsIdentifier: 'word-counter',
    popular: true
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    slug: 'character-counter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Free online character counter. Count total characters, letters, numbers, and spaces with or without spaces.',
    keywords: ['character counter', 'character count', 'count characters'],
    aliases: ['character count', 'count characters', 'character counter online'],
    searchIntent: 'Utility',
    relatedTools: ['word-counter', 'sentence-counter', 'reading-time-calculator'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'character-counter'
  },
  {
    id: 'sentence-counter',
    name: 'Sentence Counter',
    slug: 'sentence-counter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Count sentences and calculate average words per sentence instantly.',
    keywords: ['sentence counter', 'count sentences', 'sentence count'],
    aliases: ['count sentences', 'sentence count', 'sentence counter online'],
    searchIntent: 'Utility',
    relatedTools: ['word-counter', 'character-counter', 'reading-time-calculator'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'sentence-counter'
  },
  {
    id: 'reading-time-calculator',
    name: 'Reading Time Calculator',
    slug: 'reading-time-calculator',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Calculate the estimated reading time of any text, article, or script with adjustable WPM.',
    keywords: ['reading time', 'reading time calculator', 'read time'],
    aliases: ['read time calculator', 'estimate reading time', 'script length calculator'],
    searchIntent: 'Utility',
    relatedTools: ['word-counter', 'character-counter', 'sentence-counter'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'reading-time-calculator'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
    keywords: ['case converter', 'change case', 'uppercase to lowercase', 'title case converter'],
    aliases: ['change case', 'upper case converter', 'lower case converter', 'capitalizer'],
    searchIntent: 'Utility',
    relatedTools: ['text-cleaner', 'text-reverse', 'text-repeater'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'High',
    analyticsIdentifier: 'case-converter'
  },
  {
    id: 'text-repeater',
    name: 'Text Repeater',
    slug: 'text-repeater',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Repeat text or strings multiple times with custom separators quickly and safely.',
    keywords: ['text repeater', 'repeat text', 'string repeater'],
    aliases: ['repeat text', 'repeat sentence', 'text repeater online'],
    searchIntent: 'Utility',
    relatedTools: ['case-converter', 'text-reverse', 'text-cleaner'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'text-repeater'
  },
  {
    id: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    slug: 'remove-duplicate-lines',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Instantly remove duplicate lines from a text list. Supports case-sensitive matching.',
    keywords: ['remove duplicate lines', 'delete duplicates', 'unique lines'],
    aliases: ['delete duplicate lines', 'remove duplicates online', 'unique text list'],
    searchIntent: 'Utility',
    relatedTools: ['sort-lines', 'remove-empty-lines', 'text-cleaner'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'remove-duplicate-lines'
  },
  {
    id: 'sort-lines',
    name: 'Sort Lines',
    slug: 'sort-lines',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Sort text lines alphabetically (A-Z) or numerically (ascending/descending).',
    keywords: ['sort lines', 'alphabetize', 'alphabetizer', 'sort list'],
    aliases: ['alphabetize list', 'sort list alphabetically', 'number sorter'],
    searchIntent: 'Utility',
    relatedTools: ['remove-duplicate-lines', 'remove-empty-lines', 'text-cleaner'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'sort-lines'
  },
  {
    id: 'remove-empty-lines',
    name: 'Remove Empty Lines',
    slug: 'remove-empty-lines',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Clean up text by removing blank, empty, or whitespace-only lines instantly.',
    keywords: ['remove empty lines', 'delete blank lines', 'remove whitespace'],
    aliases: ['delete empty lines', 'remove blank lines', 'clear empty lines'],
    searchIntent: 'Utility',
    relatedTools: ['text-cleaner', 'remove-duplicate-lines', 'sort-lines'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'remove-empty-lines'
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner',
    slug: 'text-cleaner',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Clean up messy text: remove extra spaces, trim lines, fix tabs, and remove empty lines.',
    keywords: ['text cleaner', 'clean text', 'remove extra spaces', 'trim whitespace'],
    aliases: ['clean messy text', 'remove double spaces', 'whitespace remover'],
    searchIntent: 'Utility',
    relatedTools: ['remove-empty-lines', 'remove-duplicate-lines', 'find-and-replace'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'High',
    analyticsIdentifier: 'text-cleaner'
  },
  {
    id: 'find-and-replace',
    name: 'Find & Replace',
    slug: 'find-and-replace',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Find and replace text online. Supports case-sensitivity and whole word matching.',
    keywords: ['find and replace', 'replace text', 'search and replace'],
    aliases: ['replace words online', 'text replacer', 'string replace'],
    searchIntent: 'Utility',
    relatedTools: ['text-cleaner', 'remove-duplicate-lines', 'case-converter'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'find-and-replace'
  },
  {
    id: 'text-reverse',
    name: 'Text Reverse',
    slug: 'text-reverse',
    categoryId: 'text',
    categoryTitle: 'Text Tools',
    shortDescription: 'Reverse text characters, reverse words, or reverse line orders online.',
    keywords: ['text reverse', 'reverse text', 'backwards text generator', 'reverse words'],
    aliases: ['reverse string', 'reverse characters', 'backward text'],
    searchIntent: 'Utility',
    relatedTools: ['case-converter', 'text-repeater', 'sort-lines'],
    processingType: 'client',
    status: 'production',
    seoPriority: 'Medium',
    analyticsIdentifier: 'text-reverse'
  },
  {
    "id": "product-image-maker",
    "name": "Product Image Maker",
    "slug": "product-image-maker",
    "categoryId": "ecommerce",
    "categoryTitle": "E-commerce Tools",
    "shortDescription": "Free online tool for product image maker.",
    "keywords": [
      "product image maker",
      "e-commerce seller tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "product-image-maker",
    "popular": false
  },
  {
    "id": "passport-photo-maker",
    "name": "Passport Photo Maker",
    "slug": "passport-photo-maker",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for passport photo maker.",
    "keywords": [
      "passport photo maker",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "passport-photo-maker",
    "popular": true
  },
  {
    "id": "reduce-image-size-in-kb",
    "name": "Reduce Image Size in KB",
    "slug": "reduce-image-size-in-kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for reduce image size in kb.",
    "keywords": [
      "reduce image size in kb",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "reduce-image-size-in-kb",
    "popular": true
  },
  {
    "id": "resize-image-pixel",
    "name": "Resize Image Pixel",
    "slug": "resize-image-pixel",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for resize image pixel.",
    "keywords": [
      "resize image pixel",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "resize-image-pixel",
    "popular": true
  },
  {
    "id": "text-to-handwriting",
    "name": "Text to Handwriting",
    "slug": "text-to-handwriting",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for text to handwriting.",
    "keywords": [
      "text to handwriting",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "text-to-handwriting",
    "popular": true
  },
  {
    "id": "image-to-text-ocr",
    "name": "Image to Text (OCR)",
    "slug": "image-to-text-ocr",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for image to text (ocr).",
    "keywords": [
      "image to text (ocr)",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "image-to-text-ocr",
    "popular": true
  },
  {
    "id": "photo-collage-maker",
    "name": "Photo Collage Maker",
    "slug": "photo-collage-maker",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for photo collage maker.",
    "keywords": [
      "photo collage maker",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "photo-collage-maker",
    "popular": true
  },
  {
    "id": "generate-signature",
    "name": "Generate Signature",
    "slug": "generate-signature",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for generate signature.",
    "keywords": [
      "generate signature",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "generate-signature",
    "popular": true
  },
  {
    "id": "increase-image-size-in-kb",
    "name": "Increase Image Size in KB",
    "slug": "increase-image-size-in-kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for increase image size in kb.",
    "keywords": [
      "increase image size in kb",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "increase-image-size-in-kb",
    "popular": true
  },
  {
    "id": "ai-photo-enhancer",
    "name": "AI Photo Enhancer",
    "slug": "ai-photo-enhancer",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for ai photo enhancer.",
    "keywords": [
      "ai photo enhancer",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "ai-photo-enhancer",
    "popular": true
  },
  {
    "id": "resize-signature",
    "name": "Resize Signature",
    "slug": "resize-signature",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for resize signature.",
    "keywords": [
      "resize signature",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "resize-signature",
    "popular": true
  },
  {
    "id": "resize-image-in-centimeter",
    "name": "Resize Image in Centimeter",
    "slug": "resize-image-in-centimeter",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for resize image in centimeter.",
    "keywords": [
      "resize image in centimeter",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "resize-image-in-centimeter",
    "popular": true
  },
  {
    "id": "resize-image-3-5cm-4-5cm",
    "name": "Resize Image (3.5cm x 4.5cm)",
    "slug": "resize-image-3-5cm-4-5cm",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for resize image (3.5cm x 4.5cm).",
    "keywords": [
      "resize image (3.5cm x 4.5cm)",
      "most used tools"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "resize-image-3-5cm-4-5cm",
    "popular": true
  },
  {
    "id": "blur-background",
    "name": "Blur Background",
    "slug": "blur-background",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for blur background.",
    "keywords": [
      "blur background",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "blur-background",
    "popular": false
  },
  {
    "id": "remove-background",
    "name": "Remove Background",
    "slug": "remove-background",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for remove background.",
    "keywords": [
      "remove background",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "remove-background",
    "popular": false
  },
  {
    "id": "remove-object-from-photo",
    "name": "Remove Object from Photo",
    "slug": "remove-object-from-photo",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for remove object from photo.",
    "keywords": [
      "remove object from photo",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "remove-object-from-photo",
    "popular": false
  },
  {
    "id": "add-name-dob-on-photo",
    "name": "Add Name & DOB on Photo",
    "slug": "add-name-dob-on-photo",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for add name & dob on photo.",
    "keywords": [
      "add name & dob on photo",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "add-name-dob-on-photo",
    "popular": false
  },
  {
    "id": "rotate-image",
    "name": "Rotate Image",
    "slug": "rotate-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for rotate image.",
    "keywords": [
      "rotate image",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "rotate-image",
    "popular": false
  },
  {
    "id": "flip-image",
    "name": "Flip Image",
    "slug": "flip-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for flip image.",
    "keywords": [
      "flip image",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "flip-image",
    "popular": false
  },
  {
    "id": "watermark-images",
    "name": "Watermark Images",
    "slug": "watermark-images",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for watermark images.",
    "keywords": [
      "watermark images",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "watermark-images",
    "popular": false
  },
  {
    "id": "freehand-crop",
    "name": "Freehand Crop",
    "slug": "freehand-crop",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for freehand crop.",
    "keywords": [
      "freehand crop",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "freehand-crop",
    "popular": false
  },
  {
    "id": "circle-crop",
    "name": "Circle Crop",
    "slug": "circle-crop",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for circle crop.",
    "keywords": [
      "circle crop",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "circle-crop",
    "popular": false
  },
  {
    "id": "square-crop",
    "name": "Square Crop",
    "slug": "square-crop",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for square crop.",
    "keywords": [
      "square crop",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "square-crop",
    "popular": false
  },
  {
    "id": "round-corners",
    "name": "Round Corners",
    "slug": "round-corners",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for round corners.",
    "keywords": [
      "round corners",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "round-corners",
    "popular": false
  },
  {
    "id": "change-aspect-ratio",
    "name": "Change Aspect Ratio",
    "slug": "change-aspect-ratio",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for change aspect ratio.",
    "keywords": [
      "change aspect ratio",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "change-aspect-ratio",
    "popular": false
  },
  {
    "id": "merge-photo-signature",
    "name": "Merge Photo & Signature",
    "slug": "merge-photo-signature",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for merge photo & signature.",
    "keywords": [
      "merge photo & signature",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "merge-photo-signature",
    "popular": false
  },
  {
    "id": "join-multiple-images",
    "name": "Join Multiple Images",
    "slug": "join-multiple-images",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for join multiple images.",
    "keywords": [
      "join multiple images",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "join-multiple-images",
    "popular": false
  },
  {
    "id": "split-image",
    "name": "Split Image",
    "slug": "split-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for split image.",
    "keywords": [
      "split image",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "split-image",
    "popular": false
  },
  {
    "id": "image-color-picker",
    "name": "Image Color Picker",
    "slug": "image-color-picker",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for image color picker.",
    "keywords": [
      "image color picker",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "image-color-picker",
    "popular": false
  },
  {
    "id": "edit-metadata",
    "name": "Edit Metadata",
    "slug": "edit-metadata",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for edit metadata.",
    "keywords": [
      "edit metadata",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "edit-metadata",
    "popular": false
  },
  {
    "id": "view-metadata",
    "name": "View Metadata",
    "slug": "view-metadata",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for view metadata.",
    "keywords": [
      "view metadata",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "view-metadata",
    "popular": false
  },
  {
    "id": "remove-metadata",
    "name": "Remove Metadata",
    "slug": "remove-metadata",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for remove metadata.",
    "keywords": [
      "remove metadata",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "remove-metadata",
    "popular": false
  },
  {
    "id": "crop-png",
    "name": "Crop PNG",
    "slug": "crop-png",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for crop png.",
    "keywords": [
      "crop png",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "crop-png",
    "popular": false
  },
  {
    "id": "beautify-image",
    "name": "Beautify Image",
    "slug": "beautify-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for beautify image.",
    "keywords": [
      "beautify image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "beautify-image",
    "popular": false
  },
  {
    "id": "deep-fry-photo",
    "name": "Deep Fry Photo",
    "slug": "deep-fry-photo",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for deep fry photo.",
    "keywords": [
      "deep fry photo",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "deep-fry-photo",
    "popular": false
  },
  {
    "id": "unblur-image",
    "name": "Unblur Image",
    "slug": "unblur-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for unblur image.",
    "keywords": [
      "unblur image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "unblur-image",
    "popular": false
  },
  {
    "id": "blur-image",
    "name": "Blur Image",
    "slug": "blur-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for blur image.",
    "keywords": [
      "blur image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "blur-image",
    "popular": false
  },
  {
    "id": "blur-face",
    "name": "Blur Face",
    "slug": "blur-face",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for blur face.",
    "keywords": [
      "blur face",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "blur-face",
    "popular": false
  },
  {
    "id": "unblur-face",
    "name": "Unblur Face",
    "slug": "unblur-face",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for unblur face.",
    "keywords": [
      "unblur face",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "unblur-face",
    "popular": false
  },
  {
    "id": "add-border-to-image",
    "name": "Add Border To Image",
    "slug": "add-border-to-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for add border to image.",
    "keywords": [
      "add border to image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "add-border-to-image",
    "popular": false
  },
  {
    "id": "pixelate-image",
    "name": "Pixelate Image",
    "slug": "pixelate-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for pixelate image.",
    "keywords": [
      "pixelate image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "pixelate-image",
    "popular": false
  },
  {
    "id": "pixelate-face",
    "name": "Pixelate Face",
    "slug": "pixelate-face",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for pixelate face.",
    "keywords": [
      "pixelate face",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "pixelate-face",
    "popular": false
  },
  {
    "id": "censor-photo",
    "name": "Censor Photo",
    "slug": "censor-photo",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for censor photo.",
    "keywords": [
      "censor photo",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "censor-photo",
    "popular": false
  },
  {
    "id": "motion-blur",
    "name": "Motion Blur",
    "slug": "motion-blur",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for motion blur.",
    "keywords": [
      "motion blur",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "motion-blur",
    "popular": false
  },
  {
    "id": "grayscale-image",
    "name": "Grayscale Image",
    "slug": "grayscale-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for grayscale image.",
    "keywords": [
      "grayscale image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "grayscale-image",
    "popular": false
  },
  {
    "id": "black-and-white",
    "name": "Black & White",
    "slug": "black-and-white",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for black & white.",
    "keywords": [
      "black & white",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "black-and-white",
    "popular": false
  },
  {
    "id": "picture-to-pixel-art",
    "name": "Picture to Pixel Art",
    "slug": "picture-to-pixel-art",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for picture to pixel art.",
    "keywords": [
      "picture to pixel art",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "picture-to-pixel-art",
    "popular": false
  },
  {
    "id": "add-white-border-to-image",
    "name": "Add White Border To Image",
    "slug": "add-white-border-to-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for add white border to image.",
    "keywords": [
      "add white border to image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "add-white-border-to-image",
    "popular": false
  },
  {
    "id": "ai-face-generator",
    "name": "AI Face Generator",
    "slug": "ai-face-generator",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for ai face generator.",
    "keywords": [
      "ai face generator",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "ai-face-generator",
    "popular": false
  },
  {
    "id": "blemishes-remover",
    "name": "Blemishes Remover",
    "slug": "blemishes-remover",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for blemishes remover.",
    "keywords": [
      "blemishes remover",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "blemishes-remover",
    "popular": false
  },
  {
    "id": "retouch-image",
    "name": "Retouch Image",
    "slug": "retouch-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for retouch image.",
    "keywords": [
      "retouch image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "retouch-image",
    "popular": false
  },
  {
    "id": "add-text-to-image",
    "name": "Add Text to Image",
    "slug": "add-text-to-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for add text to image.",
    "keywords": [
      "add text to image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "add-text-to-image",
    "popular": false
  },
  {
    "id": "add-logo-to-image",
    "name": "Add Logo to Image",
    "slug": "add-logo-to-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for add logo to image.",
    "keywords": [
      "add logo to image",
      "blur, pixelate and special effects"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "add-logo-to-image",
    "popular": false
  },
  {
    "id": "increase-image-quality",
    "name": "Increase Image Quality",
    "slug": "increase-image-quality",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for increase image quality.",
    "keywords": [
      "increase image quality",
      "dpi & quality"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "increase-image-quality",
    "popular": false
  },
  {
    "id": "convert-dpi-200-300-600",
    "name": "Convert DPI (200, 300, 600)",
    "slug": "convert-dpi-200-300-600",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for convert dpi (200, 300, 600).",
    "keywords": [
      "convert dpi (200, 300, 600)",
      "dpi & quality"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "convert-dpi-200-300-600",
    "popular": false
  },
  {
    "id": "check-image-dpi",
    "name": "Check Image DPI",
    "slug": "check-image-dpi",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for check image dpi.",
    "keywords": [
      "check image dpi",
      "dpi & quality"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "check-image-dpi",
    "popular": false
  },
  {
    "id": "super-resolution",
    "name": "Super Resolution",
    "slug": "super-resolution",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for super resolution.",
    "keywords": [
      "super resolution",
      "dpi & quality"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "super-resolution",
    "popular": false
  },
  {
    "id": "resize-image-by-pixel",
    "name": "Resize Image by Pixel",
    "slug": "resize-image-by-pixel",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for resize image by pixel.",
    "keywords": [
      "resize image by pixel",
      "general resizing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "resize-image-by-pixel",
    "popular": false
  },
  {
    "id": "resize-in-centimeters",
    "name": "Resize in Centimeters",
    "slug": "resize-in-centimeters",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for resize in centimeters.",
    "keywords": [
      "resize in centimeters",
      "general resizing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "resize-in-centimeters",
    "popular": false
  },
  {
    "id": "resize-in-millimeters",
    "name": "Resize in Millimeters",
    "slug": "resize-in-millimeters",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for resize in millimeters.",
    "keywords": [
      "resize in millimeters",
      "general resizing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "resize-in-millimeters",
    "popular": false
  },
  {
    "id": "resize-in-inches",
    "name": "Resize in Inches",
    "slug": "resize-in-inches",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for resize in inches.",
    "keywords": [
      "resize in inches",
      "general resizing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "resize-in-inches",
    "popular": false
  },
  {
    "id": "bulk-image-resizer",
    "name": "Bulk Image Resizer",
    "slug": "bulk-image-resizer",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for bulk image resizer.",
    "keywords": [
      "bulk image resizer",
      "general resizing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "bulk-image-resizer",
    "popular": false
  },
  {
    "id": "upscale-image-with-ai",
    "name": "Upscale Image With AI",
    "slug": "upscale-image-with-ai",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for upscale image with ai.",
    "keywords": [
      "upscale image with ai",
      "general resizing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "upscale-image-with-ai",
    "popular": false
  },
  {
    "id": "a4-size",
    "name": "A4 Size",
    "slug": "a4-size",
    "categoryId": "exam",
    "categoryTitle": "Exam Tools",
    "shortDescription": "Free online tool for a4 size.",
    "keywords": [
      "a4 size",
      "resize other official sizes"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "a4-size",
    "popular": false
  },
  {
    "id": "ssc-photo-resize",
    "name": "SSC Photo Resize",
    "slug": "ssc-photo-resize",
    "categoryId": "exam",
    "categoryTitle": "Exam Tools",
    "shortDescription": "Free online tool for ssc photo resize.",
    "keywords": [
      "ssc photo resize",
      "resize other official sizes"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "ssc-photo-resize",
    "popular": false
  },
  {
    "id": "pan-card",
    "name": "PAN Card",
    "slug": "pan-card",
    "categoryId": "exam",
    "categoryTitle": "Exam Tools",
    "shortDescription": "Free online tool for pan card.",
    "keywords": [
      "pan card",
      "resize other official sizes"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "pan-card",
    "popular": false
  },
  {
    "id": "upsc-photo",
    "name": "UPSC Photo",
    "slug": "upsc-photo",
    "categoryId": "exam",
    "categoryTitle": "Exam Tools",
    "shortDescription": "Free online tool for upsc photo.",
    "keywords": [
      "upsc photo",
      "resize other official sizes"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "upsc-photo",
    "popular": false
  },
  {
    "id": "psc-photo",
    "name": "PSC Photo",
    "slug": "psc-photo",
    "categoryId": "exam",
    "categoryTitle": "Exam Tools",
    "shortDescription": "Free online tool for psc photo.",
    "keywords": [
      "psc photo",
      "resize other official sizes"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "psc-photo",
    "popular": false
  },
  {
    "id": "compress-image",
    "name": "Compress Image",
    "slug": "compress-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image.",
    "keywords": [
      "compress image",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image",
    "popular": false
  },
  {
    "id": "compress-image-to-20kb",
    "name": "Compress Image to 20KB",
    "slug": "compress-image-to-20kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 20kb.",
    "keywords": [
      "compress image to 20kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-20kb",
    "popular": false
  },
  {
    "id": "compress-image-to-50kb",
    "name": "Compress Image to 50KB",
    "slug": "compress-image-to-50kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 50kb.",
    "keywords": [
      "compress image to 50kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-50kb",
    "popular": false
  },
  {
    "id": "compress-image-to-100kb",
    "name": "Compress Image to 100KB",
    "slug": "compress-image-to-100kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 100kb.",
    "keywords": [
      "compress image to 100kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-100kb",
    "popular": false
  },
  {
    "id": "compress-image-to-10kb",
    "name": "Compress Image to 10KB",
    "slug": "compress-image-to-10kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 10kb.",
    "keywords": [
      "compress image to 10kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-10kb",
    "popular": false
  },
  {
    "id": "compress-image-to-30kb",
    "name": "Compress Image to 30KB",
    "slug": "compress-image-to-30kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 30kb.",
    "keywords": [
      "compress image to 30kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-30kb",
    "popular": false
  },
  {
    "id": "compress-image-to-40kb",
    "name": "Compress Image to 40KB",
    "slug": "compress-image-to-40kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 40kb.",
    "keywords": [
      "compress image to 40kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-40kb",
    "popular": false
  },
  {
    "id": "compress-image-to-200kb",
    "name": "Compress Image to 200KB",
    "slug": "compress-image-to-200kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 200kb.",
    "keywords": [
      "compress image to 200kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-200kb",
    "popular": false
  },
  {
    "id": "compress-image-to-300kb",
    "name": "Compress Image to 300KB",
    "slug": "compress-image-to-300kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 300kb.",
    "keywords": [
      "compress image to 300kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-300kb",
    "popular": false
  },
  {
    "id": "compress-image-to-500kb",
    "name": "Compress Image to 500KB",
    "slug": "compress-image-to-500kb",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for compress image to 500kb.",
    "keywords": [
      "compress image to 500kb",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-image-to-500kb",
    "popular": false
  },
  {
    "id": "jpg-to-png",
    "name": "JPG to PNG",
    "slug": "jpg-to-png",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for jpg to png.",
    "keywords": [
      "jpg to png",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "jpg-to-png",
    "popular": false
  },
  {
    "id": "png-to-jpg",
    "name": "PNG to JPG",
    "slug": "png-to-jpg",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for png to jpg.",
    "keywords": [
      "png to jpg",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "png-to-jpg",
    "popular": false
  },
  {
    "id": "webp-to-jpg",
    "name": "WebP to JPG",
    "slug": "webp-to-jpg",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for webp to jpg.",
    "keywords": [
      "webp to jpg",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "webp-to-jpg",
    "popular": false
  },
  {
    "id": "jpg-to-webp",
    "name": "JPG to WebP",
    "slug": "jpg-to-webp",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for jpg to webp.",
    "keywords": [
      "jpg to webp",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "jpg-to-webp",
    "popular": false
  },
  {
    "id": "image-to-pdf",
    "name": "Image to PDF",
    "slug": "image-to-pdf",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for image to pdf.",
    "keywords": [
      "image to pdf",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "image-to-pdf",
    "popular": false
  },
  {
    "id": "pdf-to-images",
    "name": "PDF to Images",
    "slug": "pdf-to-images",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for pdf to images.",
    "keywords": [
      "pdf to images",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "pdf-to-images",
    "popular": false
  },
  {
    "id": "compress-pdf",
    "name": "Compress PDF",
    "slug": "compress-pdf",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for compress pdf.",
    "keywords": [
      "compress pdf",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "compress-pdf",
    "popular": false
  },
  {
    "id": "merge-pdfs",
    "name": "Merge PDFs",
    "slug": "merge-pdfs",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for merge pdfs.",
    "keywords": [
      "merge pdfs",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "merge-pdfs",
    "popular": false
  },
  {
    "id": "split-pdf",
    "name": "Split PDF",
    "slug": "split-pdf",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for split pdf.",
    "keywords": [
      "split pdf",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "split-pdf",
    "popular": false
  },
  {
    "id": "merge-pdf",
    "name": "Merge PDF",
    "slug": "merge-pdf",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for merge pdf.",
    "keywords": [
      "merge pdf",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "merge-pdf",
    "popular": false
  },
  {
    "id": "rotate-pdf",
    "name": "Rotate PDF",
    "slug": "rotate-pdf",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for rotate pdf.",
    "keywords": [
      "rotate pdf",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "rotate-pdf",
    "popular": false
  },
  {
    "id": "delete-pdf-pages",
    "name": "Delete PDF Pages",
    "slug": "delete-pdf-pages",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for delete pdf pages.",
    "keywords": [
      "delete pdf pages",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "delete-pdf-pages",
    "popular": false
  },
  {
    "id": "extract-pdf-pages",
    "name": "Extract PDF Pages",
    "slug": "extract-pdf-pages",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for extract pdf pages.",
    "keywords": [
      "extract pdf pages",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "extract-pdf-pages",
    "popular": false
  },
  {
    "id": "add-page-numbers-pdf",
    "name": "Add Page Numbers to PDF",
    "slug": "add-page-numbers-pdf",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for add page numbers to pdf.",
    "keywords": [
      "add page numbers to pdf",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "add-page-numbers-pdf",
    "popular": false
  },
  {
    "id": "add-watermark-pdf",
    "name": "Add Watermark to PDF",
    "slug": "add-watermark-pdf",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Free online tool for add watermark to pdf.",
    "keywords": [
      "add watermark to pdf",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "add-watermark-pdf",
    "popular": false
  },
  {
    "id": "crop-image",
    "name": "Crop Image",
    "slug": "crop-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for crop image.",
    "keywords": [
      "crop image",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "crop-image",
    "popular": true
  },
  {
    "id": "image-to-webp",
    "name": "Image to WebP",
    "slug": "image-to-webp",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for image to webp.",
    "keywords": [
      "image to webp",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "image-to-webp",
    "popular": false
  },
  {
    "id": "image-to-avif",
    "name": "Image to AVIF",
    "slug": "image-to-avif",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for image to avif.",
    "keywords": [
      "image to avif",
      "compress & convert"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "image-to-avif",
    "popular": false
  },
  {
    "id": "image-to-base64",
    "name": "Image to Base64",
    "slug": "image-to-base64",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for image to base64.",
    "keywords": [
      "image to base64",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "image-to-base64",
    "popular": false
  },
  {
    "id": "base64-to-image",
    "name": "Base64 to Image",
    "slug": "base64-to-image",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for base64 to image.",
    "keywords": [
      "base64 to image",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "base64-to-image",
    "popular": false
  },
  {
    "id": "image-metadata-viewer",
    "name": "Image Metadata Viewer",
    "slug": "image-metadata-viewer",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for image metadata viewer.",
    "keywords": [
      "image metadata viewer",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "image-metadata-viewer",
    "popular": false
  },
  {
    "id": "favicon-generator",
    "name": "Favicon Generator",
    "slug": "favicon-generator",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Free online tool for favicon generator.",
    "keywords": [
      "favicon generator",
      "basic editing"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "favicon-generator",
    "popular": true
  },
  {
    "id": "percentage-calculator",
    "name": "Percentage Calculator",
    "slug": "percentage-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for percentage calculator.",
    "keywords": [
      "percentage calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "percentage-calculator",
    "popular": true
  },
  {
    "id": "cgpa-to-percentage",
    "name": "CGPA to Percentage Calculator",
    "slug": "cgpa-to-percentage",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for cgpa to percentage calculator.",
    "keywords": [
      "cgpa to percentage calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "cgpa-to-percentage",
    "popular": true
  },
  {
    "id": "sgpa-to-percentage",
    "name": "SGPA to Percentage Calculator",
    "slug": "sgpa-to-percentage",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for sgpa to percentage calculator.",
    "keywords": [
      "sgpa to percentage calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "sgpa-to-percentage",
    "popular": true
  },
  {
    "id": "marks-percentage-calculator",
    "name": "Marks Percentage Calculator",
    "slug": "marks-percentage-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for marks percentage calculator.",
    "keywords": [
      "marks percentage calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "marks-percentage-calculator",
    "popular": true
  },
  {
    "id": "attendance-calculator",
    "name": "Attendance Calculator",
    "slug": "attendance-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for attendance calculator.",
    "keywords": [
      "attendance calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "attendance-calculator",
    "popular": true
  },
  {
    "id": "age-calculator",
    "name": "Age Calculator",
    "slug": "age-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for age calculator.",
    "keywords": [
      "age calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "age-calculator",
    "popular": false
  },
  {
    "id": "cgpa-calculator",
    "name": "CGPA Calculator",
    "slug": "cgpa-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for cgpa calculator.",
    "keywords": [
      "cgpa calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "cgpa-calculator",
    "popular": false
  },
  {
    "id": "required-marks-calculator",
    "name": "Required Marks Calculator",
    "slug": "required-marks-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for required marks calculator.",
    "keywords": [
      "required marks calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "required-marks-calculator",
    "popular": false
  },
  {
    "id": "exam-percentage-calculator",
    "name": "Exam Percentage Calculator",
    "slug": "exam-percentage-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for exam percentage calculator.",
    "keywords": [
      "exam percentage calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "exam-percentage-calculator",
    "popular": false
  },
  {
    "id": "study-hours-calculator",
    "name": "Study Hours Calculator",
    "slug": "study-hours-calculator",
    "categoryId": "calculator",
    "categoryTitle": "Calculator Tools",
    "shortDescription": "Free online tool for study hours calculator.",
    "keywords": [
      "study hours calculator",
      "student calculators"
    ],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "Medium",
    "analyticsIdentifier": "study-hours-calculator",
    "popular": false
  }
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

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
    dpi?: number
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

const sizesKb = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45, 50, 55, 60, 65, 70, 73, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 500, 550, 600, 700, 800, 900];
const sizesMb = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

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
      metaTitle: `${toolType} to ${kb}KB Online Free (No Quality Loss) | SizeSnap`,
      metaDescription: `Free tool to ${toolType.toLowerCase()} to ${kb}KB online. Best for government forms and exams. Works in browser, 100% private.`,
      h1: `${toolType} to ${kb}KB Online Free`,
      introParagraph: `Need your file under ${kb}KB? This free online tool will ${toolType.toLowerCase()} to exactly ${kb}KB or less. ${extraIntro}`,
      config: { maxKB: kb }
    });
  }

  // Add intent-based variations
  const intents = [
    { slug: 'for-whatsapp', label: 'For WhatsApp', h1: `${toolType} for WhatsApp`, desc: 'Optimized for WhatsApp sharing and status.' },
    { slug: 'for-email', label: 'For Email', h1: `${toolType} for Email Attachment`, desc: 'Compress your files to make them small enough for any email provider.' },
    { slug: 'for-govt-form', label: 'For Govt Form', h1: `${toolType} for Govt Form`, desc: 'Perfectly sized for government job applications and portal uploads.' },
    { slug: 'for-instagram', label: 'For Instagram', h1: `${toolType} for Instagram`, desc: 'Optimize your photos for Instagram posts and stories without losing quality.' },
    { slug: 'for-linkedin', label: 'For LinkedIn', h1: `${toolType} for LinkedIn`, desc: 'Professional image optimization for LinkedIn profiles and posts.' },
    { slug: 'for-resume', label: 'For Resume', h1: `${toolType} for Resume`, desc: 'Keep your resume file size small for online job applications.' },
    { slug: 'without-losing-quality', label: 'No Quality Loss', h1: `${toolType} Without Losing Quality`, desc: 'Reduce file size carefully while keeping faces, text, and document details readable.' }
  ];

  for (const intent of intents) {
    variants.push({
      slug: intent.slug,
      label: intent.label,
      metaTitle: `${intent.h1} Online Free | SizeSnap`,
      metaDescription: `Easily ${toolType.toLowerCase()} ${intent.label.toLowerCase()} online. Fast, secure, and preserves quality.`,
      h1: intent.h1,
      introParagraph: `${intent.desc} This tool ensures your file meets the common requirements for ${intent.label.toLowerCase()}.`,
      config: { maxKB: baseSlug === 'compress-pdf' ? 500 : 50 } // Default small size for these intents
    });
  }

  for (const mb of sizesMb) {
    const maxKB = mb * 1024;
    variants.push({
      slug: `to-${mb.toString().replace('.', '-')}mb`,
      label: `${mb} MB`,
      metaTitle: `${toolType} to ${mb}MB Online Free (No Quality Loss) | SizeSnap`,
      metaDescription: `Free tool to ${toolType.toLowerCase()} to ${mb}MB online. Works in your browser. No watermark, no signup, 100% private.`,
      h1: `${toolType} to ${mb}MB Online Free`,
      introParagraph: `Need your file under ${mb}MB? This free online tool will ${toolType.toLowerCase()} to exactly ${mb}MB or less. ${extraIntro}`,
      config: { maxKB: maxKB }
    });
  }

  if (baseSlug === 'resize-image') {
    const customIntents = [
      { slug: 'to-50kb-for-form', label: '50KB for Form', h1: 'Resize Image to 50KB for Form', desc: 'Optimize your photo to exactly 50KB for college admission or recruitment portals.' },
      { slug: 'to-50kb-for-whatsapp', label: '50KB for WhatsApp', h1: 'Resize Image to 50KB for WhatsApp', desc: 'Shrink your image under 50KB for fast sharing and quick DP updates.' },
      { slug: 'to-50kb-for-ssc-exam', label: '50KB for SSC Exam', h1: 'Resize Image to 50KB for SSC Exam', desc: 'Crop and compress your passport photo under 50KB for SSC forms.' },
      { slug: 'to-50kb-without-losing-quality', label: '50KB No Quality Loss', h1: 'Resize Image to 50KB Without Losing Quality', desc: 'Compress your photo to 50KB while keeping pixels and text sharp.' },
      { slug: 'reduce-without-blur', label: 'Reduce without Blur', h1: 'Reduce Image Size Without Blur Online Free', desc: 'Shrink your certificate or profile photo to low KB without making it blurry.' }
    ];
    for (const intent of customIntents) {
      variants.push({
        slug: intent.slug,
        label: intent.label,
        metaTitle: `${intent.h1} | SizeSnap`,
        metaDescription: `Free online tool to ${intent.h1.toLowerCase()} without signup. Works locally, 100% private.`,
        h1: intent.h1,
        introParagraph: intent.desc,
        config: { maxKB: 50 }
      });
    }
  }

  return variants;
}

const passportVariants: ToolVariant[] = [
  { slug: 'indian-passport', label: 'Indian Passport', metaTitle: 'Indian Passport Photo Maker Online Free | 35x45mm', metaDescription: 'Create standard Indian passport size photos (35x45mm) online for free.', h1: 'Indian Passport Photo Maker (35x45mm)', introParagraph: 'Easily set your image to exactly 35x45mm as required for Indian passport and Visa applications.', config: { width: 413, height: 531 } },
  { slug: 'us-visa', label: 'US Visa (2x2 inch)', metaTitle: 'US Visa Photo Maker Online Free | 2x2 inch', metaDescription: 'Create US Visa photos (2x2 inch / 600x600px) online for free.', h1: 'US Visa Photo Maker (2x2 inch)', introParagraph: 'Resize your photo to standard US Visa and Passport dimensions (600x600 pixels / 2x2 inches).', config: { width: 600, height: 600 } },
  { slug: 'uk-passport', label: 'UK Passport', metaTitle: 'UK Passport Photo Maker Online Free | 35x45mm', metaDescription: 'Create UK passport size photos (35x45mm) online for free.', h1: 'UK Passport Photo Maker', introParagraph: 'Resize your photo to standard UK Passport dimensions automatically.', config: { width: 413, height: 531 } },
  { slug: 'canada-visa', label: 'Canada Visa', metaTitle: 'Canada Visa Photo Maker Online Free | 35x45mm', metaDescription: 'Create Canada Visa size photos online for free.', h1: 'Canada Visa Photo Maker', introParagraph: 'Format your photo perfectly for Canada Visa applications.', config: { width: 413, height: 531 } },
  { slug: 'australia-visa', label: 'Australia Visa', metaTitle: 'Australia Visa Photo Maker Online Free | 35x45mm', metaDescription: 'Create Australia Visa size photos online for free.', h1: 'Australia Visa Photo Maker', introParagraph: 'Format your photo perfectly for Australia Visa applications.', config: { width: 413, height: 531 } },
  { slug: 'schengen-visa', label: 'Schengen Visa', metaTitle: 'Schengen Visa Photo Maker Online Free | 35x45mm', metaDescription: 'Create Schengen Visa size photos online for free.', h1: 'Schengen Visa Photo Maker', introParagraph: 'Format your photo perfectly for Schengen Visa applications.', config: { width: 413, height: 531 } },
  { slug: 'pan-card', label: 'PAN Card', metaTitle: 'PAN Card Photo Resize Online Free | 213x213px', metaDescription: 'Resize your photo for PAN card application (213x213px) online for free.', h1: 'PAN Card Photo Resizer (213x213px)', introParagraph: 'Format your photo perfectly for NSDL PAN card application (213x213 pixels, under 30KB).', config: { width: 213, height: 213, maxKB: 30 } },
  { slug: 'ssc-exam', label: 'SSC Exam', metaTitle: 'SSC Exam Photo Resize Online Free (20KB-50KB)', metaDescription: 'Resize your passport photo for SSC CGL, CHSL, MTS exams. 3.5cm x 4.5cm, 20-50KB.', h1: 'SSC Exam Photo Resizer', introParagraph: 'Easily resize your photo for SSC portals. We ensure it meets the 3.5 x 4.5 cm and 20-50KB limit.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'ssc-cgl', label: 'SSC CGL', metaTitle: 'SSC CGL Photo Resize Online Free', metaDescription: 'Resize photo for SSC CGL application.', h1: 'SSC CGL Photo Resizer', introParagraph: 'Dedicated tool for SSC CGL aspirants.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'ssc-chsl', label: 'SSC CHSL', metaTitle: 'SSC CHSL Photo Resize Online Free', metaDescription: 'Resize photo for SSC CHSL application.', h1: 'SSC CHSL Photo Resizer', introParagraph: 'Dedicated tool for SSC CHSL aspirants.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'upsc-exam', label: 'UPSC Exam', metaTitle: 'UPSC Exam Photo Resize Online Free (20KB-300KB)', metaDescription: 'Resize your photo for UPSC Civil Services exam. 3.5cm x 4.5cm, 20KB-300KB.', h1: 'UPSC Exam Photo Resizer', introParagraph: 'Format your photo for UPSC application forms. Perfectly sized for easy upload.', config: { width: 413, height: 531, maxKB: 300 } },
  { slug: 'aadhaar-card', label: 'Aadhaar Card', metaTitle: 'Resize Photo for Aadhaar Card Online Free', metaDescription: 'Format your photo for Aadhaar card update or application. Clear, front-facing passport size.', h1: 'Aadhaar Card Photo Resizer', introParagraph: 'Need a photo for your Aadhaar card? This tool helps you format it to the required standards.', config: { width: 413, height: 531, maxKB: 100 } },
  { slug: 'gate-exam', label: 'GATE Exam', metaTitle: 'GATE Exam Photo Resize Online Free | 3.5x4.5cm', metaDescription: 'Resize photo for GATE exam application (3.5x4.5 cm) online.', h1: 'GATE Exam Photo Resizer', introParagraph: 'Create a perfect passport size photo tailored for GATE exam applications dimensions.', config: { width: 413, height: 531, maxKB: 100 } },
  { slug: 'up-police-photo', label: 'UP Police Photo', metaTitle: 'UP Police Form Photo Resizer Online Free | 3.5x4.5cm', metaDescription: 'Resize and format your passport photo for UP Police Constable & SI recruitment portal.', h1: 'UP Police Exam Photo Resizer', introParagraph: 'Ensure your UPPRPB form isn\'t rejected. Crop and scale your photo perfectly under 50KB.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'bihar-police-photo', label: 'Bihar Police Photo', metaTitle: 'Bihar Police Form Photo Resizer Online Free', metaDescription: 'Format your photo perfectly for CSBC Bihar Police application portal.', h1: 'Bihar Police Exam Photo Resizer', introParagraph: 'Quickly resize your photo to fit the official Bihar CSBC configuration rules.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'delhi-police-photo', label: 'Delhi Police Photo', metaTitle: 'Delhi Police Form Photo Resizer Online Free', metaDescription: 'Format your photo perfectly for Delhi Police recruitment via SSC portal.', h1: 'Delhi Police Exam Photo Resizer', introParagraph: 'Format your recruitment picture according to standard SSC and Delhi Police portal instructions.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'reet-exam-photo', label: 'REET Exam Photo', metaTitle: 'REET Exam Photo Resizer Online Free | Rajasthan Board', metaDescription: 'Resize photo for Rajasthan REET application portal online.', h1: 'REET Rajasthan Photo Resizer', introParagraph: 'Adjust your picture for BSER Rajasthan REET application forms easily.', config: { width: 413, height: 531, maxKB: 100 } },
  { slug: 'bpsc-exam-photo', label: 'BPSC Photo', metaTitle: 'BPSC Form Photo Resizer Online Free | Bihar PSC', metaDescription: 'Resize photo for BPSC Civil Services application.', h1: 'BPSC Exam Photo Resizer', introParagraph: 'Perfectly resize your passport size image for the Bihar Public Service Commission application.', config: { width: 413, height: 531, maxKB: 100 } },
  { slug: 'mppsc-exam-photo', label: 'MPPSC Photo', metaTitle: 'MPPSC Form Photo Resizer Online Free | MP PSC', metaDescription: 'Resize photo for MPPSC Civil Services application.', h1: 'MPPSC Exam Photo Resizer', introParagraph: 'Perfectly resize your passport size image for the Madhya Pradesh Public Service Commission application.', config: { width: 413, height: 531, maxKB: 100 } },
  { slug: 'neet-exam', label: 'NEET Exam', metaTitle: 'NEET Exam Photo Resize Online Free (10KB-200KB) | SizeSnap', metaDescription: 'Format your passport photo and postcard size photo for NEET exam application portal. Under 200KB.', h1: 'NEET Exam Photo Resizer', introParagraph: 'Ensure your NEET registration form isn\'t rejected. Crop and scale your passport size or postcard size photo under 200KB instantly.', config: { width: 413, height: 531, maxKB: 200 } },
  { slug: 'jee-main', label: 'JEE Main', metaTitle: 'JEE Main Photo Resize Online Free (10KB-200KB) | SizeSnap', metaDescription: 'Resize your passport photo for JEE Main application portal. Standard 3.5x4.5cm, 10-200KB.', h1: 'JEE Main Photo Resizer', introParagraph: 'Format your passport photo to standard JEE guidelines. We ensure file size stays strictly under 200KB.', config: { width: 413, height: 531, maxKB: 200 } },
  { slug: 'ibps-exam', label: 'IBPS PO/Clerk', metaTitle: 'IBPS Exam Photo Size Resizer Online Free | SizeSnap', metaDescription: 'Crop and resize passport photo to 20KB-50KB for IBPS Clerk, PO, and RRB banking exams. Meet standard dimensions (4.5 x 3.5 cm) instantly.', h1: 'IBPS Exam Passport Photo Resizer', introParagraph: 'Ensure your banking exam application is secure. Format your photo to standard IBPS PO/Clerk requirements (20KB to 50KB).', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'ssc-mts', label: 'SSC MTS 2026', metaTitle: 'SSC MTS Photo Resizer Online 2026 | 20KB-50KB Free', metaDescription: 'Resize and crop passport photo for SSC MTS 2026 application form. Meets official 3.5x4.5 cm & 20KB to 50KB limits instantly.', h1: 'SSC MTS 2026 Photo Resizer', introParagraph: 'Dedicated resizer tool for SSC MTS 2026 candidates to fit their photo under the mandatory 20KB-50KB limit without rejection.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'rrb-ntpc', label: 'RRB NTPC Exam', metaTitle: 'RRB NTPC Exam Photo Resizer Online Free (20KB-50KB) | SizeSnap', metaDescription: 'Resize and crop passport photo for Railway RRB NTPC exam online. Matches standard 3.5x4.5cm and 20KB-50KB guidelines.', h1: 'RRB NTPC Exam Photo Resizer', introParagraph: 'Dedicated Railway resizer tool for RRB NTPC candidates to resize photo under the mandatory 20KB-50KB limit.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'rrb-alp', label: 'RRB ALP Exam', metaTitle: 'Railway RRB ALP Photo Resizer Online Free | SizeSnap', metaDescription: 'Crop and resize passport photo for Railway RRB Assistant Loco Pilot (ALP) application form. Under 20KB-50KB limit.', h1: 'RRB ALP Photo Resizer', introParagraph: 'Ensure your RRB ALP form isn\'t rejected. Crop your passport photo strictly under 50KB in your browser.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'rrb-groupd', label: 'RRB Group D', metaTitle: 'Railway RRB Group D Photo Resizer Online Free | SizeSnap', metaDescription: 'Crop and resize passport photo for Railway RRB Group D exam online. Fit under 20KB-50KB limit.', h1: 'RRB Group D Photo Resizer', introParagraph: 'Format your photo perfectly under 50KB for the Railway RRB Group D application portal.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'sbi-bank', label: 'SBI PO / Clerk', metaTitle: 'SBI PO & Clerk Photo Resizer Online Free (20KB-50KB) | SizeSnap', metaDescription: 'Resize and crop passport photo for State Bank of India (SBI) PO & Clerk forms online. Meets official 4.5x3.5 cm & 20-50KB limit.', h1: 'SBI PO & Clerk Photo Resizer', introParagraph: 'Easily format and compress your passport photo for SBI bank exams online to meet official dimensions.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'ctet-exam', label: 'CTET Exam', metaTitle: 'CTET Exam Photo Resizer Online Free (10KB-100KB) | SizeSnap', metaDescription: 'Resize and crop passport photo for Central Teacher Eligibility Test (CTET) forms online. Under 10KB-100KB limit.', h1: 'CTET Exam Photo Resizer', introParagraph: 'Crop and scale your passport photograph to match the official CBSE CTET requirements (10KB to 100KB limits).', config: { width: 413, height: 531, maxKB: 100 } },
  { slug: 'ssc-gd', label: 'SSC GD Constable', metaTitle: 'SSC GD Constable Photo Resizer Online Free | SizeSnap', metaDescription: 'Resize and crop passport photo for SSC GD Constable application portal. Under 20KB-50KB standard limit.', h1: 'SSC GD Constable Photo Resizer', introParagraph: 'Ensure your GD Constable application form isn\'t rejected. Crop your passport photo under 50KB.', config: { width: 413, height: 531, maxKB: 50 } },
  { slug: 'upsssc-pet', label: 'UPSSSC PET', metaTitle: 'UPSSSC PET Photo Resizer Online Free (20KB-50KB) | SizeSnap', metaDescription: 'Resize and format passport photo for UPSSSC PET recruitment portal online. Fits under 50KB limit.', h1: 'UPSSSC PET Photo Resizer', introParagraph: 'Format your photo perfectly for the UPSSSC Preliminary Eligibility Test (PET) application form.', config: { width: 413, height: 531, maxKB: 50 } }
];


const signatureVariants: ToolVariant[] = [
  { slug: '10kb', label: '10 KB', metaTitle: 'Resize Signature to 10KB Online Free', metaDescription: 'Resize your signature image to 10KB online. Perfect for government forms and exams.', h1: 'Resize Signature to 10KB', introParagraph: 'Compress your scanned signature to exactly 10KB. Often required for SSC, UPSC, and state-level exams.', config: { maxKB: 10 } },
  { slug: '20kb', label: '20 KB', metaTitle: 'Resize Signature to 20KB Online Free', metaDescription: 'Resize your signature image to 20KB online. Perfect for PAN card and forms.', h1: 'Resize Signature to 20KB', introParagraph: 'Compress your scanned signature to exactly 20KB. Often required for banking and central exams.', config: { maxKB: 20 } },
  { slug: '30kb', label: '30 KB', metaTitle: 'Resize Signature to 30KB Online Free', metaDescription: 'Resize your signature image to 30KB online.', h1: 'Resize Signature to 30KB', introParagraph: 'Compress your scanned signature to exactly 30KB.', config: { maxKB: 30 } },
  { slug: '50kb', label: '50 KB', metaTitle: 'Resize Signature to 50KB Online Free', metaDescription: 'Resize your signature image to 50KB online.', h1: 'Resize Signature to 50KB', introParagraph: 'Compress your scanned signature to exactly 50KB.', config: { maxKB: 50 } },
  { slug: 'pan-card-signature', label: 'PAN Card Sign', metaTitle: 'Resize Signature for PAN Card (10KB)', metaDescription: 'Resize your signature specifically for PAN Card application (under 10KB).', h1: 'PAN Card Signature Resizer', introParagraph: 'Format your signature image for NSDL PAN card application (under 10KB, 400x200px equivalent).', config: { width: 400, height: 200, maxKB: 10 } },
  { slug: 'ssc-signature', label: 'SSC Sign', metaTitle: 'Resize Signature for SSC Exam (10-20KB)', metaDescription: 'Resize your signature for SSC application forms. 4cm x 2cm.', h1: 'SSC Exam Signature Resizer', introParagraph: 'Resize your signature image exactly for SSC portal norms (4.0cm width x 2.0cm height, 10-20KB limit).', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'upsc-signature', label: 'UPSC Sign', metaTitle: 'Resize Signature for UPSC Exam (20-300KB)', metaDescription: 'Resize your signature for UPSC application forms. High quality, low file size.', h1: 'UPSC Exam Signature Resizer', introParagraph: 'Format your signature image for UPSC portals according to the latest guidelines.', config: { width: 400, height: 200, maxKB: 300 } },
  { slug: 'up-police-signature', label: 'UP Police Sign', metaTitle: 'UP Police Form Signature Resizer Online Free', metaDescription: 'Resize your signature for UP Police recruitment portal.', h1: 'UP Police Exam Signature Resizer', introParagraph: 'Ensure your signature is crisp and under the required file size for UPPRPB forms.', config: { maxKB: 20 } },
  { slug: 'bihar-police-signature', label: 'Bihar Police Sign', metaTitle: 'Bihar Police Form Signature Resizer Online Free', metaDescription: 'Resize your signature for Bihar Police recruitment portal.', h1: 'Bihar Police Exam Signature Resizer', introParagraph: 'Compress your signature scan to meet Bihar CSBC standards instantly.', config: { maxKB: 20 } },
  { slug: 'ibps-signature', label: 'IBPS PO Sign', metaTitle: 'Resize Signature for IBPS PO 2026 | 10KB-20KB Free', metaDescription: 'Resize signature scan for IBPS PO & Clerk 2026 application form online. Format under 10KB-20KB and 140x60px limit.', h1: 'IBPS PO 2026 Signature Resizer', introParagraph: 'The IBPS PO 2026 portal rejects blue ink signatures or signatures above 20KB. Resize yours to black ink, 140x60 pixels, and 10KB-20KB instantly.', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'ssc-mts-signature', label: 'SSC MTS Sign', metaTitle: 'Resize Signature for SSC MTS 2026 | 10KB-20KB Free', metaDescription: 'Resize your signature scan for SSC MTS 2026 application form. Meets official 4cm x 2cm and 10KB to 20KB guidelines.', h1: 'SSC MTS 2026 Signature Resizer', introParagraph: 'Crop and compress your scanned signature to exactly 10KB-20KB for the SSC MTS 2026 portal.', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'neet-signature', label: 'NEET Sign', metaTitle: 'Resize Signature for NEET Exam Online Free (4-30KB) | SizeSnap', metaDescription: 'Resize and compress your signature scan under 30KB for NEET application form online.', h1: 'NEET Exam Signature Resizer', introParagraph: 'Scale your signature image perfectly for NEET application guidelines (4KB to 30KB limit).', config: { width: 413, height: 531, maxKB: 30 } },
  { slug: 'jee-signature', label: 'JEE Sign', metaTitle: 'Resize Signature for JEE Main Exam Online Free (4-30KB) | SizeSnap', metaDescription: 'Resize and compress your signature scan under 30KB for JEE Main registration online.', h1: 'JEE Main Signature Resizer', introParagraph: 'Scale your signature image perfectly for JEE registration guidelines (4KB to 30KB limit).', config: { width: 413, height: 531, maxKB: 30 } },
  { slug: 'rrb-signature', label: 'RRB NTPC Sign', metaTitle: 'Resize Signature for Railway RRB NTPC Exam (10-20KB) | SizeSnap', metaDescription: 'Resize and compress your signature scan under 20KB for Railway RRB NTPC online. Meets standard 10KB to 20KB limit.', h1: 'RRB NTPC Signature Resizer', introParagraph: 'Crop and compress your scanned signature to exactly 10KB-20KB for the Railway RRB exam application.', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'rrb-alp-signature', label: 'RRB ALP Sign', metaTitle: 'Resize Signature for Railway RRB ALP Exam (10-20KB) | SizeSnap', metaDescription: 'Resize and compress your signature scan under 20KB for Railway RRB ALP online. Meets standard 10KB to 20KB limit.', h1: 'RRB ALP Signature Resizer', introParagraph: 'Crop and compress your scanned signature to exactly 10KB-20KB for the Railway RRB ALP exam application.', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'rrb-groupd-signature', label: 'RRB Group D Sign', metaTitle: 'Resize Signature for Railway RRB Group D Exam (10-20KB) | SizeSnap', metaDescription: 'Resize and compress your signature scan under 20KB for Railway RRB Group D online. Meets standard 10KB to 20KB limit.', h1: 'RRB Group D Signature Resizer', introParagraph: 'Crop and compress your scanned signature to exactly 10KB-20KB for the Railway RRB Group D exam application.', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'sbi-signature', label: 'SBI Sign', metaTitle: 'Resize Signature for SBI PO & Clerk Exam Online | SizeSnap', metaDescription: 'Compress your signature scan under 10KB-20KB for State Bank of India (SBI) PO & Clerk forms online.', h1: 'SBI Bank Exam Signature Resizer', introParagraph: 'Quickly resize your signature scan strictly under the 10KB-20KB limit for SBI banking exam portals.', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'ctet-signature', label: 'CTET Sign', metaTitle: 'Resize Signature for CTET Exam Online Free (3KB-30KB) | SizeSnap', metaDescription: 'Crop and scale signature scan for CTET (Central Teacher Eligibility Test) online. Under 3KB-30KB limit.', h1: 'CTET Exam Signature Resizer', introParagraph: 'Scale your scanned signature to match the official CBSE CTET requirements (3KB to 30KB limits).', config: { width: 140, height: 60, maxKB: 30 } },
  { slug: 'ssc-gd-signature', label: 'SSC GD Sign', metaTitle: 'Resize Signature for SSC GD Constable Exam Online | SizeSnap', metaDescription: 'Resize signature scan for SSC GD Constable registration form. 10KB-20KB standard limit.', h1: 'SSC GD Constable Signature Resizer', introParagraph: 'Ensure your signature image meets the official 10KB to 20KB guidelines for the SSC portal.', config: { width: 140, height: 60, maxKB: 20 } },
  { slug: 'upsssc-signature', label: 'UPSSSC Sign', metaTitle: 'Resize Signature for UPSSSC PET Form Online Free | SizeSnap', metaDescription: 'Resize signature scan for UPSSSC PET application portal. Fits under 20KB limit.', h1: 'UPSSSC PET Signature Resizer', introParagraph: 'Format your scanned signature perfectly for the UPSSSC PET application form.', config: { width: 140, height: 60, maxKB: 20 } }
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
  },
  {
    slug: 'word-to-pdf',
    name: 'Word & Text to PDF Converter',
    shortName: 'Word to PDF',
    category: 'pdf',
    description: 'Convert text files (.txt) or write/paste Word documents text and format them into PDF files locally in your browser.',
    icon: '📝',
    variants: [
      { slug: 'convert', label: 'Word to PDF', metaTitle: 'Convert Word and Text to PDF Online Free | SizeSnap', metaDescription: 'Convert plain text files (.txt) or paste Word document text to generate PDF files online instantly. 100% free, private browser-based tool.', h1: 'Convert Word & Text to PDF Online Free', introParagraph: 'Easily format and compile your text content into a standard PDF document locally. Select custom page size, margins, font styles, and page layouts.', config: { format: 'pdf' } }
    ]
  },
  {
    slug: 'dpi-converter',
    name: 'Change Image DPI Online',
    shortName: 'DPI Converter',
    category: 'image',
    description: 'Change the DPI resolution (density metadata) of your JPEG/PNG images online to 200 DPI or 300 DPI locally in your browser.',
    icon: '🎯',
    variants: [
      { slug: 'to-300', label: '300 DPI', metaTitle: 'Convert Image to 300 DPI Online Free | SizeSnap', metaDescription: 'Change image DPI to 300 online free. Convert JPG, JPEG, and PNG files to exactly 300 DPI locally in your browser without uploading.', h1: 'Convert Image to 300 DPI Online Free', introParagraph: 'Set your image density parameters to exactly 300 DPI. Mandatory for UPSC, EPFO, advocate portals, and passport applications.', config: { dpi: 300 } },
      { slug: 'to-200', label: '200 DPI', metaTitle: 'Convert Image to 200 DPI Online Free | SizeSnap', metaDescription: 'Change image DPI to 200 online free. Convert signature scans, marksheets, and passport photos to 200 DPI locally.', h1: 'Convert Image to 200 DPI Online Free', introParagraph: 'Set your scanned signature or certificate images to 200 DPI to meet government recruitment specifications.', config: { dpi: 200 } }
    ]
  },
  {
    slug: 'card-joiner',
    name: 'Aadhaar & ID Card Front-Back Joiner',
    shortName: 'Merge ID Card',
    category: 'image',
    description: 'Combine front and back photos of your Aadhaar card, PAN card, or ID card into a single page online.',
    icon: '🪪',
    variants: [
      { slug: 'aadhaar-merge', label: 'Merge Aadhaar', metaTitle: 'Merge Aadhaar Card Front and Back Online Free | SizeSnap', metaDescription: 'Combine Aadhaar card front and back side images into a single photo online for free. Clean, private browser-based tool to merge ID cards.', h1: 'Merge Aadhaar Card Front and Back Online Free', introParagraph: 'Apne Aadhaar card ya kisi bhi identity card ki front aur back side ki photographs ko merge karke ek single picture ya document sheet taiyar karein. Government forms, bank accounts aur portal submissions ke liye fully optimized.', config: {} },
      { slug: 'pan-merge', label: 'Merge PAN', metaTitle: 'Merge PAN Card Front and Back Online Free | SizeSnap', metaDescription: 'Combine PAN card front and back side images into a single photo online for free. Clean, private browser-based tool to merge ID cards.', h1: 'Merge PAN Card Front and Back Online Free', introParagraph: 'Apne PAN card ya kisi bhi identity card ki front aur back side ki photographs ko merge karke ek single picture ya document sheet taiyar karein.', config: {} }
    ]
  },
  {
    slug: 'postcard-photo',
    name: 'Postcard Size Photo Resizer',
    shortName: 'Postcard Resizer',
    category: 'image',
    description: 'Crop and resize passport or selfie photos to postcard sizes like 5x7 inch or 4x6 inch for official notifications.',
    icon: '🖼️',
    variants: [
      { slug: 'dsssb-postcard', label: 'DSSSB 5x7 Postcard', metaTitle: 'DSSSB Postcard Size Photo Resizer Online (5x7 Inch) | SizeSnap', metaDescription: 'Resize and crop photo to postcard size 5x7 inches under 300KB for DSSSB online application form free. 100% private browser processing.', h1: 'DSSSB Postcard Size Photo Resizer (5x7 Inch)', introParagraph: 'DSSSB notifications ke according photo ko exactly 5x7 inch (480x672 pixels) dimension aur under 300KB compress karein. Automatic crop layouts optimized.', config: { width: 480, height: 672, maxKB: 300 } },
      { slug: 'neet-postcard', label: 'NEET 4x6 Postcard', metaTitle: 'NEET Postcard Size Photo Resizer Online (4x6 Inch) | SizeSnap', metaDescription: 'Resize and crop photo to postcard size 4x6 inches under 200KB for NTA NEET application form free. 100% private browser processing.', h1: 'NEET Postcard Size Photo Resizer (4x6 Inch)', introParagraph: 'NEET registration guidelines ke according 4x6 inch size photo under 200KB format dimensions design karein.', config: { width: 400, height: 600, maxKB: 200 } }
    ]
  },
  {
    slug: 'document-enhancer',
    name: 'Scanned Document & Signature Enhancer',
    shortName: 'Enhance Scan',
    category: 'image',
    description: 'Remove shadows, increase contrast, and sharpen text/signatures on scanned documents to make them pure white & clear.',
    icon: '✍️',
    variants: [
      { slug: 'remove-shadow', label: 'Remove Shadow', metaTitle: 'Remove Shadow from Document Photo Online Free | SizeSnap', metaDescription: 'Clean and remove dark shadows from photos of documents, marksheets, or signatures. Make paper background pure white and text black.', h1: 'Remove Shadow from Document Photos Online', introParagraph: 'Apne mobile se khinchi gayi marksheet, certificate ya signature photo se unwanted light shadows, dark corners, aur grayish background ko remove karein. Background ko clean white aur text ko high contrast dark banayein.', config: {} },
      { slug: 'signature-sharpener', label: 'Sharpen Signature', metaTitle: 'Sharpen Scanned Signature Online Free | SizeSnap', metaDescription: 'Sharpen your scanned signature online. Make paper background pure white and ink solid black or blue for exam portals.', h1: 'Sharpen Scanned Signature Online Free', introParagraph: 'Signature scan photo ko enhance aur clean karein. Background brightness increase karein aur pen line ink values ko sharp aur visible banayein.', config: {} }
    ]
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF & Extract Pages Online',
    shortName: 'Split PDF',
    category: 'pdf',
    description: 'Extract specific pages or split multi-page PDF documents into individual PDF files locally in your browser.',
    icon: '📄',
    variants: [
      { slug: 'extract-pages', label: 'Extract Pages', metaTitle: 'Split PDF & Extract Pages Online Free | SizeSnap', metaDescription: 'Split PDF and extract specific pages into a new PDF file online free. Works locally in your browser, 100% private.', h1: 'Split PDF & Extract Pages Online Free', introParagraph: 'Apne multi-page PDF document me se specific pages (jaise page 1 ya selected sheets) ko extract karke ek nayi choti PDF file banayein.', config: {} }
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

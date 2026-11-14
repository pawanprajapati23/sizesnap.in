export interface GuideSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface GuideArticle {
  slug: string;
  title: string;
  hindiTitle: string;
  badge: string;
  category: 'Exam Photo & Sign' | 'Exact KB Compression' | 'PDF Optimization' | 'ID Card & Portal';
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  primaryToolHref: string;
  primaryToolLabel: string;
  secondaryTools: { label: string; href: string }[];
  specTable: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  sections: GuideSection[];
  howToSteps: string[];
  faqs: { q: string; a: string }[];
}

export const GUIDES_LIST: GuideArticle[] = [
  {
    slug: 'photo-ka-size-20kb-kaise-kare-mobile-se',
    title: 'How to Reduce Photo Size to 20KB–50KB on Mobile (Hindi & English Guide)',
    hindiTitle: 'Mobile Se Photo Ka Size 20KB Se 50KB Kaise Kare (Bina Quality Kharab Kiye)',
    badge: 'Most Searched Guide',
    category: 'Exact KB Compression',
    readTime: '4 min read',
    metaTitle: 'Photo Ka Size 20KB Kaise Kare Mobile Se (20KB - 50KB Guide) | SizeSnap',
    metaDescription:
      'Step-by-step Hindi and English guide on how to reduce photo size from MB to exact 20KB, 30KB, or 50KB on mobile without losing quality for SSC, UPSC, Police, and Bank forms.',
    summary:
      'Mobile camera se khichi gayi photo 3MB se 6MB ki hoti hai, jabki SSC, UPSC, UP Police aur Bank forms me 20KB se 50KB JPG maanga jata hai. Sikhein kaise 10 second me exact KB photo banayein.',
    primaryToolHref: '/tools/compress-image-to-20kb',
    primaryToolLabel: 'Open 20KB Photo Compressor',
    secondaryTools: [
      { label: 'Compress Between 20KB to 50KB', href: '/tools/compress-image-between-20kb-to-50kb' },
      { label: '30KB Photo Resizer', href: '/tools/30kb-photo-size' },
      { label: '50KB Photo Resizer', href: '/tools/50kb-photo-size' },
      { label: 'SSC Photo & Sign Resizer', href: '/exams/ssc-photo-signature-resizer' },
    ],
    specTable: {
      caption: 'Popular Indian Portals Supporting 20KB–50KB Photo Size',
      headers: ['Portal / Exam Board', 'Required KB Range', 'Pixel / CM Dimensions', 'Background Color'],
      rows: [
        ['SSC (CGL, CHSL, GD, MTS)', '20 KB – 50 KB', '3.5 × 4.5 cm (350 × 450 px)', 'Plain White'],
        ['UP Police & Delhi Police', '20 KB – 50 KB', '3.5 × 4.5 cm (350 × 450 px)', 'White / Light Grey'],
        ['IBPS & SBI Bank PO/Clerk', '20 KB – 50 KB', '200 × 230 pixels', 'White Background'],
        ['India Post GDS Bharti', '20 KB – 50 KB', '200 × 230 pixels (200 DPI)', 'Plain White'],
        ['Bihar BPSC & BSSC OTR', '20 KB – 50 KB', '3.5 × 4.5 cm (250 × 250+ px)', 'Plain White'],
      ],
    },
    sections: [
      {
        heading: '1. Mobile Photo 20KB–50KB Karte Waqt Blur Kyu Ho Jati Hai?',
        body: 'Jab aap kisi sadharan app me 4MB ki photo ko seedha 20KB par compress karte hain, toh wo app image ke pixels ko tod deta hai. SizeSnap pahle aapki photo ko passport dimension (350×450 px) par set karta hai aur fir binary-search JPEG encoding se exact 20KB–50KB ke beech lock karta hai—jisse chehra ekdum HD aur sharp rehta hai.',
        bullets: [
          'Hamesha din ki roshni (daylight) ya tube light ke samne seedhe khade hokar photo lein.',
          'Selfie camera ki jagah back camera ka use karein taaki chehra distort na ho.',
          'Photo me dono kaan (both ears) saaf dikhne chahiye aur chashma/cap nahi hona chahiye.',
        ],
      },
      {
        heading: '2. Agar Photo 20KB Se Kam (e.g., 12KB) Ho Jaye Toh Kya Karein?',
        body: 'Kai baar WhatsApp par bheji gayi photo pehle se 10KB–14KB ki hoti hai, jise SSC ya Rajasthan SSO portal "File size must be at least 20KB" kehkar reject kar deta hai. SizeSnap ka Smart Byte Padding feature choti photo ko bhi bina quality chede exact 25KB–35KB par badha deta hai.',
      },
    ],
    howToSteps: [
      'Upar diye gaye "Open 20KB Photo Compressor" ya SSC Resizer button par click karein.',
      'Apne mobile gallery se photo select karein (JPG, PNG, ya HEIC).',
      'Target KB slider ko 20KB (ya exam form ke liye 35KB) par rakhein.',
      'Live preview me output KB aur pixel check karein aur "Download" button dabayein.',
    ],
    faqs: [
      {
        q: 'Mobile se photo ka size 20KB kaise kare bina app download kiye?',
        a: 'SizeSnap.in par jaakar Compress Image to 20KB tool open karein, apni photo upload karein aur 1 click me exact 20KB JPG file apne phone me save karein.',
      },
      {
        q: '20KB se 50KB ke beech photo rakhne ke liye best target size kya hai?',
        a: 'Agar form me 20KB–50KB maanga gaya hai, toh 35KB sabse safe sweet-spot hota hai kyunki isme quality bhi full HD rehti hai aur portal kabhi size error nahi deta.',
      },
    ],
  },
  {
    slug: 'ssc-upsc-photo-par-naam-aur-date-kaise-likhe',
    title: 'How to Add Name & Date on Passport Photo (DOP) for UPSC, SSC, NEET & MPESB',
    hindiTitle: 'Photo Par Naam Aur Date (DOP) Kaise Likhe — Official Sarkari Form Format',
    badge: 'DOP Stamp Guide',
    category: 'Exam Photo & Sign',
    readTime: '5 min read',
    metaTitle: 'Photo Par Naam Aur Date Kaise Likhe Online (UPSC, SSC, NEET, MPESB) | SizeSnap',
    metaDescription:
      'Free online guide to add Candidate Name and Date of Photograph (DOP) on passport photos for UPSC OTR, NEET UG, MPESB Vyapam, and SSC exams in 1 click.',
    summary:
      'UPSC Civil Services/NDA, NEET UG aur MPESB (Vyapam) forms me passport photo ke niche safed patti par Candidate ka Naam aur Date of Photo (DOP) likhna anivarya hai. Sikhein sahi font aur ratio me DOP kaise lagayein.',
    primaryToolHref: '/tools/add-name-and-date-on-photo',
    primaryToolLabel: 'Add Name & Date on Photo Now',
    secondaryTools: [
      { label: 'UPSC OTR Photo Resizer', href: '/exams/upsc-photo-signature-resizer' },
      { label: 'NEET & JEE Postcard Photo Maker', href: '/exams/neet-jee-photo-signature-resizer' },
      { label: 'MPESB (Vyapam) Photo Resizer', href: '/exams/mpesb-mp-police-photo-signature-resizer' },
      { label: 'White Background Passport Photo', href: '/tools/white-background-passport-photo' },
    ],
    specTable: {
      caption: 'Exams Requiring Name & Date of Photo (DOP) Stamp in 2026',
      headers: ['Examination Board', 'DOP Requirement', 'Maximum Age of Photo', 'Required File Size'],
      rows: [
        ['UPSC (CSE, NDA, CDS, OTR)', 'Mandatory Name & Date at bottom', 'Within 10 days of form start', '20 KB – 300 KB (350×350+ px)'],
        ['NTA NEET UG & JEE Main', 'Mandatory Name & Date on Photo', 'Within 3 months (80% face)', '10 KB – 200 KB (Passport & 4×6)'],
        ['MPESB (MP Police, TET, Patwari)', 'Mandatory Name & Date on Template', 'Within 3 months', '20 KB – 100 KB'],
        ['SSC (CGL, CHSL, GD, MTS)', 'Optional (Live capture preferred)', 'Within 3 months', '20 KB – 50 KB'],
      ],
    },
    sections: [
      {
        heading: '1. Photo Par Naam Aur Date Likhne Ka Sahi Sarkari Rule Kya Hai?',
        body: 'Aksar students photo editing app se photo ke kapdo ke upar lal ya peele rang se naam likh dete hain, jisse AI face detector photo reject kar deta hai. Official rule ke mutabik:',
        bullets: [
          'Photo ke niche 18%–20% hisse me ek saaf White Strip (सफेद पट्टी) honi chahiye.',
          'Us safed patti par KALE AKSHARO (Bold Black Capital Letters) me Candidate ka Poora Naam aur niche DOP (Date of Photograph) likha hona chahiye.',
          'Naam aur Date wali patti chehre (chin) ko dhakni nahi chahiye.',
        ],
      },
      {
        heading: '2. UPSC 10-Day Photo Date Rule Kya Hai?',
        body: 'UPSC OTR ke niyam ke anusar photo par likhi gayi tarikh online application shuru hone ki tarikh se 10 din se zyada purani nahi honi chahiye. SizeSnap DOP Tool me aaj ki tarikh (DD-MM-YYYY) pehle se bhari hoti hai jise aap 1 click me apply kar sakte hain.',
      },
    ],
    howToSteps: [
      '"Add Name & Date on Photo Now" tool open karein aur apni passport photo select karein.',
      'Candidate Full Name box me apna poora naam (jaise 10th marksheet me hai) type karein.',
      'Date of Photo (DOP) box me photo khichne ki latest date (DD-MM-YYYY) chunein.',
      'Target KB (UPSC ke liye 80KB, SSC/MPESB ke liye 35KB) set karke JPG photo download karein.',
    ],
    faqs: [
      {
        q: 'Kya photo par DD-MM-YYYY format me date likhni chahiye?',
        a: 'Haan, DD-MM-YYYY ya DD.MM.YYYY (jaise 14-05-2026) sabse standard aur valid format hai jo UPSC, NTA aur State PSC portals par turant accept hota hai.',
      },
      {
        q: 'Kya Naam aur Date lagane ke baad file size 50KB ke andar rahega?',
        a: 'Bilkul! SizeSnap Naam aur Date ki patti jodne ke baad photo ko exact aapke chune hue KB target (jaise 35KB) me compress karta hai.',
      },
    ],
  },
  {
    slug: 'signature-size-10kb-to-20kb-kaise-banaye',
    title: 'Signature Resizer 10KB to 20KB (140×60 px) — Mobile Scan & No-Blur Guide',
    hindiTitle: 'Signature Ka Size 10KB Se 20KB Kaise Banaye (140×60 Pixel Without Blur)',
    badge: 'Signature Special',
    category: 'Exam Photo & Sign',
    readTime: '4 min read',
    metaTitle: 'Signature Size 10KB to 20KB Kaise Banaye (140x60 px Resizer Guide) | SizeSnap',
    metaDescription:
      'Learn how to resize signature between 10KB and 20KB (140x60 px or 4x2 cm) from a mobile photo without blur or grey shadows for SSC, IBPS, SBI, and India Post GDS.',
    summary:
      'Sarkari form bharte waqt sabse mushkil kaam Signature ko 10KB se 20KB (140×60 px) ke beech rakhna hota hai—kyunki kabhi size 8KB reh jata hai toh kabhi sign dhundhla (blur) ho jata hai. Yahan dekhein 100% pakka tarika.',
    primaryToolHref: '/tools/compress-image-between-10kb-to-20kb',
    primaryToolLabel: 'Open 10KB–20KB Signature Resizer',
    secondaryTools: [
      { label: '14KB Exact Photo & Signature', href: '/tools/14kb-photo-size' },
      { label: '15KB Signature Compressor', href: '/tools/compress-image-to-15kb' },
      { label: 'Remove Shadow from Signature', href: '/tools/remove-shadow-from-document' },
      { label: 'IBPS / SBI 4-in-1 Resizer', href: '/exams/ibps-bank-photo-signature-resizer' },
    ],
    specTable: {
      caption: 'Official Signature Dimension & Ink Rules Across Major Exams',
      headers: ['Exam Board', 'Signature KB Limit', 'Dimensions (Px / CM)', 'Allowed Pen Ink'],
      rows: [
        ['SSC (CGL, CHSL, GD, MTS)', '10 KB – 20 KB', '4.0 × 2.0 cm (280 × 120 px)', 'Black or Dark Blue Pen'],
        ['IBPS & SBI PO / Clerk', '10 KB – 20 KB', '140 × 60 pixels', 'Strictly BLACK Ink Only'],
        ['India Post GDS', '10 KB – 20 KB', '140 × 60 pixels (200 DPI)', 'Black or Blue Pen'],
        ['Bihar BPSC OTR / TRE', '10 KB – 15 KB', '220 × 100 pixels (Hindi & Eng)', 'Black or Dark Blue Pen'],
        ['Railway RRB (NTPC / ALP)', '30 KB – 70 KB', '5.0 × 2.0 cm (280 × 120 px)', 'Black or Blue Pen'],
      ],
    },
    sections: [
      {
        heading: '1. Mobile Se Signature Ki Photo Lete Waqt Ye 3 Galtiyan Na Karein',
        body: '90% candidates ke signature form me isliye reject hote hain kyunki wo line dar (ruled) copy par sign karke andhere me photo khich lete hain:',
        bullets: [
          'Hamesha bina line wale safed A4 paper (unruled white paper) par sign karein.',
          'Flash बंद rakhein aur khidki ya roshni ke paas upar se photo lein taaki mobile ki parchhai (shadow) paper par na pade.',
          'ALL CAPITAL LETTERS (jaise RAMESH) me kabhi sign na karein—hamesha running handwriting me sign karein.',
        ],
      },
      {
        heading: '2. 10KB–20KB Ke Beech Exact 15KB Signature Kaise Lock Karein?',
        body: 'Jab aap 140×60 pixel par signature resize karte hain, toh aksar file size sirf 4KB ya 6KB banta hai jise portal "Minimum 10KB required" kehkar rok deta hai. SizeSnap ka 10KB–20KB Signature Resizer file ko exact 14KB–16KB ke golden midpoint par lock karta hai.',
      },
    ],
    howToSteps: [
      'Safed paper par Black pen se sign karein aur mobile se saaf photo lekar crop kar lein.',
      'Agar paper grey dikh raha hai, toh pehle "Remove Shadow from Document" tool se paper ko safed karein.',
      '"Open 10KB–20KB Signature Resizer" par click karke apna signature upload karein.',
      '15KB target select karke crisp JPG signature download karein.',
    ],
    faqs: [
      {
        q: 'IBPS aur UP Police me kis color ke pen se signature karna chahiye?',
        a: 'IBPS, SBI aur UP Police ke official notification me saaf likha hai ki signature SIRF BLACK INK (काले पेन) se hona chahiye. Isliye hamesha black ballpoint ya gel pen hi use karein.',
      },
      {
        q: 'Mera signature 140×60 pixel karne par 5KB ka ho raha hai, use 15KB kaise karein?',
        a: 'SizeSnap ke 15KB Compressor ya Exam Signature tab me upload karein—humara tool lossless byte-padding se 140×60 px image ko exact 15KB bana deta hai.',
      },
    ],
  },
  {
    slug: 'pdf-size-100kb-140kb-200kb-kaise-kam-kare',
    title: 'How to Compress PDF Under 100KB, 140KB & 200KB for Marksheet & Aadhaar Upload',
    hindiTitle: 'PDF Ka Size 100KB, 140KB Ya 200KB Se Kam Kaise Kare (Marksheet & Certificate Guide)',
    badge: 'PDF Portal Guide',
    category: 'PDF Optimization',
    readTime: '4 min read',
    metaTitle: 'PDF Size 100KB, 140KB, 200KB Se Kam Kaise Kare Online Free | SizeSnap',
    metaDescription:
      'Step-by-step guide to compress 10th/12th marksheet, caste certificate, and Aadhaar PDF under 100KB, 140KB, 150KB, or 200KB without blurring text.',
    summary:
      'Scholarship (NSP/UP Scholarship), SSC, BPSC, aur PAN Card portals par 10th/12th Marksheet, Caste Certificate aur Aadhaar PDF ko 100KB, 140KB ya 200KB ke andar upload karna padta hai.',
    primaryToolHref: '/tools/compress-pdf-140kb',
    primaryToolLabel: 'Compress PDF to 140KB / 100KB',
    secondaryTools: [
      { label: 'Compress PDF to 100KB', href: '/tools/compress-pdf-100kb' },
      { label: 'Compress PDF to 200KB', href: '/tools/compress-pdf-200kb' },
      { label: 'JPG to PDF Under 150KB', href: '/tools/jpg-to-pdf-under-150kb' },
      { label: 'Merge Multiple PDFs', href: '/tools/merge-pdf' },
    ],
    specTable: {
      caption: 'Document PDF Size Limits for Indian Portals (2026)',
      headers: ['Document / Portal Name', 'Allowed PDF Size', 'Recommended Tool', 'Resolution / DPI'],
      rows: [
        ['National & State Scholarship (Income/Caste)', 'Under 100 KB or 140 KB', 'Compress PDF to 100KB / 140KB', '150 DPI Clear Text'],
        ['BPSC / UPPSC / State PSC Marksheet PDF', 'Under 200 KB or 300 KB', 'Compress PDF to 200KB', '200 DPI Grayscale/Color'],
        ['PAN Card (NSDL / UTIITSL) Aadhaar Proof', 'Under 300 KB', 'Compress PDF to 200KB', '200 DPI PDF'],
        ['JPG Marksheet Photo to PDF Conversion', 'Under 100 KB / 150 KB', 'JPG to PDF Under 150KB', 'A4 Auto-Fit'],
      ],
    },
    sections: [
      {
        heading: '1. Scanned Marksheet PDF Ka Size Itna Bada (2MB–5MB) Kyu Hota Hai?',
        body: 'Jab aap CamScanner ya printer se marksheet scan karte hain, toh wo high-resolution image ko bina optimize kiye PDF container me daal deta hai. SizeSnap PDF Compressor har page ko smart DPI scaling se re-encode karta hai taaki roll number aur marks ekdum padhne layak (readable) rahein aur size 100KB–140KB ke andar aa jaye.',
      },
      {
        heading: '2. Photo (JPG) Se Seedha 100KB–150KB PDF Kaise Banaye?',
        body: 'Agar aapke paas marksheet ya Aadhaar card ki mobile photo (JPG) hai, toh pehle PDF banane aur fir compress karne ki zaroorat nahi hai! Humara "JPG to PDF Under 150KB" ya "JPG to PDF Under 100KB" tool ek hi step me photo ko exact KB ke PDF me badal deta hai.',
      },
    ],
    howToSteps: [
      '"Compress PDF to 140KB / 100KB" tool open karein aur apni PDF file select karein.',
      'Target KB box me apni limit (100KB, 140KB, ya 200KB) check karein.',
      '"Compress PDF" par click karein—browser ke andar hi kuch seconds me file compress ho jayegi.',
      'Output size verify karke apni optimized PDF download karein.',
    ],
    faqs: [
      {
        q: 'Kya meri Aadhaar ya Marksheet PDF kisi server par upload hoti hai?',
        a: 'Bilkul nahi! SizeSnap 100% client-side browser technology use karta hai. Aapke personal documents aapke phone ya laptop ke bahar kahin nahi jate.',
      },
      {
        q: '2-page ke Aadhaar ya Certificate ko ek PDF me jodkar 200KB kaise karein?',
        a: 'Pehle Merge PDF tool se dono pages jodein, ya JPG to PDF Under 200KB tool me dono photos select karke 1 single PDF download kar lein.',
      },
    ],
  },
  {
    slug: 'pan-card-photo-signature-size-nsdl-utiitsl-guide',
    title: 'PAN Card Photo (213×213 px, 300 DPI) & Signature Size Guide for NSDL & UTIITSL',
    hindiTitle: 'PAN Card Photo (213×213 Pixel, 300 DPI) Aur Signature Kaise Resize Kare',
    badge: 'PAN Portal Guide',
    category: 'ID Card & Portal',
    readTime: '4 min read',
    metaTitle: 'PAN Card Photo (213x213 px, 300 DPI) & Signature Size Guide (NSDL & UTI) | SizeSnap',
    metaDescription:
      'Complete specification guide and 1-click resizer for UTIITSL (213x213 px, <30KB, 300 DPI) and NSDL Protean (3.5x2.5 cm, <50KB) PAN card applications.',
    summary:
      'UTIITSL aur NSDL (Protean) PAN card portal par normal passport size photo upload nahi hoti—wahan 213×213 pixel (300 DPI, <30KB) photo aur <60KB signature chahiye hota hai.',
    primaryToolHref: '/exams/pan-card-nsdl-uti-photo-signature-resizer',
    primaryToolLabel: 'Open PAN Card 213×213 Resizer',
    secondaryTools: [
      { label: 'Dedicated PAN Card Resizer Tool', href: '/tools/pan-card-photo-resizer' },
      { label: '200 / 300 DPI Converter', href: '/tools/200-dpi-converter' },
      { label: 'Compress Supporting PDF <200KB', href: '/tools/compress-pdf-200kb' },
    ],
    specTable: {
      caption: 'UTIITSL vs NSDL (Protean) Official PAN Card Upload Specifications',
      headers: ['Document Type', 'UTIITSL Portal Specs', 'NSDL (Protean) Portal Specs', 'SizeSnap Preset Output'],
      rows: [
        ['Applicant Photograph', '213 × 213 px | 300 DPI | < 30 KB', '3.5 × 2.5 cm | 200 DPI | < 50 KB', '213 × 213 px | ~22 KB JPEG'],
        ['Applicant Signature', '600 DPI Black Ink | < 60 KB', '2.0 × 4.5 cm | 200 DPI | < 50 KB', '400 × 200 px | ~28 KB JPEG'],
        ['Supporting Document (Aadhaar)', 'PDF format | 200 DPI | < 300 KB', 'PDF format | < 300 KB', 'PDF strictly < 200 KB'],
      ],
    },
    sections: [
      {
        heading: '1. UTIITSL PAN Portal Par Photo Upload Error Kyu Aata Hai?',
        body: 'UTIITSL ka scanner check karta hai ki photo exact square (213 × 213 pixels) hai ya nahi aur uska size 30KB se kam hai ya nahi. Normal 3.5×4.5 cm photo dalne par turant dimension mismatch error aata hai.',
      },
      {
        heading: '2. NSDL Aur UTI Dono Ke Liye 1-Click Solution',
        body: 'SizeSnap ke PAN Card Resizer me aapko pixel ya DPI calculate karne ki zaroorat nahi hai. Bas photo upload karein aur 213×213 px (<30KB) ya NSDL mode select karke file download karein.',
      },
    ],
    howToSteps: [
      '"Open PAN Card 213×213 Resizer" button par click karein.',
      'Applicant ki photo upload karein—tool apne aap 213×213 px aur ~22KB set kar dega.',
      '"PAN Signature" tab par switch karke safed paper par kiya gaya black-ink signature upload karein.',
      'Dono files download karke NSDL ya UTIITSL portal par upload karein.',
    ],
    faqs: [
      {
        q: 'PAN card ke liye photo kitne KB aur kitne pixel ki honi chahiye?',
        a: 'UTIITSL ke liye photo 213 × 213 pixels (300 DPI) aur 30KB se kam honi chahiye, jabki NSDL ke liye 3.5 × 2.5 cm aur 50KB se kam honi chahiye.',
      },
      {
        q: 'PAN card form ke liye Aadhaar PDF ka size kitna hona chahiye?',
        a: 'Aadhaar ya kisi bhi supporting proof PDF ka size 300KB se kam hona chahiye. Aap SizeSnap ke Compress PDF to 200KB tool se ise 5 second me bana sakte hain.',
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES_LIST.find((g) => g.slug === slug);
}

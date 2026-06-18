export type StorySlide = {
  heading: string
  text: string
  bgGradient: string
  emoji: string
}

export type WebStory = {
  slug: string
  title: string
  description: string
  coverImage: string
  targetUrl: string
  ctaText: string
  slides: StorySlide[]
}

export const webStories: WebStory[] = [
  {
    slug: 'how-to-resize-image-to-50kb',
    title: 'How to Resize Image to 50KB Online Without Quality Loss',
    description: 'Struggling with form uploads? Learn the exact method to compress any passport photo or document under 50KB instantly.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&q=80',
    targetUrl: 'https://sizesnap.in/resize-image/to-50kb',
    ctaText: 'Open Free 50KB Resizer',
    slides: [
      {
        heading: 'The Dreaded 50KB Limit Error!',
        text: 'Uploading your photo to an official exam portal or website and getting a "File Too Large" error? You are not alone.',
        bgGradient: 'from-red-600 to-amber-600',
        emoji: '⚠️'
      },
      {
        heading: 'Why This Rejection Happens',
        text: 'Modern phone cameras shoot in massive resolutions, creating 3MB to 8MB files. Official portals strictly limit files to 50KB to save server space.',
        bgGradient: 'from-indigo-900 to-purple-800',
        emoji: '📸'
      },
      {
        heading: 'The Manual Cropping Trap',
        text: 'Manually reducing picture resolution or pixel width often ends up making faces blurry or marksheets completely unreadable.',
        bgGradient: 'from-slate-900 to-slate-800',
        emoji: '❌'
      },
      {
        heading: 'The Smart Solution',
        text: 'SizeSnap uses localized browser-based compression scripts to smart-adjust bits and quality parameters automatically.',
        bgGradient: 'from-emerald-600 to-teal-700',
        emoji: '✨'
      },
      {
        heading: 'How to Do It in 1-Click',
        text: '1. Select your target payload.\n2. Upload your file inside the secure grid.\n3. Wait 1 second and hit Download!',
        bgGradient: 'from-blue-600 to-indigo-700',
        emoji: '⚡'
      },
      {
        heading: '100% Private & Secure',
        text: 'Your image stays on your local device. Zero server uploads mean zero identity or privacy leakage risks.',
        bgGradient: 'from-cyan-700 to-blue-800',
        emoji: '🔒'
      },
      {
        heading: 'Try It Yourself Now!',
        text: 'Resize your document or passport photo immediately to exactly 50KB or less for free.',
        bgGradient: 'from-blue-600 to-purple-700',
        emoji: '🚀'
      }
    ]
  },
  {
    slug: 'resize-image-for-whatsapp-dp',
    title: 'Set Full Profile Picture on WhatsApp Without Cropping',
    description: 'Stop cutting away the best parts of your rectangular photos. Learn how to convert any photo to a square fit instantly.',
    coverImage: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=720&q=80',
    targetUrl: 'https://sizesnap.in/whatsapp-dp/no-crop',
    ctaText: 'Make Square WhatsApp DP',
    slides: [
      {
        heading: 'Tired of Cropping Your DP?',
        text: 'WhatsApp profile photos require a strict 1:1 aspect ratio. Tall selfies or wide group photos get cut off miserably.',
        bgGradient: 'from-emerald-600 to-green-700',
        emoji: '📱'
      },
      {
        heading: 'Don\'t Lose the Background',
        text: 'Forcing a crop box means cutting off your head, your friends, or beautiful scenery behind you.',
        bgGradient: 'from-amber-600 to-red-600',
        emoji: '✂️'
      },
      {
        heading: 'The Blur Border Magic',
        text: 'By appending a beautiful blurred mirror copy of your original photo to the sides, it becomes a perfect square asset.',
        bgGradient: 'from-indigo-600 to-purple-700',
        emoji: '🎨'
      },
      {
        heading: 'Choose Your Style Layout',
        text: 'SizeSnap allows you to select either white borders, clean contrast backgrounds, or fully matching blurry margins.',
        bgGradient: 'from-pink-600 to-rose-700',
        emoji: '✨'
      },
      {
        heading: 'Works on iOS & Android',
        text: 'No complicated apps or subscription paywalls needed. Direct manipulation happens right in your favorite browser.',
        bgGradient: 'from-teal-600 to-cyan-700',
        emoji: '⚡'
      },
      {
        heading: 'Instant Download & Use',
        text: 'Generate and upload your fully frame-fitted beautiful profile pictures across Instagram, WhatsApp, or Twitter instantly!',
        bgGradient: 'from-green-600 to-teal-700',
        emoji: '🚀'
      }
    ]
  },
  {
    slug: 'ssc-cgl-form-photo-signature-rules',
    title: 'SSC CGL Form Guidelines: Avoid Photo Rejection Today',
    description: 'Thousands of central government exam forms get rejected due to tiny image layout mistakes. Ensure compliance now.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=720&q=80',
    targetUrl: 'https://sizesnap.in/passport-photo/ssc-exam',
    ctaText: 'Fix SSC Photo & Sign',
    slides: [
      {
        heading: 'Massive Application Rejections',
        text: 'Did you know over 10% of candidate profiles get rejected annually solely due to photo and signature errors?',
        bgGradient: 'from-red-700 to-orange-600',
        emoji: '🚨'
      },
      {
        heading: 'The Strict Photo Rule',
        text: 'Staff Selection Commission rules require 3.5cm x 4.5cm dimensions and a total size bounded strictly between 20KB and 50KB.',
        bgGradient: 'from-slate-800 to-indigo-900',
        emoji: '📋'
      },
      {
        heading: 'Signature Norms Matter!',
        text: 'Signatures must be drawn on crisp white sheets with dark black ink, cropped to 4.0cm x 2.0cm, and stay between 10KB-20KB.',
        bgGradient: 'from-purple-800 to-indigo-900',
        emoji: '✍️'
      },
      {
        heading: 'Avoid Spectacles & Caps',
        text: 'Photos containing glare on spectacles, fancy caps, side views, or muffled ears are flagged by artificial intelligence systems instantly.',
        bgGradient: 'from-amber-700 to-red-700',
        emoji: '👓'
      },
      {
        heading: 'The 1-Click Preparation',
        text: 'Our platform has dedicated, embedded mathematical metrics tailored specifically for the official SSC upload configurations.',
        bgGradient: 'from-blue-600 to-cyan-700',
        emoji: '🛠️'
      },
      {
        heading: 'Get it Right the First Time',
        text: 'Format your recruitment images perfectly today. Save money, avoid panic, and secure your exam entry passport effortlessly.',
        bgGradient: 'from-emerald-600 to-blue-700',
        emoji: '🚀'
      }
    ]
  },
  {
    slug: 'compress-pdf-for-govt-exams',
    title: 'How to Compress Scanned Documents Under 100KB/200KB',
    description: 'Scanned marksheets or caste certificates too heavy to upload? Learn how to shrink PDF documents easily.',
    coverImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=720&q=80',
    targetUrl: 'https://sizesnap.in/compress-pdf/to-100kb',
    ctaText: 'Compress PDF to 100KB',
    slides: [
      {
        heading: 'Heavy Scanned Documents?',
        text: 'When you scan marksheets, Aadhaar cards, or passbooks, the resulting PDF is often 2MB to 5MB. Most job portals block files above 200KB!',
        bgGradient: 'from-amber-600 to-red-600',
        emoji: '📄'
      },
      {
        heading: 'The Rejection Danger',
        text: 'If you compress aggressively using basic software, the text becomes a blurry mess. If recruiters can\'t read your marksheet, your form gets rejected.',
        bgGradient: 'from-red-700 to-slate-900',
        emoji: '⚠️'
      },
      {
        heading: 'Smart PDF Shrinking',
        text: 'SizeSnap uses advanced client-side compression algorithms that target heavy embedded background layers while keeping text perfectly crisp.',
        bgGradient: 'from-blue-700 to-indigo-800',
        emoji: '🗜️'
      },
      {
        heading: 'No Software Installation',
        text: 'Forget paying for heavy premium software. Compress documents safely right on your phone or computer instantly.',
        bgGradient: 'from-teal-600 to-emerald-700',
        emoji: '💻'
      },
      {
        heading: '100% Secure & Confidential',
        text: 'Government certificates carry highly sensitive personal data. Our tools operate locally so your documents never touch a third-party server.',
        bgGradient: 'from-indigo-900 to-purple-800',
        emoji: '🔒'
      },
      {
        heading: 'Shrink Your PDF Now!',
        text: 'Hit exactly under 100KB or 200KB benchmarks in seconds while maintaining pristine quality.',
        bgGradient: 'from-emerald-600 to-teal-700',
        emoji: '🚀'
      }
    ]
  },
  {
    slug: 'reduce-image-size-without-losing-quality',
    title: 'How to Reduce Image Size in KB Without Losing Quality',
    description: 'Master the hidden browser trick to shrink photo sizes while preserving perfect clarity and pixel sharpness.',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=720&q=80',
    targetUrl: 'https://sizesnap.in/compress-image/to-50kb',
    ctaText: 'Compress Image Free',
    slides: [
      {
        heading: 'The Quality Drop Dilemma',
        text: 'Most online compressors compress images by destroying pixels, making faces muddy and fine text impossible to decipher.',
        bgGradient: 'from-red-600 to-purple-800',
        emoji: '📉'
      },
      {
        heading: 'The Smart Pixel Scaling Trick',
        text: 'Instead of random distortion, smart resizing reduces heavy color spaces and redundant meta blocks hidden inside phone files.',
        bgGradient: 'from-indigo-900 to-slate-800',
        emoji: '🧠'
      },
      {
        heading: 'Perfect for High-Res Files',
        text: 'Whether it is a 4K wallpaper or an intensive smartphone landscape click, hit exact sizes smoothly.',
        bgGradient: 'from-pink-600 to-rose-700',
        emoji: '🎯'
      },
      {
        heading: 'Zero Watermarks Ever',
        text: 'Many platforms put an ugly logo or branding mark on your compressed files. SizeSnap keeps your downloads completely clean.',
        bgGradient: 'from-emerald-600 to-teal-700',
        emoji: '🛡️'
      },
      {
        heading: 'Lightning Processing Speeds',
        text: 'Since processing bypasses long server queues, experience instant client-side execution in a split second.',
        bgGradient: 'from-blue-600 to-cyan-700',
        emoji: '⚡'
      },
      {
        heading: 'Start Compressing Now!',
        text: 'Scale your favorite files to exact targeted KB limits gracefully and instantly for free.',
        bgGradient: 'from-purple-600 to-indigo-700',
        emoji: '🚀'
      }
    ]
  }
];

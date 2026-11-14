import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';

interface HindiGuideData {
  heading: string;
  intro: string;
  photoTitle: string;
  photoRules: string[];
  signTitle: string;
  signRules: string[];
  proTipTitle: string;
  proTipText: string;
}

const HINDI_EXAM_GUIDES_MAP: Record<string, HindiGuideData> = {
  'ssc-photo-signature-resizer': {
    heading: 'SSC CGL / CHSL / GD / MTS Photo & Signature Size 2026 (Complete Hindi & Hinglish Guide)',
    intro:
      'SSC (Staff Selection Commission) ke kisi bhi online form (CGL, CHSL, MTS, GD Constable, CPO) me sabse zyada applications sirf galat Photo aur Signature upload karne ki wajah se reject hote hain. Niche diye gaye official SSC rules ko dhyan se dekhein:',
    photoTitle: '1. SSC Photo Size Kaise Banaye (20KB - 50KB Rule)',
    photoRules: [
      'File Size: Aapki passport photo strictly 20KB se 50KB ke beech honi chahiye (35KB best rehta hai).',
      'Dimensions: Width 3.5 cm aur Height 4.5 cm (350 × 450 pixels) JPEG/JPG format me.',
      'No Spectacles & No Cap: Chashma (spectacles) ya cap pehan kar li gayi photo seedhe reject ho jati hai.',
      'Background & Posture: Plain white background ho aur dono kaan (both ears) saaf dikhne chahiye.',
    ],
    signTitle: '2. SSC Signature Size Kaise Kare (10KB - 20KB Rule)',
    signRules: [
      'File Size: Signature strictly 10KB se 20KB ke andar hona zaroori hai (4.0 cm × 2.0 cm / 280 × 120 px).',
      'Ink & Paper: Plain white paper par Black ya Dark Blue ballpoint pen se running hand me sign karein (CAPITAL letters me sign na karein).',
      'No Blur: Compress karne ke baad signature dhundhla (blur) nahi hona chahiye.',
    ],
    proTipTitle: 'Mobile Se 10 Second Me SSC Photo/Sign Kaise Resize Karein?',
    proTipText:
      'Upar diye gaye SizeSnap SSC Resizer me bas apni photo ya signature select karein. Humara tool automatically 350×450 px (photo) ya 280×120 px (sign) set karke exact 35KB / 15KB me HD file taiyar kar deta hai.',
  },
  'upsc-photo-signature-resizer': {
    heading: 'UPSC IAS / NDA / CDS / OTR Photo par Name & Date (DOP) Kaise Likhe (Hindi Guide)',
    intro:
      'UPSC (Civil Services, NDA, CDS, CAPF, EPFO) ne OTR aur application forms ke liye 10-Day Photo Rule aur Name & Date (DOP) अनिवार्य (mandatory) kar diya hai. Purani ya bina naam wali photo upload karne par form reject ho sakta hai.',
    photoTitle: '1. UPSC 3-Point Photo Rule (20KB - 300KB, Square 1:1)',
    photoRules: [
      '10-Day Rule: Photo form shuru hone ki tarikh se 10 din se zyada purani nahi honi chahiye.',
      'Name & Date Stamp (DOP): Photo ke niche safed patti par Candidate ka Full Name aur Date of Photo साफ अक्षरों me likha hona chahiye.',
      'Dimensions: Minimum 350×350 pixels se Maximum 1000×1000 pixels (SizeSnap automatically 550×550 px set karta hai).',
      '75% Face Coverage: Chehra photo ke frame ka 75% hissa cover karna chahiye.',
    ],
    signTitle: '2. UPSC Signature Size Rules (20KB - 300KB)',
    signRules: [
      'Safed bina line wale kगज (unruled white paper) par Black ink pen se saaf signature karein.',
      'File size 20KB se 300KB ke beech aur pixel width/height 350px se 1000px ke andar honi chahiye.',
    ],
    proTipTitle: 'Photo Par Naam Aur Date Automatic Kaise Lagaye?',
    proTipText:
      'Upar tool me apni photo upload karein, "Add Name & Date of Photo (DOP) Stamp" tick rakhein, aur apna Naam va Date type karein—SizeSnap apne aap UPSC OTR format me safed strip aur bold text laga dega!',
  },
  'delhi-police-photo-resizer': {
    heading: 'Delhi Police Constable & SI Photo / Signature Size Guide (Hindi / Hinglish)',
    intro:
      'Delhi Police Constable (Executive), Head Constable aur SI bharti me SSC/Delhi Police portal par photo background aur KB limit ki bahut strict checking hoti hai.',
    photoTitle: '1. Delhi Police Photo Rules (20KB - 50KB, 3.5×4.5 cm)',
    photoRules: [
      'File Size: Photo ka size 20KB se 50KB ke beech (JPEG format) hona chahiye.',
      'Pure White Background: Photo ke piche deewar ya parda nahi, balki plain white background hona chahiye.',
      'No Glasses / Cap: Chashme me flash reflection ya cap bilkul allowed nahi hai.',
    ],
    signTitle: '2. Delhi Police Signature Rules (10KB - 20KB, 4×2 cm)',
    signRules: [
      'Safed paper par Black ya Blue pen se running handwriting me sign karein.',
      'Signature ka size 10KB se 20KB aur dimension 4.0 cm × 2.0 cm hona chahiye.',
    ],
    proTipTitle: 'Ghar Baithe Coloured Background Ko White Kaise Karein?',
    proTipText:
      'Agar aapने ghar ki deewar ke aage photo li hai, toh upar "Make Background White (AI 1-Click)" button dabayein—SizeSnap 1 click me piche ka background pure white kar dega!',
  },
  'up-police-photo-resizer': {
    heading: 'UP Police Constable & SI Bharti Photo / Signature Size Guide (UPPRPB Rules)',
    intro:
      'UPPRPB (Uttar Pradesh Police Recruitment Board) Constable, SI, aur Computer Operator bharti me photo aur काले पेन (Black Ink) ke signature ko lekar khaas niyam hain:',
    photoTitle: '1. UP Police Photo Size (20KB - 50KB, 35mm × 45mm)',
    photoRules: [
      'Photo 6 mahine se zyada purani nahi honi chahiye aur background safed (white) ya halka grey ho.',
      'Chehra kam se kam 70% frame me dikhna chahiye aur dono kaan saaf nazar aane chahiye.',
      'File size strictly 20KB se 50KB ke beech JPG format me hona chahiye.',
    ],
    signTitle: '2. UP Police Signature Size (5KB - 20KB, Black Ink Only)',
    signRules: [
      'Sirf Black Ink (काले बॉलपॉइंट पेन) se safed paper par sign karein.',
      'Signature ka size 5KB se 20KB ke beech (3.5 cm × 1.5 cm) hona chahiye.',
    ],
    proTipTitle: 'UP Police Form Reject Hone Se Kaise Bachayein?',
    proTipText:
      'UP Police me selfie ya tirchi photo mat dalein. Upar tool me photo aur signature upload karke exact 35KB photo aur 12KB signature download karein.',
  },
  'ibps-bank-photo-signature-resizer': {
    heading: 'IBPS & SBI Bank PO/Clerk: Photo, Signature, Thumb & Declaration Guide (Hindi)',
    intro:
      'IBPS (PO, Clerk, SO, RRB) aur SBI bank exams me 4 alag-alag documents upload karne padte hain. Ek bhi document galat size ya galat ink me hone par admit card ruk sakta hai:',
    photoTitle: '1. Photo (20-50KB) & Left Thumb Impression (20-50KB)',
    photoRules: [
      'Passport Photo: 200 × 230 pixels, size 20KB se 50KB, light/white background.',
      'Left Thumb Impression (LTI): Safed paper par Blue ya Black ink pad se بائیں हाथ के अंगूठे (Left Thumb) ka saaf nishan lagayein (240 × 240 px, 20KB–50KB).',
    ],
    signTitle: '2. Signature (10-20KB) & Handwritten Declaration (50-100KB)',
    signRules: [
      'Strictly Black Pen: IBPS/SBI me Signature aur Declaration dono SIRF BLACK PEN se hone chahiye (Blue ink reject ho jati hai).',
      'Signature Size: 140 × 60 pixels, 10KB se 20KB ke beech.',
      'Handwritten Declaration: 800 × 400 pixels (10cm × 5cm), 50KB se 100KB ke beech, English running handwriting me.',
    ],
    proTipTitle: 'Charo Bank Documents Ek Hi Jagah Se Kaise Banaye?',
    proTipText:
      'Upar diye gaye 4 tabs (Passport Photo, Signature, Left Thumb Impression, Hand Written Declaration) par bar-bar click karke aap charo files exact pixel aur KB me 1 minute me bana sakte hain!',
  },
  'rrb-railway-photo-signature-resizer': {
    heading: 'Railway RRB NTPC / Group D / ALP Photo & Signature Size (30KB - 70KB Hindi Guide)',
    intro:
      'Railway Recruitment Board (RRB NTPC, Group D, ALP, Technician, JE, RPF) ke online portal par photo aur signature dono ka size 30KB se 70KB ke beech maanga jata hai:',
    photoTitle: '1. Railway RRB Photo Rules (30KB - 70KB, 35mm × 45mm)',
    photoRules: [
      'File Size: Photo 30KB se kam ya 70KB se zyada nahi honi chahiye (50KB ideal hai).',
      'Background: Plain white ya light-colored background, bina cap ya dark chashme ke.',
      'Yahi same photo ki 10-12 print copies sambhal kar rakhein jo CBT exam aur Document Verification (DV) me kaam aayengi.',
    ],
    signTitle: '2. Railway RRB Signature Rules (30KB - 70KB, 50mm × 20mm)',
    signRules: [
      'Aksar mobile se crop kiya gaya signature sirf 8KB-15KB ka hota hai jise RRB portal "File size less than 30KB" kehkar reject kar deta hai.',
      'SizeSnap aapke signature ko bina phate automatically 30KB–70KB (recommended 50KB) me convert karta hai.',
    ],
    proTipTitle: 'Signature 30KB Se Kam Ho Raha Hai Toh Kya Karein?',
    proTipText:
      'Upar "Candidate Signature" tab chunein aur apni sign photo upload karein—SizeSnap ka smart padding engine choti sign file ko bhi exact 50KB (30KB-70KB range) me bana dega!',
  },
  'neet-jee-photo-signature-resizer': {
    heading: 'NEET UG, JEE Main & CUET Photo, Postcard (4×6) & Signature Guide (NTA Rules)',
    intro:
      'National Testing Agency (NTA) NEET UG, JEE Main aur CUET forms me Passport Photo ke sath-sath 4×6 inch Postcard Photo aur Fingers Impression bhi maangti hai:',
    photoTitle: '1. NTA Passport Photo & 4×6 Postcard Photo (10KB - 200KB)',
    photoRules: [
      '80% Face Coverage: Photo me aapka chehra (bina mask ke, dono kaan sahit) 80% area me dikhna chahiye aur background pure white ho.',
      'Name & Date on Photo: Photo ke niche Candidate Name aur Date of Taking Photograph (DOP) likhna zaroori hai.',
      'Postcard Photo (NEET): 4" × 6" inch (1200 × 1800 px) size me 10KB se 200KB ke beech.',
    ],
    signTitle: '2. NTA Signature (4KB - 30KB) & Finger Impressions (10KB - 200KB)',
    signRules: [
      'Signature: Safed paper par Black pen se running hand me sign karein (4KB se 30KB).',
      'Fingers & Thumb Impression: Dono haatho ki ungliyon aur anguthe ke nishan safed paper par lein (10KB se 200KB).',
    ],
    proTipTitle: 'Ek Hi Photo Se Passport Aur 4×6 Postcard Photo Kaise Banaye?',
    proTipText:
      'Upar pehle "Passport Photo" tab se 3.5×4.5cm photo download karein, fir "Postcard Size Photo (4"×6")" tab par click karke wahi photo 1200×1800 px me turant download kar lein!',
  },
  'ctet-kvs-photo-signature-resizer': {
    heading: 'CTET, KVS & State TET Photo aur Signature Size Guide (Hindi / Hinglish)',
    intro:
      'CBSE CTET (Paper 1 & 2), KVS, NVS aur State TET (UPTET, REET, Bihar STET) forms me saaf passport photo aur running signature upload karna zaroori hai taaki Admit Card aur Certificate par photo clear chhape:',
    photoTitle: '1. CTET Photo Size Rules (10KB - 100KB, 3.5×4.5 cm)',
    photoRules: [
      'File size 10KB se 100KB ke beech (40KB best hai) aur dimension 3.5 cm × 4.5 cm hona chahiye.',
      'Light ya white background wali latest color photo use karein.',
    ],
    signTitle: '2. CTET Signature Size Rules (3KB - 30KB, 3.5×1.5 cm)',
    signRules: [
      'Safed paper par Black ballpoint pen se sign karein.',
      'File size 3KB se 30KB ke beech (recommended 15KB) रखे.',
    ],
    proTipTitle: 'Mobile Se CTET Photo Aur Sign Turant Resize Karein',
    proTipText:
      'Upar diye gaye tabs se Photo (40KB) aur Signature (15KB) select karke 1 click me upload-ready JPG download karein.',
  },
  'bihar-bpsc-police-photo-signature-resizer': {
    heading: 'Bihar BPSC TRE, BSSC & Bihar Police Hindi/English Signature & Photo Guide',
    intro:
      'Bihar BPSC (Teacher TRE, 70th CCE), BSSC aur CSBC Bihar Police ke online forms me sabse badi dikkat Signature ko 15KB ke andar (220×100 px) rakhne me aati hai:',
    photoTitle: '1. Bihar BPSC & Police Photo Rules (20KB - 50KB)',
    photoRules: [
      'Clean white background ke aage li gayi latest photo jisme dono kaan saaf dikhein.',
      'File size 20KB se 50KB (CSBC Bihar Police ke liye 15KB–25KB slider set karein).',
    ],
    signTitle: '2. Hindi & English Signature Under 15KB / 25KB (220×100 px)',
    signRules: [
      'BPSC OTR portal par Hindi aur English dono signature strictly 15KB se kam (10KB–15KB) hone chahiye.',
      'Pixel dimension 220 × 100 px hona chahiye aur Hindi ke akshar/matra blur nahi hone chahiye.',
    ],
    proTipTitle: 'BPSC 15KB Signature Bina Blur Kiye Kaise Banaye?',
    proTipText:
      'Upar "Hindi & English Signature" tab par click karein—humne target size 14KB aur dimension 220×100 px pehle se lock rakha hai taaki BPSC portal par 1 baar me upload ho jaye!',
  },
  'rajasthan-rsmssb-reet-photo-signature-resizer': {
    heading: 'Rajasthan SSO ID, RSMSSB CET, RPSC & REET Photo (50-100KB) & Sign (20-50KB) Guide',
    intro:
      'Rajasthan SSO Portal (RSMSSB CET, Patwari, Pashu Parichar, REET, RPSC) par sabse zyada students ko "File size must be between 50KB to 100KB" ya "Signature must be at least 20KB" ka error aata hai:',
    photoTitle: '1. Rajasthan SSO Photo Size (50KB - 100KB)',
    photoRules: [
      'Dhyan dein: Rajasthan SSO par 50KB se choti photo upload NAHI hoti! Photo 50KB se 100KB ke beech honi chahiye.',
      'Dimension 3.5 cm × 4.5 cm (recommended 70KB) rakhein.',
    ],
    signTitle: '2. Rajasthan SSO Signature Size (20KB - 50KB, 7×2 cm)',
    signRules: [
      'Signature ka size 20KB se kam hone par SSO portal reject kar deta hai.',
      'SizeSnap aapke 8KB-10KB ke mobile signature ko bhi bina quality kharab kiye 30KB (20KB-50KB range) me bana deta hai.',
    ],
    proTipTitle: 'SSO Portal "Minimum 20KB / 50KB" Error Kaise Solve Karein?',
    proTipText:
      'Bas upar apni photo ya sign upload karein—SizeSnap automatically photo ko ~70KB aur signature ko ~30KB par set kar dega!',
  },
  'mpesb-mp-police-photo-signature-resizer': {
    heading: 'MPESB (Vyapam) MP Police, Patwari & MPPSC Photo par Name & Date Guide',
    intro:
      'Madhya Pradesh MPESB (PEB Vyapam) Profile Panjiyan aur MP Police / TET / Patwari forms me photo ke niche Candidate Name aur Photo khichne ki Date (3 mahine ke andar) hona anivarya hai:',
    photoTitle: '1. MPESB Photo with Name & Date Rules (20KB - 100KB)',
    photoRules: [
      'Photo ke niche safed patti par poora naam aur photo date saaf likhi honi chahiye.',
      'Photo 3 mahine se zyada purani na ho aur background plain white ho.',
    ],
    signTitle: '2. MPESB & MPPSC Signature Rules (10KB - 50KB)',
    signRules: [
      'Safed paper par Black pen se running hand me signature karein (Capital letters me nahi).',
    ],
    proTipTitle: 'MP Online Template Ke Liye Photo Kaise Taiyar Karein?',
    proTipText:
      'Upar tool me photo upload karke apna Naam aur Date dalein—SizeSnap turant MPESB compliant Name & Date wali photo bana dega.',
  },
  'india-post-gds-photo-signature-resizer': {
    heading: 'India Post GDS (Gramin Dak Sevak) Photo (200×230 px) & Sign (140×60 px) Hindi Guide',
    intro:
      'India Post GDS (BPM / ABPM / Dak Sevak) form bharte samay indiapostgdsonline.gov.in portal KB size ke sath-sath exact pixel dimension (200×230 aur 140×60) bhi check karta hai:',
    photoTitle: '1. GDS Photo Size (20KB - 50KB, 200 × 230 Pixels)',
    photoRules: [
      'Photo ka size 50KB se kam (20KB–50KB) aur pixel 200 × 230 px hona chahiye.',
      'Plain white/light background aur seedha chehra hona zaroori hai.',
    ],
    signTitle: '2. GDS Signature Size (10KB - 20KB, 140 × 60 Pixels)',
    signRules: [
      'Signature ka pixel size 140 × 60 px aur file size 10KB se 20KB ke beech hona chahiye.',
    ],
    proTipTitle: 'GDS Portal Par "Invalid Dimension" Error Kaise Hataye?',
    proTipText:
      'Upar GDS Resizer me apni photo aur sign upload karein—humne exact 200×230 px aur 140×60 px lock kar rakha hai jisse portal par turant upload hoga.',
  },
  'gate-iit-jam-photo-signature-resizer': {
    heading: 'GATE, IIT JAM & CSIR NET (GOAPS Portal) Photo & Signature Scrutiny Fix Guide',
    intro:
      'IIT GATE (GOAPS Portal) aur JAM me har saal hazaron forms "Under Scrutiny / Defective Photo or Signature" me chale jate hain kyunki background pure white nahi hota ya signature chota hota hai:',
    photoTitle: '1. GATE GOAPS Photo Rules (3.5×4.5 cm, 60-70% Face)',
    photoRules: [
      'Background 100% pure white hona chahiye (agar deewar ka rang hai toh upar AI White Background button use karein).',
      'Chehra frame ka 60% se 70% hissa cover karna chahiye.',
    ],
    signTitle: '2. GATE Signature 2:7 Aspect Ratio Rules (560 × 160 px)',
    signRules: [
      'Signature ko tight crop karein taaki wo box ka 70%–80% area cover kare (2cm × 7cm ratio).',
      'Sirf Black ya Dark Blue ink pen ka upyog karein.',
    ],
    proTipTitle: 'GOAPS Defect Se Kaise Bachein?',
    proTipText:
      'Upar tool me AI White Background aur 560×160 px Signature tab ka use karke 100% scrutiny-safe files download karein.',
  },
  'pan-card-nsdl-uti-photo-signature-resizer': {
    heading: 'PAN Card Photo (213×213 px, 300 DPI) & Signature Resizer (NSDL & UTIITSL Guide)',
    intro:
      'Naya PAN Card banane ya correction karne ke liye UTIITSL aur NSDL (Protean) portal par square 213×213 pixel (under 30KB) photo aur 600 DPI signature maanga jata hai:',
    photoTitle: '1. UTIITSL & NSDL PAN Photo Size (213 × 213 px, <30KB)',
    photoRules: [
      'UTIITSL ke liye photo 213 × 213 pixels (300 DPI) aur 30KB se kam honi chahiye.',
      'NSDL ke liye photo 50KB se kam honi chahiye—humara 22KB preset dono portals par kaam karta hai!',
    ],
    signTitle: '2. PAN Card Signature Size (400 × 200 px, <60KB)',
    signRules: [
      'Safed paper par Black pen se sign karein (file size ~28KB rakha gaya hai jo NSDL aur UTI dono me valid hai).',
    ],
    proTipTitle: 'Aadhaar PDF 300KB Se Kam Kaise Karein?',
    proTipText:
      'PAN Card form me Aadhaar PDF upload karne ke liye humara Compress PDF to 200KB tool use karein.',
  },
};

export function HindiExamGuide({ slug }: { slug: string }) {
  const guide = HINDI_EXAM_GUIDES_MAP[slug];

  if (!guide) {
    return null;
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#414FA8] shrink-0" />
          <span>{guide.heading}</span>
        </h2>
        <span className="text-[11px] font-semibold bg-[#EEF1FB] text-[#414FA8] px-2.5 py-0.5 rounded">
          Hindi / Hinglish Guide
        </span>
      </div>

      <div className="text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed">
        <p>{guide.intro}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 bg-gray-50 rounded border border-gray-200 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">{guide.photoTitle}</h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {guide.photoRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-gray-50 rounded border border-gray-200 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">{guide.signTitle}</h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {guide.signRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-3.5 bg-[#EEF1FB]/70 border border-[#9AA3C8]/40 rounded space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-[#414FA8]">{guide.proTipTitle}</h3>
          <p className="text-xs text-gray-700">{guide.proTipText}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500">
            Aur detail me step-by-step guides padhne ke liye humara Hinglish Guides Hub dekhein:
          </span>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 font-bold text-[#414FA8] hover:underline"
          >
            <span>Open Exam &amp; KB Guides Hub</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

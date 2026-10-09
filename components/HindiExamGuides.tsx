import React from 'react';

export function HindiExamGuide({ slug }: { slug: string }) {
  if (slug === 'ssc-photo-signature-resizer') {
    return (
      <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
          SSC CGL/CHSL/GD Photo & Signature Size 2026 (Complete Hindi Guide)
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-3 leading-relaxed">
          <p>
            SSC (Staff Selection Commission) ke kisi bhi form (CGL, CHSL, MTS, GD Constable) me sabse zyada applications sirf <strong>galat Photo aur Signature</strong> upload karne ki wajah se reject hote hain. Agar aap nahi chahte ki aapki saalo ki mehnat waste ho, toh in official rules ko dhyan se padhein.
          </p>
          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">SSC Photo Size and Rules (20KB - 50KB)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>File Size:</strong> Aapki photo exactly 20KB se 50KB ke beech honi chahiye.</li>
            <li><strong>Dimension/Format:</strong> Width 3.5cm aur Height 4.5cm. File hamesha JPEG/JPG format me ho.</li>
            <li><strong>No Spectacles & No Cap:</strong> Chashma (spectacles) pehan kar li gayi photo seedhe reject ho jayegi, bhale hi aap number wala chashma pehante hon. Topi/Cap bhi allowed nahi hai.</li>
            <li><strong>Background:</strong> Hamesha light background (preferably plain white) ka hi use karein.</li>
            <li><strong>Frontal View:</strong> Aapke dono kaan (both ears) photo me saaf dikhne chahiye.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">SSC Signature Size and Rules (10KB - 20KB)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>File Size:</strong> Signature strictly 10KB se 20KB ke andar hona zaroori hai. Yahi sabse trickiest part hota hai!</li>
            <li><strong>Ink & Paper:</strong> Safed (white) plain paper par Black ya Blue ink (ballpoint pen) se sign karein.</li>
            <li><strong>Blurry Sign = Reject:</strong> Agar signature compress hone ke baad blur (dhundhla) ho gaya, toh form reject ho jayega. (Isiliye SizeSnap ka algorithm HD compression use karta hai).</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">30 Seconds Me Photo/Sign Kaise Resize Karein?</h3>
          <p>
            SizeSnap par humne SSC ke liye special <strong>One-Click Preset</strong> banaya hai. Bas apni photo select karein, &quot;SSC&quot; preset par click karein, aur humara AI tool apne aap dimension aur size (e.g., 35KB for photo, 15KB for sign) fix kar dega bina quality loss kiye. Ye 100% private hai!
          </p>
        </div>
      </div>
    );
  }

  if (slug === 'upsc-photo-signature-resizer') {
    return (
      <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
          UPSC Photo & Signature Size Rules 2026 (Name & Date Guideline)
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-3 leading-relaxed">
          <p>
            UPSC (Civil Services, NDA, CDS, EPFO) ne apne latest notification me photo upload rules ko bahut strict kar diya hai. Ab purani photos upload karne par form sidha cancel ho raha hai.
          </p>
          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">UPSC 3-Point Photo Rule (Sabse Zaroori)</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Latest Photo:</strong> Photo form bharne ki date se 10 din se zyada purani nahi honi chahiye.</li>
            <li><strong>Name and Date on Photo:</strong> Photo ke theek niche aapka <strong>Poora Naam (Full Name)</strong> aur <strong>Photo khichne ki Date (Date of Photograph)</strong> saaf aksharon me likhi honi chahiye.</li>
            <li><strong>70% Face Coverage:</strong> Aapka chehra photo ka at least 75% area cover karna chahiye.</li>
          </ol>

          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Size Requirements (20KB - 300KB)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Photo & Sign Size:</strong> Dono ka size 20KB se lekar 300KB ke beech hona chahiye. (Pehle max limit 300KB nahi thi, abhi badhai gayi hai).</li>
            <li><strong>Dimension Range:</strong> Minimum 350x350 pixels aur Maximum 1000x1000 pixels. Photo perfectly square aspect ratio ke aas-paas honi chahiye.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">UPSC Form me Form Reject Hone se Kaise Bachein?</h3>
          <p>
            UPSC form me signature ki clarity bahut important hai. Apne phone se photo lete waqt dhyan rakhein ki shadow na aaye. SizeSnap ka <strong>UPSC Preset</strong> automatically aapki photo ko 350x350 px min-dimension me scale kar deta hai aur size ko ~100KB-200KB ke sweet spot me rakhta hai taaki quality ekdum crisp rahe!
          </p>
        </div>
      </div>
    );
  }

  return null;
}

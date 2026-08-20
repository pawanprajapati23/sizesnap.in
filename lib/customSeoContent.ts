export type CustomSeoData = {
  metaTitle: string
  metaDescription: string
  h1: string
  introParagraph: string
  bodyHtml: string
  faqs: { question: string; answer: string }[]
}

export const customSeoData: Record<string, CustomSeoData> = {
  'live-document-scanner/camscanner-clone': {
    metaTitle: 'Free CamScanner Alternative Online | Live Document Scanner | SizeSnap',
    metaDescription: 'Use your phone camera to scan documents directly in the browser. Apply Magic B&W filters and save as A4 PDF instantly without downloading any app.',
    h1: 'Live Document Scanner (Turn Phone into Scanner)',
    introParagraph: 'Ab aapko physical documents scan karne ke liye koi bhaari 3rd-party app (jaise CamScanner) download karne ki zaroorat nahi hai. SizeSnap ka Live Document Scanner aapke phone ke camera ko direct browser se connect karke highest quality PDF generate karta hai.',
    bodyHtml: `
      <h2>Browser-Based CamScanner Clone Kaise Kaam Karta Hai?</h2>
      <p>Aamtaur par kisi paper document ko scan karne ke liye log play store se alag-alag apps download karte hain, jo bohot saare ads dikhati hain aur aapke data ka galat istemaal kar sakti hain. Humne ek aisi technology develop ki hai jisse aapka mobile camera sidha is website (browser) ke andar khulta hai.</p>
      
      <h3>Magic Black & White Filter (Like Original Scanner)</h3>
      <p>Jab aap normal phone camera se photo khinchte hain, toh usme parchaai (shadows) aur low light ki wajah se text clear nahi aata. Hamara tool photo capture hote hi us par "Magic Filter" laga deta hai. Ye filter automatically shadows ko hatata hai, contrast badhata hai, aur paper ko ekdum white karke text ko deep black (grayscale) me convert kar deta hai. Isse lagta hai jaise document kisi professional machine se scan hua ho.</p>

      <h3>100% Secure & Private Scanning</h3>
      <p>Kyunki ye tool pura browser ke andar offline chal raha hai (HTML5 aur Canvas API ki madad se), isliye aapke scanned documents jaise Aadhar card, PAN card, ya bank statements kabhi bhi hamare server par upload nahi hote. Sab kuch aapke phone me process hota hai aur wahin se direct A4 size ka PDF bankar aapke phone me save ho jata hai.</p>
    `,
    faqs: [
      { question: 'Kya mujhe document scan karne ke liye koi App install karni padegi?', answer: 'Nahi! Ye ek Web App hai. Aapko bas apna Safari ya Chrome browser use karna hai aur "Open Camera" par tap karna hai.' },
      { question: 'Kya ye tool Multiple Pages ko ek hi PDF me combine kar sakta hai?', answer: 'Haan, aap ek-ek karke kitne bhi pages click kar sakte hain. "Save as PDF" dabane par wo sab ek single PDF file me compile ho jayenge.' },
      { question: 'Kya mere documents (Aadhar/PAN) ka data safe hai?', answer: '100% safe. Processing browser (client-side) me hoti hai, matlab data aapke phone se bahar nahi jata.' }
    ]
  },
  'resize-image/to-50kb': {
    metaTitle: 'Resize Image to 50KB Online Free (No Quality Loss) | SizeSnap',
    metaDescription: 'Need to resize photo to 50KB? Use our free online tool to compress and reduce image size under 50KB in 1-click. 100% private browser processing.',
    h1: 'Resize Image to 50KB Online Free',
    introParagraph: 'Kya aapko passport photo ya documents ka size exactly 50KB ke niche compress karna hai? SizeSnap ka tool photo ki quality kharab kiye bina resolution scaling perform karta hai.',
    bodyHtml: `
      <h2>50KB Image Resize Kaise Karein? (Step-by-Step Guide)</h2>
      <p>Aapko kisi government portal ya college admission form par photo upload karni hai, lekin portal error show kar raha hai? Phone cameras se clicked photos normal resolution me 3MB se 10MB tak ki hoti hain. Lekin online portal strictly 50KB ya usse choti size ki digital format images accept karte hain. SizeSnap ke dynamic resize algorithm ki wajah se aap instantly image ko 50KB ke benchmark me convert kar sakte hain.</p>
      
      <h3>Browser-side Local Resizing Ke Fayde</h3>
      <p>SizeSnap par compression local JavaScript engine ke zariye kiya jata hai. Iska matlab hai ki aapki personal photo hamare digital database ya internet server par upload nahi hoti hai. Aapki privacy 100% secure rehti hai aur transaction process quick complete hota hai bina continuous network loads ke. Aap easily single click me output image download kar sakte hain.</p>
      
      <h3>Avoid Rejections by Resizing Properly</h3>
      <p>Kai software automatic image reduce karte waqt file quality ko bigad dete hain. Face blurry hone par government systems (jaise ssc, upsc portals) applications ko direct reject kar dete hain. SizeSnap safe boundaries me dimensions lock karke quality optimize karta hai taaki document readability barqarar rahe aur aapko upload errors na milein.</p>
      
      <h3>Internal References to Other Formats</h3>
      <p>Agar aapko isse choti file size chahiye to aap <a href="/resize-image-to-20kb">20KB Image Resizer</a> ya scanned copy ke liye <a href="/resize-image-to-100kb">100KB Document Compress</a> pages ka upyog bhi kar sakte hain. SSC applications ki detailed guide ke liye aap <a href="/image-size-for-ssc-form">SSC Form Photo Specifications</a> ko padh sakte hain.</p>
    `,
    faqs: [
      { question: 'Kya 50KB me compress karne par photos blurry ho jati hain?', answer: 'Nahi, SizeSnap smart pixel compression scale use karta hai. Is wajah se basic details clear aur legible rehti hain bina resolution distrotion ke.' },
      { question: 'Kya ye tool signature resize ke liye bhi chalega?', answer: 'Haan, aap signature scan copy upload karke use standard formats ke anusaar 50KB ya usse niche convert kar sakte hain.' },
      { question: 'Mobile phone par sizesnap se compress kaise karein?', answer: 'Apne mobile browser me sizesnap.in open karein, photo select karein, target automatically process ho jayega aur direct download option mil jayega.' }
    ]
  },
  'resize-image/to-20kb': {
    metaTitle: 'Resize Image to 20KB Online Free - Photo & Sign | SizeSnap',
    metaDescription: 'Shrink image to 20KB online for free. Best tool to compress passport photo or signature scan copy under 20KB for SSC, UPSC, and state board exams.',
    h1: 'Resize Image to 20KB Online Free',
    introParagraph: 'Signature aur small passport size photos ko strictly 20KB ke niche compress karna boards aur job applications me mandatory hota hai. Hamara tool aapko exact size deta hai bina text details khoye.',
    bodyHtml: `
      <h2>Passport Photo aur Signature to 20KB Converter</h2>
      <p>Aamtaur par online exams jaise Staff Selection Commission (SSC) ya UPSC me candidate signature upload size boundary 10KB se 20KB ke bich set ki jati hai. Scanned files ko is strict criteria me fit karna bohot complex kaam hai agar aap normal editor use karte hain. SizeSnap signature files ko locally compress karta hai taaki quality and readability clear rahe.</p>
      
      <h3>Signature Dimensions and Guidelines</h3>
      <p>Jab aap sign scan photo compress kar rahe hain, to koshish karein ki blank clean white sheet par dark black ink ya blue pen se sign karein. Rectangular aspect ratio select karke photo compress karein taaki official system usko read kar sake. Signature text clear nahi hoga to document cross validation failed ho jayegi.</p>
      
      <h3>Privacy First processing model</h3>
      <p>Hum security rules ko follow karte hain aur user data servers par save nahi karte. Security-wise, aapka passport aur sign scans direct app layer me browser sandbox ke andar optimize hota hai. Ye system standard tools ke mukable safe aur fast execution offer karta hai.</p>
    `,
    faqs: [
      { question: 'Signature size under 20KB kaise set karein?', answer: 'Signature scan sheet copy upload karein, custom targets 10KB ya 20KB option select karein, 1 second me optimal image file ready ho jayegi.' },
      { question: 'Kya formats support kiye jate hain?', answer: 'Aap JPG aur PNG dono format files compress kar sakte hain. Output standard web-compatible format me save hota hai.' },
      { question: 'Mera signature read ho payega?', answer: 'Haan, compression text parameters aur margins background noise hata kar text visibility clear banata hai.' }
    ]
  },
  'resize-image/to-100kb': {
    metaTitle: 'Resize Image to 100KB Online Free (Without Quality Loss) | SizeSnap',
    metaDescription: 'Resize and compress any scanned document image to 100KB online for free. Ideal for marksheets, identity cards, and certificates upload.',
    h1: 'Resize Image to 100KB Online Free',
    introParagraph: 'Marksheets, category certificates aur government IDs upload karte waqt 100KB limit aati hai. SizeSnap ke compression technique se documents clear rehte hain.',
    bodyHtml: `
      <h2>Scanned Documents Ko 100KB Kaise Banayein?</h2>
      <p>Government exam portals aur private databases me marksheet transcripts, caste certificates ya residence proof uploads limits normally 100KB max rehti hai. Normal scanner se capture images 2MB-3MB ho jati hain. Aggressive file scaling se numbers aur signatures text blur ho jata hai. SizeSnap anti-blur configuration apply karke files ko compress karta hai.</p>
      
      <h3>Important Tips for Marksheet Processing</h3>
      <p>Ensure karein ki scan documents ke characters (percentage value, name, year, passing division) highly readable hain. Scanned marksheets details ko preserve karne ke liye custom filters setup helpful hote hain. Aap direct mobile camera scan copy use karke 100KB image build kar sakte hain.</p>
      
      <h3>Browser Execution Advantage</h3>
      <p>Server based tools upload limits lagate hain aur documents read leakage ka risk rehta hai. SizeSnap browser me execute hota hai jisse transaction time 0 ho jata hai aur file privacy lock rehti hai. Unlimited documents processing completely free hai.</p>
    `,
    faqs: [
      { question: 'Certificate visibility affect to nahi hogi?', answer: 'Nahi, details and figures preserve karne ke liye specific smart adjustments handle kiye jate hain.' },
      { question: 'Safe download system kya hai?', answer: 'File conversion complete hote hi output file local device storage download folder me save ho jayegi.' }
    ]
  },
  'resize-image/to-200kb': {
    metaTitle: 'Resize Image to 200KB Online Free (Preserve Clarity) | SizeSnap',
    metaDescription: 'Need to compress your image to 200KB? Use our free browser-based resizer to shrink document photo file size to exactly 200KB or less instantly.',
    h1: 'Resize Image to 200KB Online Free',
    introParagraph: 'Aadhaar scan, PAN details ya detailed board marksheet uploads me 200KB size constraint apply hota hai. Hum browser sandboxing se file optimize karte hain.',
    bodyHtml: `
      <h2>Image Size under 200KB Constraints</h2>
      <p>UPSC aur state levels board portals multi-page documents or heavy scanned images file size limit exactly 200KB target range me rakhte hain. Is optimization me balance zaroori hai: size strict 200KB se choti ho par data readability full ho. SizeSnap detailed high quality images process karne me lead karta hai.</p>
      
      <h3>Perfect settings for official profiles</h3>
      <p>Aap images ko format specifications ke setup parameters me daal kar instant optimal results generate kar sakte hain. Dynamic checks check output scale aur verify button options user experience smooth banate hain. Zero complex login methods simplify accessibility.</p>
    `,
    faqs: [
      { question: '200KB size limit select kaise karein?', answer: 'Aap image select karke target control limit parameter scroll se adjust kar sakte hain.' },
      { question: 'Caste certificate scan size resize ho jayega?', answer: 'Haan, marksheet, certificate aur legal paperwork easily compile compress kiya ja sakta hai.' }
    ]
  },
  'resize-image/to-50kb-for-form': {
    metaTitle: 'Resize Image to 50KB for Online Form Submission | SizeSnap',
    metaDescription: 'Instantly format and resize your passport photos and certificates to under 50KB for college admission, board exams, and government job portals.',
    h1: 'Resize Image to 50KB for Online Forms',
    introParagraph: 'Admission recruitment portals check rules ko pass karne ke liye photos 50KB ke standard limits rules me setup honi chahiye. Avoid form validation fail errors.',
    bodyHtml: `
      <h2>Online Forms Ke Liye Image Format Rules</h2>
      <p>Admissions, recruitments aur professional registration processes me standard format rules bohot dynamic hote hain. UPSC IAS recruitment portal, UP Police ya central level banking notifications strictly size maximum limit 50KB rakhte hain. Standard dimensions 3.5x4.5 cm target configuration setup me fit karne ke liye dynamic resizer tools mandatory hain.</p>
      
      <h3>Dimension vs Size Constraints</h3>
      <p>Maximum size 50KB hone ke sath resolution adjust karna mathematical calculations rehti hai jo manually default apps se properly calculate nahi ho pati. Output blurry photo verification system automatically block kar dete hain. SizeSnap secure layout engine details match karta hai aur dynamic downloads ready karta hai.</p>
    `,
    faqs: [
      { question: 'Form me photo reject kyu hoti hai?', answer: 'Dimensions and file size constraints specify format instructions se misaligned hone par error generate hota hai.' },
      { question: '50KB limit ke anusaar configuration parameters kya hote hain?', answer: 'UPSC/SSC norms standard rules ke mutabik resolution target limits config set hoti hain.' }
    ]
  },
  'resize-image/to-50kb-for-whatsapp': {
    metaTitle: 'Resize Image to 50KB for WhatsApp (Fast Loading status & DP) | SizeSnap',
    metaDescription: 'Reduce image size under 50KB for fast WhatsApp sharing. Optimize profile DP and status photos to load instantly even on low networks without blur.',
    h1: 'Resize Image to 50KB for WhatsApp Sharing',
    introParagraph: 'WhatsApp features check optimize speed ke liye images 50KB format limits me dynamic scaling require karti hain. Keep sharing load minimal.',
    bodyHtml: `
      <h2>WhatsApp Media Size Optimization</h2>
      <p>Social networks like WhatsApp and Instagram images optimization criteria highly automated compress systems operate karte hain. Agar aap already optimal resolution format 50KB output set karke send karte hain, to internal compression engine changes ignore karta hai aur clear, unblurry image display karta hai status ya DP views me.</p>
      
      <h3>Smart Blurred margins layout</h3>
      <p>Square fit ratios custom targets fit DP formats size constraints apply karne ke liye SizeSnap dynamic templates parameters load handles karta hai. Smooth margins setup details protect karte hain background scaling views preserve rakhne me.</p>
    `,
    faqs: [
      { question: 'WhatsApp Profile photo compress kaise karein?', answer: 'Square DP profile constraints configurations settings use karke compress karein.' },
      { question: 'Slow connections check pass ho payega?', answer: 'Haan, 50KB files instantly transfer and render perform hoti hain.' }
    ]
  },
  'resize-image/to-50kb-for-ssc-exam': {
    metaTitle: 'Resize Image to 50KB for SSC Exam CGL/CHSL Portal | SizeSnap',
    metaDescription: 'Resize your passport photo to 20KB-50KB and signature to 10KB-20KB for Staff Selection Commission portals instantly and free.',
    h1: 'Resize Image to 50KB for SSC Exam Forms',
    introParagraph: 'Staff Selection Commission (SSC) CGL, CHSL notifications rules details validation pass karne ke liye passport size settings 20-50KB limits follow karein.',
    bodyHtml: `
      <h2>Staff Selection Commission Application Guidelines</h2>
      <p>SSC portal images verification procedures automated filters check criteria highly specify rules base design hota hai. Candidature valid rakhne ke liye photo front facing, neutral background, no caps, no black goggles aur signature blue/black ink configuration me mandatory hai. Photo maximum scale threshold target format strictly 50KB aur signature limit under 20KB valid hai.</p>
      
      <h3>Verify Photo upload instructions</h3>
      <p>Ensure correct lighting features on faces and clear eyes alignment. Hum parameters rules compile target match configure select check options handles karte hain aur outputs verify checks satisfy format render download deliver karte hain.</p>
    `,
    faqs: [
      { question: 'SSC dimensions ratio rule kya hai?', answer: 'Photo limits dimensions setup standard width 3.5cm x height 4.5cm hoti hai.' },
      { question: 'Signature limits background rule kya hai?', answer: 'White paper background par legible ink content signature valid parameters hai.' }
    ]
  },
  'resize-image/to-50kb-without-losing-quality': {
    metaTitle: 'Resize Image to 50KB Without Losing Quality Online | SizeSnap',
    metaDescription: 'Learn how to reduce photo size to 50KB while keeping pixels sharp and text readable. Try our lossless online browser compression tool.',
    h1: 'Resize Image to 50KB Without Losing Quality',
    introParagraph: 'Oversized profile photos check limits without distortions fix limits details setup parameters. Quality optimization locks pixels safely.',
    bodyHtml: `
      <h2>Lossless Image Quality Compression Math</h2>
      <p>Image processing me file size shrink aur quality safety coordinates preserve logic setup dynamics target calculation optimize rules par code depend hota hai. Redundant color block layers, device metadata blocks aur background noise clear targets delete karke size drop ki jati hai without altering central face elements boundaries.</p>
      
      <h3>Anti-aliasing optimization models</h3>
      <p>Lossy compressors details eliminate kar dete hain jiske bad photo useless frame build hoti hai. SizeSnap smart interpolation scaling systems layout engine secure preserve properties handle karta hai clear readability metrics ensure karne ke liye.</p>
    `,
    faqs: [
      { question: 'Lossless compression model kaise execute hota hai?', answer: 'Metadata block striping aur target pixel color values adjustments se optimize data process hota hai.' },
      { question: 'Kya high-res camera shot images directly compress honge?', answer: 'Haan, 4K camera quality images under 50KB target parameters safely resize ho sakti hain.' }
    ]
  },
  'compress-image/without-losing-quality': {
    metaTitle: 'Compress Image Online Without Losing Quality | SizeSnap',
    metaDescription: 'Reduce image size in KB without losing quality. Best online image compressor for JPG, PNG, and WEBP. 100% free, private browser-based tool.',
    h1: 'Compress Image Online Without Losing Quality',
    introParagraph: 'Reduce JPG, PNG, and WEBP image file sizes without distorting text or blurry outcomes. Quick local browser logic processing.',
    bodyHtml: `
      <h2>Pixel-Safe Compression Strategy</h2>
      <p>Compress image targets online formats require complex algorithms. Aggressive pixel compression can result in visible blur, artifacting, and loss of critical text information on scanned papers. SizeSnap preserves details by using modern browser graphics processing tools (Canvas scaling and smart quantization), which targets file weight without altering image resolution or legibility.</p>
      
      <h3>Secure local transaction runtime</h3>
      <p>Your documents contain personal information that must not be shared. Processing locally ensures compliance with safety norms. Output file parameters are downloaded instantly into standard formats directly inside the local cache directories.</p>
    `,
    faqs: [
      { question: 'Is client-side compression truly safe?', answer: 'Absolutely. No information is transmitted across network channels, keeping document scans offline.' },
      { question: 'Does it support PNG and JPG together?', answer: 'Yes, our smart compiler processes both input extensions and outputs standard compressed assets.' }
    ]
  },
  'resize-image/reduce-without-blur': {
    metaTitle: 'Reduce Image Size Without Blur Online Free | SizeSnap',
    metaDescription: 'Resizing photos getting blurry? Learn how to compress any image or certificate online without blur or distortion. 100% free tools.',
    h1: 'Reduce Image Size Without Blur Online Free',
    introParagraph: 'Resize controls apply configurations check detail preservation levels without pixel distortion formats. Fast mobile execution.',
    bodyHtml: `
      <h2>Preventing Blur in Low KB Compress Actions</h2>
      <p>Blur occurs when resizing engines stretch pixels awkwardly or scale resolution down without applying interpolation filters. When government systems scan documents, blurry faces or numbers lead to automatic failures. SizeSnap employs bilinear interpolation algorithms to scale down document frames safely and cleanly.</p>
      
      <h3>Smart details preservation layers</h3>
      <p>By retaining sharp edge contrast lines and removing noisy camera background values, files are reduced safely below target limits like 50KB or 100KB while keeping signature ink lines and marksheet numbers perfectly visible.</p>
    `,
    faqs: [
      { question: 'Why do images get blurred on standard sites?', answer: 'Standard resizers use simple pixel drop methods, while we apply advanced graphics rendering scripts.' },
      { question: 'Can I verify legibility before downloading?', answer: 'Yes, a live preview element showcases the compressed output instantly in real time.' }
    ]
  },
  'compress-image/to-50kb': {
    metaTitle: 'Compress Image to 50KB Online Free (High Clarity) | SizeSnap',
    metaDescription: 'Compress JPG, PNG, or WEBP images to 50KB or less online. Fast, secure, and private. Perfect for students and job application forms.',
    h1: 'Compress Image to 50KB Online Free',
    introParagraph: 'Keep documents and profile photos crisp and neat under 50KB limit brackets. Browser optimized smart execution system.',
    bodyHtml: `
      <h2>Image Compression to 50KB</h2>
      <p>Whether you need to submit a digital passport size photo or attach scanned paperwork on a portal, a 50KB file size limit is highly common. Manual compression is complex and takes multiple trials. Our tool automates compression targets, adjusting quality iteratively to hit exactly under 50KB in a fraction of a second.</p>
      
      <h3>Optimized for low-bandwidth networks</h3>
      <p>Compressing assets before sharing saves mobile data packs and loads instantly on remote job portals. Get rapid results without signups or payment gates.</p>
    `,
    faqs: [
      { question: 'How to compress JPG under 50KB?', answer: 'Upload your JPG, and the engine adjusts dynamic coefficients to produce a sub-50KB file instantly.' },
      { question: 'Is there a limit to daily usage?', answer: 'No, you can perform unlimited compressions without any daily paywalls.' }
    ]
  },
  'passport-photo/ssc-exam': {
    metaTitle: 'Image Size for SSC Form Online Free (3.5x4.5 cm) | SizeSnap',
    metaDescription: 'Check official photo dimensions and file size requirements for SSC exam. Resize your passport photo and signature to meet the portal guidelines.',
    h1: 'Image Size and Format for SSC Application Form',
    introParagraph: 'Resizing photo for Staff Selection Commission portals requires strict compliance with 3.5cm x 4.5cm width-height limits and 20KB-50KB file sizes.',
    bodyHtml: `
      <h2>Staff Selection Commission Photo Upload Spec</h2>
      <p>Candidates filling CGL, CHSL, MTS, and GD Constable registration forms frequently face rejection because of incorrect photo settings. The SSC portal system analyzes files automatically. Ensure natural white/light blue backgrounds, front-facing eyes alignment, no spectacles glare, and crisp resolution settings.</p>
      
      <h3>Signature guidelines details</h3>
      <p>Signatures must be scanned clearly at 4.0cm width x 2.0cm height dimensions, and the file size must reside strictly within 10KB to 20KB brackets. Crop and optimize signature files together with your photo on SizeSnap to proceed smoothly.</p>

      <h3>Managing PDF Documents for Document Verification (DV)</h3>
      <p>Later in the recruitment process, SSC document verification requires uploading educational certificates. If you have multiple scanned marksheet files, use our <a href="/merge-pdf-online">Secure PDF Merger</a> to combine them into one file, and our <a href="/pdf-under-500kb">PDF Compressor</a> to keep the final document under the portal size limits.</p>
    `,
    faqs: [
      { question: 'What is the exact photo size for SSC form?', answer: 'The photo must be 3.5 cm in width x 4.5 cm in height, and the file size should be between 20KB and 50KB.' },
      { question: 'Can I upload a selfie or crop a group photo?', answer: 'No, selfies or cropped casual photos are flagged immediately and lead to candidate disqualification.' }
    ]
  },
  'passport-photo/upsc-exam': {
    metaTitle: 'UPSC Form Photo & Signature Size Resizer Online | SizeSnap',
    metaDescription: 'Resize your passport photo and signature for UPSC Civil Services application form (20KB - 300KB). Convert your image to exact specifications instantly.',
    h1: 'Photo and Signature Size for UPSC IAS Exam Form',
    introParagraph: 'Union Public Service Commission (UPSC) Civil Services forms require candidate photos and signatures to match standard aspect ratios and file size specifications (20KB to 300KB).',
    bodyHtml: `
      <h2>UPSC Civil Services Photo and Signature Criteria</h2>
      <p>Unlike other platforms, UPSC requires both the photo and the signature images to have equal aspect ratios. The dimensions of the images must be at least 350 pixels x 350 pixels in width and height, and maximum 1000 pixels x 1000 pixels. The file size range is wide (20KB to 300KB), but strict dimension checks are enforced at registration runtime.</p>
      
      <h3>Getting the Aspect Ratio Right</h3>
      <p>To avoid manual cropping and distorted ratios, SizeSnap formats images to square ratios automatically while maintaining candidate details, ensuring successful uploads on the UPSC One Time Registration (OTR) page.</p>

      <h3>Handling UPSC PDF Documents</h3>
      <p>For uploading detailed scanned documents (like degree certificates and ID proofs), the UPSC portal sets strict PDF file size limits. Use our <a href="/compress-pdf-to-300kb">PDF to 300KB Compressor</a> to ensure your documents meet the upload criteria without becoming blurry.</p>
    `,
    faqs: [
      { question: 'What is the required dimension for UPSC photo upload?', answer: 'Both photo and signature must be square, with dimensions ranging between 350x350 pixels and 1000x1000 pixels.' },
      { question: 'What is the file size limit for UPSC OTR?', answer: 'The uploaded file size must be between 20KB (minimum) and 300KB (maximum) in JPG format.' }
    ]
  },
  'passport-photo/neet-exam': {
    metaTitle: 'NEET Exam Photo Size & Format Resizer Online Free | SizeSnap',
    metaDescription: 'Resize passport photo (10KB-200KB) and postcard size photo (4x6 inch) for NTA NEET application form online. 100% free, private browser-based tool.',
    h1: 'NEET Exam Passport & Postcard Photo Resizer',
    introParagraph: 'National Testing Agency (NTA) NEET UG/PG applications require strict candidate photo formats. Use this tool to fit the exact 10KB to 200KB limit.',
    bodyHtml: `
      <h2>NTA NEET Photo Specifications & Guidelines</h2>
      <p>NEET applications require two types of photos: a passport size photo and a postcard size photo (4" x 6"). Both photos must have a white background, and the candidate's name and date of taking the photo must be printed at the bottom of the passport photo.</p>
      
      <h3>NEET Photo Size Limits</h3>
      <ul>
        <li><strong>Passport Photo Size:</strong> 10 KB to 200 KB (JPEG format)</li>
        <li><strong>Postcard Photo Size (4x6):</strong> 10 KB to 200 KB (JPEG format)</li>
        <li><strong>Background:</strong> Plain white background with 80% face coverage.</li>
      </ul>
    `,
    faqs: [
      { question: 'What is the required size for NEET postcard photo?', answer: 'The postcard photo must be 4 inches by 6 inches in physical dimensions, and the file size must be between 10KB and 200KB in JPG/JPEG format.' },
      { question: 'Should the ears be visible in NEET photo?', answer: 'Yes, both ears must be clearly visible, and the candidate should not be wearing any cap or goggles.' }
    ]
  },
  'passport-photo/jee-main': {
    metaTitle: 'JEE Main Photo Size & Format Resizer Online Free | SizeSnap',
    metaDescription: 'Resize and compress passport photo under 200KB for JEE Main exam registration. Clean white background standard. 100% free online resizer.',
    h1: 'JEE Main Exam Passport Photo Resizer',
    introParagraph: 'Format your passport size image for JEE Main and Advanced exam forms according to official NTA instructions. Fits strictly under 200KB.',
    bodyHtml: `
      <h2>JEE Main Photo Guidelines & Size Requirements</h2>
      <p>NTA JEE Main online forms require passport-size photographs to be clear, recently clicked, and with 80% face coverage. Avoid blurred images or custom backgrounds to ensure your application gets approved instantly.</p>
      
      <h3>JEE Main Image Requirements</h3>
      <ul>
        <li><strong>File Size:</strong> 10 KB to 200 KB</li>
        <li><strong>Format:</strong> JPG/JPEG only</li>
        <li><strong>Background:</strong> Light or white plain background</li>
      </ul>
    `,
    faqs: [
      { question: 'What is the file size for JEE Main photo?', answer: 'The scanned passport photograph file size must be between 10KB and 200KB in JPEG format.' },
      { question: 'Can I upload a black and white photo for JEE Main?', answer: 'Either color or black & white photo with 80% face coverage (without mask) is acceptable.' }
    ]
  },
  'passport-photo/ibps-exam': {
    metaTitle: 'IBPS Exam Photo Size Resizer Online Free | SizeSnap',
    metaDescription: 'Crop and resize passport photo to 20KB-50KB for IBPS Clerk, PO, and RRB banking exams. Meet standard dimensions (4.5 x 3.5 cm) instantly.',
    h1: 'IBPS Exam Passport Photo Resizer',
    introParagraph: 'Ensure your banking exam application is secure. Format your photo to standard IBPS PO/Clerk requirements (20KB to 50KB).',
    bodyHtml: `
      <h2>IBPS Banking Exam Photo Upload Guidelines</h2>
      <p>The Institute of Banking Personnel Selection (IBPS) PO, Clerk, and Specialist Officer forms require precise photo dimensions. Incorrect formatting can lead to application cancellation or delay in admit card generation.</p>
      
      <h3>IBPS Passport Photo Spec</h3>
      <ul>
        <li><strong>Dimensions:</strong> 4.5 cm (height) x 3.5 cm (width) or 200 x 230 pixels</li>
        <li><strong>File Size:</strong> 20 KB to 50 KB</li>
        <li><strong>Format:</strong> JPG/JPEG format</li>
      </ul>
    `,
    faqs: [
      { question: 'What is the photo size for IBPS Clerk and PO?', answer: 'The photo must have dimensions of 200 x 230 pixels and a file size between 20KB and 50KB in JPG format.' },
      { question: 'Can I use a signature in capital letters for IBPS?', answer: 'No, signatures in capital letters are not accepted by IBPS and will lead to rejection.' }
    ]
  },
  'signature-resize/neet-signature': {
    metaTitle: 'Resize Signature for NEET Exam Online Free (4-30KB) | SizeSnap',
    metaDescription: 'Compress and resize scanned signature image between 4KB and 30KB for NTA NEET application form. White background, black ink standard.',
    h1: 'NEET Exam Signature Resizer',
    introParagraph: 'Scale your signature image perfectly for NEET application guidelines. Keeps text sharp and readable between 4KB and 30KB.',
    bodyHtml: `
      <h2>NEET Scanned Signature Requirements</h2>
      <p>NEET guidelines require signature uploads to be extremely clear and legible. Use a black ink pen on white paper to make the scan, and compress it using our browser resizer to avoid errors.</p>
    `,
    faqs: [
      { question: 'What is the signature file size limit for NEET?', answer: 'The scanned signature file size must be between 4KB and 30KB in JPG/JPEG format.' }
    ]
  },
  'signature-resize/jee-signature': {
    metaTitle: 'Resize Signature for JEE Main Exam Online Free (4-30KB) | SizeSnap',
    metaDescription: 'Compress and resize scanned signature image between 4KB and 30KB for NTA JEE Main application form. 100% free and secure.',
    h1: 'JEE Main Exam Signature Resizer',
    introParagraph: 'Scale your signature image perfectly for JEE Main registration guidelines. Keeps text sharp and readable between 4KB and 30KB.',
    bodyHtml: `
      <h2>JEE Main Scanned Signature Requirements</h2>
      <p>JEE Main registration portal checks signature uploads strictly. Ensure you sign with a black pen on a plain white paper, and use our resizer to keep it under 30KB without making it blurry.</p>
    `,
    faqs: [
      { question: 'What is the signature file size limit for JEE Main?', answer: 'The scanned signature file size must be between 4KB and 30KB in JPG/JPEG format.' }
    ]
  },
  'signature-resize/ibps-signature': {
    metaTitle: 'Resize Signature for IBPS PO & Clerk 2026 | 10KB-20KB Free',
    metaDescription: 'Resize signature scan for IBPS PO & Clerk 2026 application form online. Format under 10KB-20KB and 140x60px limit. Black ink compliance optimizer.',
    h1: 'IBPS PO & Clerk 2026 Signature Resizer',
    introParagraph: 'IBPS PO and Clerk notification strictly demands scanned signatures to be between 10KB and 20KB in JPEG format, signed in black ink. Format yours instantly.',
    bodyHtml: `
      <h2>IBPS PO & Clerk Signature Upload Rules</h2>
      <p>Bank exams like IBPS PO, Clerk, and Specialist Officer require precise signature scanning to verify candidate identity. Double check that you do not sign in CAPITAL letters, as this will lead to rejection.</p>
      <h3>Ink Color and Format Details</h3>
      <p>Sign strictly with a black ink pen on white paper. If you signed in blue pen, use our <strong>Ink Optimizer</strong> on the crop page to shift it to compliance black ink dynamically inside your browser.</p>
    `,
    faqs: [
      { question: 'Is blue ink allowed for IBPS signature?', answer: 'No, IBPS strictly rejects blue ink signatures. Sign with black ink or use our optimizer to convert blue to black ink.' },
      { question: 'What is the signature aspect ratio for IBPS PO?', answer: 'The recommended pixel size is 140 x 60 pixels, and file size must be between 10KB and 20KB.' }
    ]
  },
  'resize-image/to-11kb': {
    metaTitle: '11KB Converter Online Free (No Quality Loss) | SizeSnap',
    metaDescription: 'Need to resize photo or signature to 11KB? Use our free online 11KB converter to compress JPG, PNG files under 11KB instantly. 100% private.',
    h1: '11KB Image Converter & Resizer Online Free',
    introParagraph: 'Kya aapko passport photo ya scanned signature ka size exactly 11KB ke niche compress karna hai? SizeSnap ka 11KB resizer tool quality loss ke bina file resolution optimize karta hai.',
    bodyHtml: `
      <h2>Image aur Signature Ko 11KB Kaise Karein? (Problem & Solution)</h2>
      <p>Kai online application forms aur government portal registrations me file size validation check bohot strict hota hai. Example ke liye, candidates ko signature upload ya small passport size photos ko exactly 10KB se 20KB (jaise maximum 11KB ya 12KB) ke brackets me compress karna padta hai. Standard image editors me convert karte waqt files blurry ho jati hain aur portal compile check reject kar deta hai.</p>
      
      <p>SizeSnap ka dynamic resizer algorithm is problem ko instantly solve karta hai. Aapko simple photo upload karni hai, tool local execution block me parameters apply karke file scale coordinate lock kar dega aur instant click me file ready ho jayegi. <strong>Upload your file and fix instantly</strong>.</p>
      
      <h2>Why 11KB Limit is Required for Government Exams?</h2>
      <p>NTA (NEET/JEE), SSC, Banking (IBPS), aur State level board portals apne application systems me database management aur server processing speeds optimized rakhne ke liye file sizes ko extremely chota (under 11KB or 20KB) rakhte hain. Quality compression rules follow karna candidate candidature valid rakhne ke liye mandatory hota hai.</p>
      
      <h2>100% Safe & Private Client-Side Resizer (Privacy First)</h2>
      <p>Aapki safety humari priority hai. SizeSnap completely client-side processing model use karta hai. Iska matlab hai ki aapke document scans aur personal passport size pictures hamare backend servers par bilkul transfer nahi hoti hain. Processing directly browser local memory cache runtime me execute hoti hai, jo highly safe aur lightning-fast download response pradan karti hai.</p>

      <h2>Related Resizer & Compression Tools</h2>
      <p>Agar aapko isse different file size options chahiye, to aap humare baaki custom image converters aur tools ko bhi use kar sakte hain. For instance, check out the <a href="/resize-image-to-20kb">20KB Image Resizer</a>, download the optimized template for <a href="/image-size-for-ssc-form">SSC Exam Form Photo specifications</a>, or explore the <a href="/resize-image-to-50kb">50KB Photo Compressor</a> tool for larger document files.</p>
    `,
    faqs: [
      { question: 'Kya 11KB me compress karne par signatures blurry ho jate hain?', answer: 'Nahi, humara tool smart interpolation scaling algorithms use karta hai jo border elements aur text line values preserve rakhkar file compress karte hain.' },
      { question: 'Kya ye resizer 100% free hai use karne ke liye?', answer: 'Yes, SizeSnap entirely free tools structure par design hai. Koi hidden paywalls, signup requirements, ya watermark restrictions nahi hain.' },
      { question: 'Mobile phone camera photos ko 11KB kaise banayein?', answer: 'Aap directly apne Android ya iPhone browser me sizesnap.in/11kb-converter open karke document select karein, system direct download block ready kar dega.' }
    ]
  },
  'passport-photo/indian-passport': {
    metaTitle: 'Passport Size Photo Maker Online Free (3.5 x 4.5 cm) | SizeSnap',
    metaDescription: 'Create passport size photo online for free. Crop, resize, and convert your photos to exact 3.5 x 4.5 cm dimensions for Indian passport & job portals.',
    h1: 'Passport Size Photo Maker Online Free',
    introParagraph: 'Kya aapko online registration ya passport application ke liye perfect passport size photo banani hai? Hamare free passport size photo maker tool se aap image crop aur scale kar sakte hain.',
    bodyHtml: `
      <h2>Passport Size Photo Maker Kaise Use Karein? (Step-by-Step Guide)</h2>
      <p>Mobile phone se normal camera click karne par photo ke background me uninvited objects ya fir incorrect dimensions (jaise width aur height ka anupat) ki problem aati hai. Kisi bhi exam form (SSC, UPSC, IBPS) ya official passport application portal par incorrect size upload karne se validation failed error aa jata hai. Standard passport size photo maker online options use karte waqt aapki privacy unsafe rehti hai.</p>
      
      <p>SizeSnap is issue ko smart local resolution controls se solve karta hai. Aapko simple photo upload karni hai, standard <strong>3.5 x 4.5 cm (35x45 mm)</strong> aspect ratio lock criteria match karna hai aur system coordinates set karke automatically crop block generate kar dega. <strong>Upload your file and fix instantly</strong>.</p>
      
      <h2>Why Correct Dimensions are Crucial for Official Portals?</h2>
      <p>Chahe woh Staff Selection Commission (SSC) ho, state levels ke public service commissions (BPSC, UPPSC, etc.), bank jobs (IBPS) ya visa formats ho, candidates ko exact dimension guidelines rules follow karne padte hain. Incorrect dimensions ya file size (jaise 20KB-50KB limit) hone par portals form verification check ke dauran candidate images reject kar dete hain. Hamara tool size aur dimensions dono ko ek sath perfect banata hai.</p>
      
      <h2>What are the Standard Passport Size Photo Dimensions in India?</h2>
      <p>India me standard passport size photo ki dimensions <strong>3.5 cm width aur 4.5 cm height</strong> hoti hai (35mm x 45mm). Agar pixels me baat karein (300 DPI par), toh yeh lagbhag <strong>413 x 531 pixels</strong> hota hai. SizeSnap in dimensions ko default set karke rakhta hai taaki aapse koi galti na ho.</p>

      <h2>100% Secure & Local Browser Processing (Privacy First)</h2>
      <p>SizeSnap user safety guidelines strictly observe karta hai. Kisi bhi security violation ya server tracking details se bachne ke liye, data operations sandboxed javascript layers me host hote hain. Processing purely client browser execution me run hoti hai bina cloud nodes use kiye. Aapki photo kabhi hamare server par upload nahi hoti.</p>

      <h2>Related Document & Photo Resizing Tools</h2>
      <p>Passport size photo frame convert karne ke sath-sath aap dusre formats aur size presets check kar sakte hain. Signature resize ke liye <a href="/resize-signature-for-ssc">SSC Signature Resizer</a> check karein, ya low weight conversion limits ke liye <a href="/11kb-converter">11KB Converter</a> use karein, aur documents compress karne ke liye <a href="/resize-image-to-100kb">100KB Document Resizer</a> explore karein.</p>
    `,
    faqs: [
      { question: 'Passport size photo ki standard dimensions kya hoti hain?', answer: 'India aur kai official boards me passport photo ki standard physical dimensions 3.5 cm (width) x 4.5 cm (height) hoti hai, jisse digital format pixels me width 413px aur height 531px banti hai.' },
      { question: 'Ghar par mobile se passport size photo kaise banayein?', answer: 'Aap apne mobile camera se ek plain light background (jaise white deewar) ke aage photo click karein. Phir use SizeSnap.in/passport-size-photo-maker par upload karein. Tool automatically usko 3.5x4.5 cm aur sahi file size me crop aur compress kar dega.' },
      { question: 'Kya yeh tool photo ka size 20KB-50KB tak kam kar sakta hai?', answer: 'Haan! Humara tool dimensions (35x45mm) theek karne ke sath-sath aapki file ka size automatically form guidelines (jaise 20KB se 50KB) ke andar compress kar deta hai.' },
      { question: 'Kya background edit ya size change safe hai?', answer: 'Haan, standard rules ke anusaar local processing tool use karke output build karna security standpoint se extremely safe aur secure hai kyuki data aapke browser me hi rehta hai.' },
      { question: 'Mobile screen par passport size photo kaise banayein?', answer: 'SizeSnap.in/passport-size-photo-maker link open karein, file browse karke crop coordinate confirm karein, instant download options ready ho jayenge.' }
    ]
  },
  'compress-pdf/to-500kb': {
    metaTitle: 'Compress PDF to 500KB Online Free (Without Quality Loss) | SizeSnap',
    metaDescription: 'Need to reduce PDF size under 500KB? Use our free online PDF compressor to compress and shrink PDF under 500KB instantly. Safe, private & fast.',
    h1: 'Compress PDF Under 500KB Online Free',
    introParagraph: 'Kya aapko apni marksheet, resume ya scanned certificates PDF ka size exactly 500KB ke niche compress karna hai? SizeSnap ka offline browser resizer bina quality down kiye PDF reduce karta hai.',
    bodyHtml: `
      <h2>PDF Size Under 500KB Kaise Compress Karein? (Problem & Solution)</h2>
      <p>Multi-page scanned documents, marksheets, ya project reports normal scanning applications me 5MB se 15MB tak ke heavy files ban jate hain. Lekin jab aap online job portals, university admissions ya standard government exam forms bhar rahe hote hain, to limit strictly maximum 500KB PDF tak set hoti hai. Standard PDF tools online upload compression rules use karte waqt sensitive documents leak hone ka risk rehta hai.</p>
      
      <p>Hamara tool is process ko completely automate aur secure banata hai. Aapko simple multi-page PDF select karni hai, algorithm optimization matrix coordinates resolve karke quality control balances dynamic adjust kar dega aur single click output deliver karega. <strong>Upload your file and fix instantly</strong>.</p>
      
      <h2>Why 500KB Limit is Crucial for Online Job & Admission Forms?</h2>
      <p>Portals jaise UPSC, SSC, Banking notifications, aur various universities database server loading load control rakhne ke liye digital attachment limits maximum 500KB file sizes specify karte hain. Characters readability verify karna document verification round complete karne ke liye must hai.</p>
      
      <h2>100% Safe Client-Side PDF Compression (No Server Uploads)</h2>
      <p>SizeSnap security values preserve karta hai. PDF compression completely client browser memory parameters ke under perform hota hai. Iska matlab hai aapka official marksheet, ID card ya degree files backend network channels par transmit nahi hota, jo pure document workflow safety metrics meet karta hai.</p>

      <h2>Related PDF & Document Resizing Tools</h2>
      <p>Agar aapko image optimization aur forms sizes dynamic adjust karne hain, to hamare baaki dynamic presets check karein. Passport size images ke liye <a href="/passport-size-photo-maker">Passport Size Photo Maker</a> open karein, signature targets optimize karne ke liye <a href="/11kb-converter">11KB Converter</a> use karein, ya scanned files scale karne ke liye <a href="/resize-image-to-100kb">100KB Document Resizer</a> explore karein.</p>
    `,
    faqs: [
      { question: 'Kya PDF under 500KB compress karne par marksheet text blurry ho jayega?', answer: 'Nahi, humara tool smart vector text optimization use karta hai jo layout structure ko preserve rakhta hai, is wajah se scanned text blocks clearly readable rehte hain.' },
      { question: 'PDF size exactly 500KB ya usse kam kaise karein?', answer: 'Aap directly document select karein, and humara system optimal scale algorithms apply karke file automatically 500KB boundary limits ke anusaar reduce kar dega.' },
      { question: 'Kya mere multiple pages wali PDF file 500KB limit me crop/compress ho jayegi?', answer: 'Yes, multi-page PDFs standard formatting guidelines me resolve ho jati hain bina visual layers loss ke.' }
    ]
  },
  'compress-pdf/to-200kb': {
    metaTitle: 'Compress PDF to 200KB Online Free (Preserve Clarity) | SizeSnap',
    metaDescription: 'Compress PDF to 200KB online for free. Ideal for state post-matric scholarships and university form uploads. Secure & private local browser compression.',
    h1: 'Compress PDF to 200KB Online Free',
    introParagraph: 'Kya aapko state board ya scholarship portals ke liye PDF file size ko 200KB ke niche lock karna hai? SizeSnap local engine background adjustments ke sath visual quality maintain rakhta hai.',
    bodyHtml: `
      <h2>PDF Size to 200KB Kaise Compress Karein?</h2>
      <p>Scholarship portals (jaise UP Scholarship, MahaDBT, NSP) par certificates upload limit strictly 200KB hoti hai. SizeSnap is application limit ko resolve karta hai bina text details lose kiye. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'Kya marksheet upload standard pass ho jayega?', answer: 'Haan, standard scanning guidelines parameters ko check satisfy karke high quality output generate hota hai.' }
    ]
  },
  'compress-pdf/to-300kb': {
    metaTitle: 'Compress PDF to 300KB Online Free (Without Quality Loss) | SizeSnap',
    metaDescription: 'Reduce PDF size under 300KB online. Perfect for UPSC registration, legal documents, and official portal attachments. 100% private & fast.',
    h1: 'Compress PDF to 300KB Online Free',
    introParagraph: 'UPSC CSE, CDS, NDA portals ya formal documentation portals par multi-page PDF documents strictly under 300KB upload rules follow karte hain. Hum locally size adjust karte hain.',
    bodyHtml: `
      <h2>UPSC Registration PDF size limit check (under 300KB)</h2>
      <p>Candidates official IAS application check portal errors se bachne ke liye standard under 300KB rules parameters confirm parameters set karein. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'UPSC portals check specifications kya hain?', answer: 'Scanned doc PDF format range 20KB se 300KB ke bich valid parameters check satisfy karti hai.' }
    ]
  },
  'compress-pdf/to-150kb': {
    metaTitle: 'Compress PDF to 150KB Online Free (High Quality) | SizeSnap',
    metaDescription: 'Shrink your PDF file under 150KB online. Fast, secure, and preserves documents readability for scholarship applications.',
    h1: 'Compress PDF to 150KB Online Free',
    introParagraph: 'Kuch portal requirements strictly maximum 150KB limit verify karti hain. SizeSnap detailed text values ko blurry hone se bacha kar size compress karta hai.',
    bodyHtml: `
      <h2>PDF Size under 150KB optimize guidelines</h2>
      <p>State scholarship databases parameters requirements small documents constraints demands handle karte hain. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'Kya 150KB output clear open hoga?', answer: 'Haan, dynamic compiler configuration vector properties lock rakhti hai.' }
    ]
  },
  'compress-pdf/custom-size': {
    h1: 'Compress PDF to Custom Size (Enter Any KB)',
    metaTitle: 'Compress PDF to Custom Target Size (KB/MB) Online | SizeSnap',
    metaDescription: 'Need a very specific PDF file limit? Enter your required size (like 37KB or 1.5MB) and our tool will compress your PDF exactly to that target.',
    introParagraph: 'Use this smart custom compressor to shrink your PDF files to an exact file size limit (KB). Just enter the maximum allowed size for your upload portal, and we will do the rest without losing text clarity.',
    faqs: [
      {
        question: 'How do I compress a PDF to an exact custom size?',
        answer: 'Upload your PDF, select the "Compress to Target Size" mode, type in your exact KB requirement (e.g., 37KB), and the tool will automatically adjust the compression ratio to meet your limit.'
      }
    ]
  },
  'compress-pdf/to-12kb': {
    metaTitle: 'Compress PDF to 12KB Online Free (High Quality) | SizeSnap',
    metaDescription: 'Need to compress your PDF under 12KB? Shrink your PDF file size to exactly 12KB online free. Keep your signature and documents readable for exam portals.',
    h1: 'Compress PDF to 12KB Online Free',
    introParagraph: 'Many exam and government portals require very strict PDF sizes, often under 12KB. SizeSnap allows you to compress your PDF down to exactly 12KB locally in your browser.',
    bodyHtml: `
      <h2>How to Reduce PDF Size Under 12KB</h2>
      <p>Shrinking a PDF document to a tiny size like 12KB is extremely difficult using normal tools without making the text illegible. SizeSnap applies targeted compression vectors to bring your file under the strict 12KB boundary while maintaining essential readability.</p>
    `,
    faqs: [
      { question: 'Will my 12KB PDF still be readable?', answer: 'Yes, our smart compiler targets metadata and redundant layers to keep the actual text layout as clear as possible even at 12KB.' }
    ]
  },
  'compress-pdf/to-15kb': {
    metaTitle: 'Compress PDF to 15KB Online Free (Best for Forms) | SizeSnap',
    metaDescription: 'Instantly reduce and compress your PDF file to 15KB online free. Ideal for online form submissions, scholarship portals, and signature documents.',
    h1: 'Compress PDF to 15KB Online Free',
    introParagraph: 'Format your PDF files strictly under 15KB for online application portals. Our client-side compressor hits the 15KB limit instantly without uploading your files.',
    bodyHtml: `
      <h2>PDF Size Under 15KB Compression Guidelines</h2>
      <p>Certain specific portal fields, like scanned signatures in PDF format or thumb impressions, require a maximum size of 15KB. Upload your document and our resizer will safely compress it under 15KB using your browser\'s local processing power.</p>
    `,
    faqs: [
      { question: 'Is my document safe during compression?', answer: 'Absolutely. The 15KB compression happens entirely on your device, ensuring zero data leakage.' }
    ]
  },
  'compress-pdf/to-1mb': {
    metaTitle: 'Compress PDF to 1MB Online Free (Without Quality Loss) | SizeSnap',
    metaDescription: 'Need to reduce PDF size under 1MB? Try our free online PDF compressor to shrink heavy eBooks and portfolios under 1MB instantly. 100% secure.',
    h1: 'Compress PDF to 1MB Online Free',
    introParagraph: 'Email attachments or university portals jaise Delhi University (DU) ya IGNOU registrations me 1MB size threshold normal specification rules hai. Reduce files cleanly.',
    bodyHtml: `
      <h2>PDF File under 1MB Size Guidelines</h2>
      <p>Heavy academic portfolios ya project submissions limits 1MB max target check criteria apply. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'Email attachment check rules kya hain?', answer: 'Normally Gmail 25MB load accepts karta hai but web structures fast load optimization limits 1MB suggest karte hain.' }
    ]
  },
  'passport-photo/up-police-photo': {
    metaTitle: 'UP Police Photo Resizer Online Free | 3.5 x 4.5 cm | SizeSnap',
    metaDescription: 'Resize passport photo under 50KB for UP Police Constable & SI recruitment portal. Crop and scale to 3.5x4.5 cm instantly. 100% private.',
    h1: 'UP Police Exam Photo Resizer',
    introParagraph: 'Uttar Pradesh Police Recruitment Board (UPPRPB) SI aur Constable forms me candidates ko exact dimensions (3.5x4.5 cm) aur exact size (under 50KB) ki photo upload karni hoti hai.',
    bodyHtml: `
      <h2>UP Police Photo crop dimensions requirements</h2>
      <p>Form submission cancellation guidelines avoid karne ke liye correct face lighting configurations and borders alignment check use karein. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'UP Police form requirements metrics kya hain?', answer: 'Correct values represent photo rules setup strictly 20KB to 50KB parameters check criteria.' }
    ]
  },
  'passport-photo/bpsc-exam-photo': {
    metaTitle: 'BPSC Photo Resizer Online Free | Bihar PSC Form | SizeSnap',
    metaDescription: 'Resize passport photo under 100KB for Bihar BPSC Civil Services exam portal online. Format and crop image to correct dimensions free.',
    h1: 'BPSC Exam Photo Resizer',
    introParagraph: 'BPSC Bihar PSC civil service recruitment forms fill up karte waqt passport photo crop dimensions aur under 100KB file target guidelines follow karein.',
    bodyHtml: `
      <h2>BPSC Exam Registration photo upload guidelines</h2>
      <p>Candidate photos background check constraints validation resolve parameters setups standard levels ensure dynamics. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'What is BPSC image boundary range?', answer: 'Usually size threshold constraints under 50KB to 100KB parameters JPG formats are valid.' }
    ]
  },
  'passport-photo/mppsc-exam-photo': {
    metaTitle: 'MPPSC Photo Resizer Online Free | MP PSC Form | SizeSnap',
    metaDescription: 'Format your passport size photo under 100KB for MPPSC exam application. Fast, free, and secure browser-based cropping tool.',
    h1: 'MPPSC Exam Photo Resizer',
    introParagraph: 'Madhya Pradesh Public Service Commission (MPPSC) guidelines standard resolution limits set karti hain. MPPSC form parameters check locks standard guidelines configurations.',
    bodyHtml: `
      <h2>MPPSC PSC registration passport image size adjustments</h2>
      <p>Scan photo copy aspect ratio coordinates check parameters apply limits features cleanly. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'MP PSC image constraints rule check standard?', answer: 'JPG format dimensions size max limit 100KB is applicable.' }
    ]
  },
  'passport-photo/gate-exam': {
    metaTitle: 'GATE Exam Photo Resize Online Free | IIT GATE Form | SizeSnap',
    metaDescription: 'Resize and crop passport photo to 3.5x4.5 cm for IIT GATE exam online. Keep file size under 100KB with clean white background.',
    h1: 'GATE Exam Photo Resizer',
    introParagraph: 'GATE IIT registration guidelines candidates ke passport images verification checks pass karne ke liye exact rules define karti hain.',
    bodyHtml: `
      <h2>GATE IIT Application Passport photo sizing instructions</h2>
      <p>GATE online portal automatic filters face scan verify checks operate coordinates setup formats ensure correct parameters details. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'GATE photo check bounds metrics details?', answer: 'Width 3.5cm x height 4.5cm plain white background is strictly valid.' }
    ]
  },
  'passport-photo/delhi-police-photo': {
    metaTitle: 'Delhi Police Photo Resizer Online Free | SizeSnap',
    metaDescription: 'Format your passport size photo under 50KB for Delhi Police Constable & SI recruitment forms via SSC. Crop and resize photo instantly.',
    h1: 'Delhi Police Exam Photo Resizer',
    introParagraph: 'Delhi Police recruitment requirements strictly SSC portal pattern follow karti hain, jisme photo maximum 50KB aur signature limit under 20KB valid hai.',
    bodyHtml: `
      <h2>Delhi Police SI and Constable Photo format parameters</h2>
      <p>Candidate files should meet standard configurations metrics to clear automation rules constraints validation parameters. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'Delhi Police SSC form rules standard dimensions?', answer: '3.5 x 4.5 cm digital resolution ranges 20KB to 50KB limits is correct.' }
    ]
  },
  'passport-photo/pan-card': {
    metaTitle: 'PAN Card Photo Resizer Online Free | 213x213 px | SizeSnap',
    metaDescription: 'Resize and crop photo for NSDL PAN Card online free. Convert image to exact 213 x 213 pixels and under 30KB instantly.',
    h1: 'PAN Card Photo Resizer (213 x 213 px)',
    introParagraph: 'NSDL ya UTIITSL PAN card registration systems me photo configuration parameters strictly 213 x 213 pixels aur size limit under 30KB require karte hain.',
    bodyHtml: `
      <h2>PAN Card Photo resizer specifications online</h2>
      <p>UTIITSL NSDL parameters check metrics check standard sizes ranges details ensure. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'PAN card image pixels parameters dimensions?', answer: '213 x 213 pixels with resolution settings 300 DPI index.' }
    ]
  },
  'signature-resize/ssc-signature': {
    metaTitle: 'Resize Signature for SSC Exam Online Free (10-20KB) | SizeSnap',
    metaDescription: 'Compress signature scan to exactly 10KB-20KB and 4x2 cm for Staff Selection Commission online. Keep signature lines sharp and clear.',
    h1: 'SSC Exam Signature Resizer',
    introParagraph: 'SSC CGL/CHSL forms filling guidelines me scanned signature strictly 10KB se 20KB ke bich demand kiya jata hai.',
    bodyHtml: `
      <h2>SSC Scanned signature upload guidelines checks</h2>
      <p>Avoid signature blur rejections by locking parameters rules under exact boundaries limits setup. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'SSC sign limits range rules?', answer: 'Scanned signature image constraints should be between 10KB to 20KB only.' }
    ]
  },
  'signature-resize/upsc-signature': {
    metaTitle: 'Resize Signature for UPSC Exam Online Free (20-300KB) | SizeSnap',
    metaDescription: 'Format your signature scan for UPSC IAS registration. Keep file size between 20KB and 300KB and verify text lines legibility instantly.',
    h1: 'UPSC Exam Signature Resizer',
    introParagraph: 'UPSC OTR (One Time Registration) verification check signatures legibility ensure karta hai, scale should be strictly between 20KB to 300KB.',
    bodyHtml: `
      <h2>UPSC Civil Services scan signatures specifications check</h2>
      <p>Square fit ratios custom settings guidelines parameters to prevent registration process rejections. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'UPSC signature dimensions boundaries?', answer: 'Both width and height scale metrics range under min 350x350 pixels limits.' }
    ]
  },
  'signature-resize/pan-card-signature': {
    metaTitle: 'Resize Signature for PAN Card Online Free (Under 10KB) | SizeSnap',
    metaDescription: 'Compress signature scan under 10KB for NSDL/UTI PAN card. Exact dimensions 400x200px equivalent. Keep background clean white.',
    h1: 'PAN Card Signature Resizer',
    introParagraph: 'PAN card applicants signature scale check pass karne ke liye exact under 10KB file target locks ensure karein.',
    bodyHtml: `
      <h2>PAN Card signature size limits resizer tool</h2>
      <p>NSDL portal strict verification scans demand file limit parameters details. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'NSDL PAN sign constraints limits settings?', answer: 'Size must keep under 10KB with clear blue/black signature visibility.' }
    ]
  },
  'resize-image/to-30kb': {
    metaTitle: 'Resize Image to 30KB Online Free (Without Quality Loss) | SizeSnap',
    metaDescription: 'Need to resize photo or signature to 30KB? Compress JPG, PNG images under 30KB online instantly. 100% free, private browser-based tool.',
    h1: 'Resize Image to 30KB Online Free',
    introParagraph: 'Kuch selective recruitment websites (jaise Agniveer, Indian Navy/Airforce) photo size strictly under 30KB limits me upload karate hain.',
    bodyHtml: `
      <h2>Agniveer Recruitment photo signature under 30KB resize guide</h2>
      <p>Defence exam portals require highly optimized candidate details files under strict limits. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'Agniveer exams rules metrics parameters?', answer: 'Scans images files targets boundary checks require size under 30KB.' }
    ]
  },
  'resize-image/to-15kb': {
    metaTitle: 'Resize Image to 15KB Online Free (Preserve Quality) | SizeSnap',
    metaDescription: 'Resize and shrink signature scan under 15KB. Best tool to compress JPG, PNG files to exactly 15KB or less. 100% private.',
    h1: 'Resize Image to 15KB Online Free',
    introParagraph: 'Kya aapka scanned signature target size bounds me adjust nahi ho raha? Sizesnap signature limit exactly 15KB me compress karta hai.',
    bodyHtml: `
      <h2>Scanned signatures limit adjustments to 15KB online</h2>
      <p>Smart resizing limits background parameters ensures file matches validation limits parameters checks. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'Kya signature clarity maintain rahegi?', answer: 'Haan, pixel quality lock ensures crisp ink outlines indicators.' }
    ]
  },
  'whatsapp-dp/no-crop': {
    metaTitle: 'WhatsApp DP Maker Without Cropping Online Free | SizeSnap',
    metaDescription: 'Make full profile picture for WhatsApp without cropping. Add blur or white background layout margins to rectangular photos instantly.',
    h1: 'WhatsApp DP Maker Without Cropping',
    introParagraph: 'Apne rectangular standard photos ko bina kisi crop settings ke WhatsApp DP ya profile image banayein. SizeSnap add background blur dynamically.',
    bodyHtml: `
      <h2>Full size DP makers tools options online</h2>
      <p>Avoid losing photo edges on social media profiles. Our resizer converts your normal rectangle photo frames into perfect squares. <strong>Upload your file and fix instantly</strong>.</p>
    `,
    faqs: [
      { question: 'Does WhatsApp DP require square frames?', answer: 'Yes, social profile updates normal aspects ratio scale standard square format constraints.' }
    ]
  },
  'passport-photo/rrb-ntpc': {
    metaTitle: 'Railway RRB NTPC Photo Size Resizer Online Free | 35x45 mm',
    metaDescription: 'Resize your passport photo for Railway RRB NTPC, ALP, and Group D application forms online. Free tool to crop photo to 20KB-50KB with white background.',
    h1: 'Railway RRB NTPC & Group D Photo Resizer',
    introParagraph: 'Railway Recruitment Board (RRB) NTPC, ALP, aur Group D recruitment forms ki guidelines ke anusaar passport photo format karein (3.5x4.5cm, 20-50KB).',
    bodyHtml: `
      <h2>Railway RRB Application Photo Guidelines</h2>
      <p>RRB NTPC, ALP, aur Technician forms me photo upload rules strictly follow karne hote hain. Candidates ko light color ya plain white background ke sath clean passport photo upload karni hoti hai. File size 20KB se 50KB ke beech honi chahiye. Goggles ya caps wear ki hui photo reject ho jayegi.</p>
      <h3>Browser-side Resize aur Full Security</h3>
      <p>SizeSnap par compression local device me hota hai, isliye aapke scanned documents bilkul safe hain. 1-click me RRB-compliant photo generate ho kar ready ho jayegi.</p>
    `,
    faqs: [
      { question: 'What is the photo size limit for RRB NTPC form?', answer: 'The passport size photo must be between 20KB to 50KB in JPEG format.' }
    ]
  },
  'passport-photo/ssc-gd': {
    metaTitle: 'SSC GD Constable Photo Resizer Online Free | SizeSnap',
    metaDescription: 'Resize and crop passport photo for SSC GD Constable application portal. Under 20KB-50KB standard limit, white background.',
    h1: 'SSC GD Constable Photo Resizer',
    introParagraph: 'Ensure your GD Constable application form isn\'t rejected. Crop and compress your passport photo under 50KB automatically in your browser.',
    bodyHtml: `
      <h2>SSC GD Constable Photo Dimensions and Specifications</h2>
      <p>Staff Selection Commission (SSC) GD Constable application requires candidate passport size photo (3.5 cm width x 4.5 cm height) within 20KB to 50KB limit. Ensure the photograph is clear, not blurred, and ears are visible. Our tool locks correct dimension ratios automatically.</p>
      <h3>Direct local processing</h3>
      <p>Your photos are not uploaded to our servers, protecting your privacy during browser-side local image processing.</p>
    `,
    faqs: [
      { question: 'What is the required image size for SSC GD form?', answer: 'Passport photo must be 20KB to 50KB and signature must be 10KB to 20KB in size.' }
    ]
  },
  'passport-photo/upsssc-pet': {
    metaTitle: 'UPSSSC PET Photo Resizer Online Free (20KB-50KB) | SizeSnap',
    metaDescription: 'Resize and format passport photo for UPSSSC PET recruitment portal online. Fits under 50KB limit automatically in 3.5x4.5cm.',
    h1: 'UPSSSC PET Photo Resizer',
    introParagraph: 'Format your photo perfectly for the UPSSSC Preliminary Eligibility Test (PET) application form. Adjust to exactly 20-50KB.',
    bodyHtml: `
      <h2>UPSSSC PET Exam Form Photo Requirements</h2>
      <p>Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) PET notification requests passport photographs with white or light gray background. The file size limit is 50KB. Use this utility to adjust resolution to 3.5x4.5cm instantly.</p>
    `,
    faqs: [
      { question: 'What is the maximum limit for UPSSSC PET photo?', answer: 'The photo file size must not exceed 50KB and must be in JPEG/JPG format.' }
    ]
  },
  'signature-resize/rrb-signature': {
    metaTitle: 'Resize Signature for Railway RRB NTPC Exam (10-20KB) | SizeSnap',
    metaDescription: 'Resize and compress your signature scan under 20KB for Railway RRB NTPC, Group D, and ALP online. Meets standard 10KB to 20KB limit.',
    h1: 'RRB NTPC Signature Resizer',
    introParagraph: 'Crop and compress your scanned signature to exactly 10KB-20KB for the Railway RRB exam application.',
    bodyHtml: `
      <h2>Railway RRB Signature Scanning Guidelines</h2>
      <p>Signatures on Railway recruitment forms must be done on clean white paper with a black pen and scanned clearly. The scanned file size must be between 10KB and 20KB. Do not use blue ink as it might get flagged by the system.</p>
    `,
    faqs: [
      { question: 'What is the limit for RRB signature upload?', answer: 'The signature file size must be strictly between 10KB and 20KB in JPEG format.' }
    ]
  },
  'signature-resize/ssc-gd-signature': {
    metaTitle: 'Resize Signature for SSC GD Constable Exam Online | SizeSnap',
    metaDescription: 'Resize signature scan for SSC GD Constable registration form. 10KB-20KB standard limit with correct aspects ratio.',
    h1: 'SSC GD Constable Signature Resizer',
    introParagraph: 'Ensure your signature image meets the official 10KB to 20KB guidelines for the SSC portal.',
    bodyHtml: `
      <h2>SSC GD Signature Guidelines</h2>
      <p>For SSC GD Constable applications, signatures must be clear and within 10KB to 20KB. Keep your camera focused on the signature to avoid black shadows.</p>
    `,
    faqs: [
      { question: 'Is blue ink allowed in SSC GD signature?', answer: 'Black or blue ink on clean white paper is accepted, but black is highly recommended for readability.' }
    ]
  },
  'signature-resize/upsssc-signature': {
    metaTitle: 'Resize Signature for UPSSSC PET Form Online Free | SizeSnap',
    metaDescription: 'Resize signature scan for UPSSSC PET application portal. Fits under 20KB limit with white background.',
    h1: 'UPSSSC PET Signature Resizer',
    introParagraph: 'Format your scanned signature perfectly for the UPSSSC PET application form.',
    bodyHtml: `
      <h2>UPSSSC PET Signature Guidelines</h2>
      <p>The signature must be under 20KB and should have the candidate\'s signature with their full name written underneath in Hindi. Use this tool to crop and compress it easily.</p>
    `,
    faqs: [
      { question: 'What is the signature size for UPSSSC PET?', answer: 'The scanned signature file size must be under 20KB.' }
    ]
  },
  'passport-photo/rrb-alp': {
    metaTitle: 'Railway RRB ALP Photo Resizer Online Free | SizeSnap',
    metaDescription: 'Resize your passport photo for Railway RRB Assistant Loco Pilot (ALP) application forms. Free tool to crop and compress photo strictly under 20KB-50KB.',
    h1: 'RRB ALP Exam Photo Resizer',
    introParagraph: 'Railway Recruitment Board (RRB) Assistant Loco Pilot (ALP) apply karne ke liye passport photo standard rules (3.5x4.5cm, 20-50KB) me scale karein.',
    bodyHtml: `
      <h2>RRB Assistant Loco Pilot Photo Spec and Rules</h2>
      <p>Candidates applying for the RRB ALP exams need to submit a recent color passport photograph with white/light background. Spectacles or caps are not allowed. File size limit is strictly 50KB.</p>
    `,
    faqs: [
      { question: 'What is the background color for RRB ALP photo?', answer: 'Plain white background is mandatory for RRB ALP application forms.' }
    ]
  },
  'passport-photo/rrb-groupd': {
    metaTitle: 'Railway RRB Group D Photo Resizer Online Free | SizeSnap',
    metaDescription: 'Resize and crop passport photo for Railway RRB Group D exam online. Fit under 20KB-50KB limit with white background.',
    h1: 'RRB Group D Exam Photo Resizer',
    introParagraph: 'Format your photo perfectly under 50KB for the Railway RRB Group D application portal. Safe and local processing.',
    bodyHtml: `
      <h2>RRB Group D Photo Specifications</h2>
      <p>Ensure your photo matches the standard 3.5cm x 4.5cm and file size is between 20KB and 50KB. Blurry photos lead to automatic reject alerts.</p>
    `,
    faqs: [
      { question: 'What is the photo size for RRB Group D?', answer: 'It is 3.5cm x 4.5cm, under 50KB max size.' }
    ]
  },
  'signature-resize/rrb-alp-signature': {
    metaTitle: 'Resize Signature for Railway RRB ALP Exam (10-20KB) | SizeSnap',
    metaDescription: 'Resize and compress your signature scan under 20KB for Railway RRB ALP online. Meets standard 10KB to 20KB limit.',
    h1: 'RRB ALP Signature Resizer',
    introParagraph: 'Crop and compress your scanned signature to exactly 10KB-20KB for the Railway RRB ALP exam application.',
    bodyHtml: `
      <h2>Railway RRB ALP Signature Guidelines</h2>
      <p>The signature must be done on clean white paper with black ink and scanned. Scale it under 20KB using this client-side tool.</p>
    `,
    faqs: [
      { question: 'What is the size limit for RRB ALP signature?', answer: 'It must be between 10KB and 20KB in JPEG/JPG format.' }
    ]
  },
  'signature-resize/rrb-groupd-signature': {
    metaTitle: 'Resize Signature for Railway RRB Group D Exam (10-20KB) | SizeSnap',
    metaDescription: 'Resize and compress your signature scan under 20KB for Railway RRB Group D online. Meets standard 10KB to 20KB limit.',
    h1: 'RRB Group D Signature Resizer',
    introParagraph: 'Crop and compress your scanned signature to exactly 10KB-20KB for the Railway RRB Group D exam application.',
    bodyHtml: `
      <h2>Railway RRB Group D Signature Guidelines</h2>
      <p>Use black ink on white paper for the signature. Ensure the file size is under 20KB to prevent portal rejection.</p>
    `,
    faqs: [
      { question: 'Is black ink required for Group D signature?', answer: 'Yes, black ink is highly recommended for scanning clarity.' }
    ]
  },
  'word-to-pdf/convert': {
    metaTitle: 'Convert Word and Text to PDF Online Free | SizeSnap',
    metaDescription: 'Convert plain text files (.txt) or paste Word document text to generate PDF files online instantly. 100% free, private browser-based tool.',
    h1: 'Convert Word & Text to PDF Online Free',
    introParagraph: 'Apne text ya Word document ke content ko instantly standard PDF format me convert karein. SizeSnap local conversion engine safety standard ko lock karta hai.',
    bodyHtml: `
      <h2>Word / Text to PDF Converter Ke Fayde</h2>
      <p>Kai applications aur portals par resume, cover letter ya write-ups ko strictly PDF format me submit karna mandatory hota hai. Hamara local converter tool bina kisi server upload ke aapki file ko PDF document me compile kar deta hai.</p>
      <h3>Browser-side local conversion technology</h3>
      <p>Aapki file aur text hamare servers par nahi jaate. Processing poori tarah browser ke andhar execute hoti hai, jo 100% security aur privacy verify karti hai.</p>
    `,
    faqs: [
      { question: 'Kya ye tool phone me chalta hai?', answer: 'Haan, mobile browser me document text paste karke direct PDF download kiya ja sakta hai.' }
    ]
  },
  'watermark-image/add-text': {
    metaTitle: 'Add Name and Date on Photo Online Free | Passport Photo Maker | SizeSnap',
    metaDescription: 'Need to add name and date to passport size photo online? Print candidate name and Date of Photo (DOPO) at the bottom of your image for SSC, NEET, and government forms free.',
    h1: 'Add Name and Date on Photo Online Free',
    introParagraph: 'Apne passport size photograph par candidate ka naam aur photo click hone ki tareekh (Date of Photo - DOPO) online add karein. Government recruitment exams jaise SSC CGL, CHSL, Constable, Navy, aur state levels board applications me mandatory formats me custom text panel overlay set karna bohot zaroori hai. Hamara free tool ise 100% private browser mode me design karta hai.',
    bodyHtml: `
      <h2>Passport Photo Par Name Aur Date Kaise Likhein? (Step-by-Step Guide)</h2>
      <p>Kai sarkari naukriyon ke online forms (jaise SSC CGL/CHSL, Navy, Coast Guard, aur state-level police posts) me ek aisi passport photograph upload karni hoti hai jiske niche candidate ka naam aur date print ho. Standard graphics software ya default photo editors me isko align karna mushkil hota hai. SizeSnap is utility process ko bilkul simple banata hai:</p>
      
      <ol>
        <li>Aap apni passport size photograph (JPG, JPEG, ya PNG format) select/upload karein.</li>
        <li>Hamara tool image ke niche automatically ek safe white panel layer draw kar deta hai.</li>
        <li>Aap text box me apna full name aur correct Date of Photo (DOPO) enter karein.</li>
        <li>Font color aur text position adjust karne ke baad instant download option click karke format compile kar sakte hain.</li>
      </ol>
      
      <h3>Official Examination Portal Board Guidelines</h3>
      <p>Sarkari portals jaise Staff Selection Commission (SSC), NTA (NEET/JEE) aur central banking systems application processes me uploaded image check rules strict rakhte hain:</p>
      <ul>
        <li><strong>Date Verification:</strong> Photo notification ki date se 3 mahine se purani nahi honi chahiye aur date formats clear DD/MM/YYYY target setup me hone chahiye.</li>
        <li><strong>Face Visibility:</strong> White background, front face alignment aur clean shoulders visible hone chahiye.</li>
        <li><strong>Legible Print:</strong> White stripe par printed naam aur date strictly read hone chahiye bina visual blurring filters ke.</li>
      </ul>

      <h3>100% Safe client-side execution model (Privacy First)</h3>
      <p>Hum security regulations aur rules ko tightly follow karte hain. User photos hamare control nodes ya external databases par bilkul save ya transfer nahi hote hain. Pure document modifications aapke local phone ya desktop memory me runtime processes ke through safe bounds me perform hoti hain. Is wajah se sizesnap transaction completely secure hai.</p>

      <h3>Internal References to Related Tools</h3>
      <p>Custom name and date print karne ke baad aap humare dusre utilities check kar sakte hain. Passport dimension frames update karne ke liye use <a href="/passport-size-photo-maker">Passport Size Photo Maker</a>, scanned files and signature weight adjust karne ke liye use <a href="/11kb-converter">11KB Converter</a> ya file sizes check karne ke liye use <a href="/resize-image-to-50kb">50KB Photo Compressor</a>, aur standard sign adjust ke liye read <a href="/resize-signature-for-ssc">SSC Signature Resizer</a> templates guides.</p>
    `,
    faqs: [
      { question: 'SSC CGL/CHSL exam me photo par name aur date print karna mandatory hai?', answer: 'SSC ke kuch recent notifications guidelines me name and date compulsory nahi hai but state recruitments (jaise UP Police, Navy, Coast Guard, etc.) aur specific bank profiles me candidate name aur correct photo click date bottom panel me clear likhna mandatory parameters check under hai.' },
      { question: 'What is the date format for passport photo?', answer: 'Sabhi official portals par standard date format DD/MM/YYYY (jaise: 15/07/2026) print karna standard valid format hai.' },
      { question: 'Kya is name/date adder tool se passport photo ki quality kharab hoti hai?', answer: 'Nahi, SizeSnap smart pixel layout algorithms perform karta hai jisse original face characteristics locked aur crisp rehte hain.' },
      { question: 'Photo par name aur date add karte waqt background/text colors kya hone chahiye?', answer: 'Standard guidelines ke anusaar bottom panel white background color ka hona chahiye aur text print solid black ink characters me display hona chahiye.' }
    ]
  },
  'dpi-converter/to-300': {
    metaTitle: 'Convert Image to 300 DPI Online Free | Change DPI in Browser | SizeSnap',
    metaDescription: 'Convert image to 300 DPI online for free. Change the resolution density of your scanned passport photo, signature, or document to exactly 300 DPI locally in your browser.',
    h1: 'Convert Image to 300 DPI Online Free',
    introParagraph: 'Apne scanned documents, photograph ya signatures ki pixel print density resolution ko directly modify karke exactly 300 DPI banayein. Standard government portals, EPFO online forms, court legal filings, aur college admission portfolios strictly demand karte hain ki certificates 300 DPI me scanned honi chahiye taaki clarity bani rahe. SizeSnap browser sandbox me local execution ke zariye file change karta hai.',
    bodyHtml: `
      <h2>300 DPI Resolution Kya Hai Aur Kyu Zaroori Hai?</h2>
      <p>DPI (Dots Per Inch) image files ki printing resolution capability aur display density block configuration measure karta hai. online portals database parameters setup karte waqt 300 DPI scan details strictly verify karte hain. iska purpose scan text blocks (jaise marksheet details, bank passbook scans) high resolution verification screens par clear padhna hai.</p>
      
      <h3>How to Change Image to 300 DPI? (Problem & Solution)</h3>
      <p>Aapke smart devices normally standard canvas screen outputs check parameters (like 72 DPI ya 96 DPI) setup save karte hain. inko default mobile options se exactly 300 DPI change karna binary changes details setup without visual resolution distortion check demands karta hai. SizeSnap is metadata property ko structure change performs karke modify karta hai:</p>
      
      <ol>
        <li>Aap target file (JPG, JPEG ya PNG document scan) select/drag drop box choose karein.</li>
        <li>Preset selectors me click <strong>300 DPI</strong> target density option confirm karein.</li>
        <li>System background binary parsing perform karke JFIF (JPEG) headers customize settings modify set verify kar deta hai.</li>
        <li>Complete hote hi direct output standard high resolution file download blocks save settings choose download deliver options perform karein.</li>
      </ol>
      
      <h3>EPFO, Court filings aur Banking applications requirements</h3>
      <p>EPFO Claim validation process, passport office credentials uploads aur judicial electronic system records scan copies check strictly 300 DPI instructions check perform valid rules limits accept karte hain, parameters failure check applications delay error notifications return details show karte hain.</p>

      <h3>Internal References to Related Conversions</h3>
      <p>DPI adjustments scale formats update karne ke sath and templates verify controls use resources are available. For lower density needs go to <a href="/convert-image-to-200-dpi">Convert Image to 200 DPI</a>, optimize files weight using <a href="/resize-image-to-100kb">100KB Document Resizer</a> or crop certificates directly using <a href="/pdf-under-500kb">PDF under 500KB</a> utilities templates links.</p>
    `,
    faqs: [
      { question: 'DPI badalne se photo ka dimensions pixels me change ho jata hai?', answer: 'Nahi. DPI changing operation print density metadata parameters change karta hai. original image coordinates (width & height in pixels) unchanged lock parameters perform hote hain.' },
      { question: 'Scanned marksheets and certificates ko 300 DPI me convert karna kyu mandatory hai?', answer: 'Taki documents printable layout parameters aur digital verification screens par readable rahein, letters/numbers blur na ho.' },
      { question: 'EPFO portal par 300 DPI conversion error kaise fix karein?', answer: 'Apni passbook or identity scan upload karein, preset option 300 DPI select karein aur change buffer download file portal verification box direct submit pass options ho jayega.' }
    ]
  },
  'dpi-converter/to-200': {
    metaTitle: 'Convert Image to 200 DPI Online Free | Change DPI to 200 | SizeSnap',
    metaDescription: 'Convert image to 200 DPI online for free. Change your signature scans, passport size photos, or certificate documents to exactly 200 DPI locally inside your browser.',
    h1: 'Convert Image to 200 DPI Online Free',
    introParagraph: 'Apne scanned signatures, documents, marksheet copies aur passport size photographs ki resolution print density ko update karke exactly 200 DPI standard config set karein. UPSC, SSC, IBPS Banking notifications, aur regular admission portals standard layout instructions check pass karne ke liye 200 DPI target demand karte hain. Local JS code framework use karke properties dynamic download karein.',
    bodyHtml: `
      <h2>200 DPI Converter (Signature & Document Scan Density Fix)</h2>
      <p>Government exam forms filling process check instructions settings me candidate signature scans density target check limits minimum 200 DPI compulsory rules config parameters me set hoti hai. 200 DPI resolution setup marksheet checks verification system readable format properties values maintain rakhta hai.</p>
      
      <h3>Bilingual instructions: Signature details optimization (Hindi & English)</h3>
      <p>Signature compress convert karte waqt dhyan de ki solid white page sheets background block use karein aur dark blue or black ink pens signatures perform karein. shadows eliminate rules parameters process complete details configure setup safe:</p>
      <ul>
        <li>SizeSnap local tool files convert browser memory framework processing sandbox options runtime checks complete details performance setup coordinate maintain lock features.</li>
        <li>No internet connection uploads transfer require, keeping official signatures highly confidential models.</li>
      </ul>

      <h3>Quick conversion details</h3>
      <p>Aap images format configurations setup check easily targets presets selected change metrics downloads click access options perform. Related conversions details help to <a href="/convert-image-to-300-dpi">Convert Image to 300 DPI</a>, sign sizing optimizations to <a href="/resize-signature-for-ibps-exam">IBPS Signature Resizer</a> or small payload resizing parameters check <a href="/resize-image-to-20kb">20KB Image Compressor</a> resources pages.</p>
    `,
    faqs: [
      { question: '200 DPI signature scan format rules kya hain?', answer: 'Scanned signature image background plain white, borders cropped aur print density value exactly 200 DPI parameters verification guidelines meet karni mandatory targets parameters checks satisfy structure.' },
      { question: 'Kya offline conversion image size in KB ko affect karta hai?', answer: 'Nahi. is process me resolution metadata tags edit format modifications dynamic process load parameters scale execute ho jata hai bina basic pixel weight variables heavy badle.' }
    ]
  },
  'card-joiner/aadhaar-merge': {
    metaTitle: 'Merge Aadhaar Card Front and Back Side Online Free | SizeSnap',
    metaDescription: 'Combine your Aadhaar card front and back side photos into a single image online for free. Clean, private browser-based tool to merge ID cards.',
    h1: 'Merge Aadhaar Card Front & Back Online',
    introParagraph: 'Apne Aadhaar card ki front aur back side ki photo ko aaps me jodkar ek single page or document sheet ready karein. Online portals aur banking verifications me upload karne ke liye fully optimized layout.',
    bodyHtml: `
      <h2>Aadhaar Card Front aur Back Side Photo Kaise Jodein?</h2>
      <p>Kai online application systems aur recruitment forms me scanned ID proofs upload karne ke liye sirf ek upload block/slot hota hai. Is wajah se candidates ko front aur back side ki pictures ko aaps me join karna padta hai. SizeSnap is merging utility ko 100% free aur browser-side local memory me automate karta hai.</p>
      
      <h3>Bilingual Steps (English and Hindi guide):</h3>
      <ol>
        <li>Aap apne Aadhaar Card ki Front and Back side photos select/upload karein.</li>
        <li>Choose target arrangement format: <strong>Vertical</strong> (Top-Down) ya <strong>Horizontal</strong> (Side-by-Side).</li>
        <li>Margins width, background colors aur aspect ratio adjustments dynamic select karein.</li>
        <li>Format compile complete hote hi click download target image directly under 100KB limits.</li>
      </ol>
      
      <h3>Browser sandboxing secure privacy features</h3>
      <p>Aadhaar cards contain sensitive personal identification numbers. To protect your details, all operations are done locally in your browser sandbox. No details or documents are uploaded to our cloud network services.</p>
    `,
    faqs: [
      { question: 'Aadhaar front back merge standard dimensions kya hoti hain?', answer: 'Portals normally standard A4 vertical sheets or side-by-side card proportions accept karte hain, jo standard resizers me auto fit dimensions me adjust ho jate hain.' },
      { question: 'Kya ye merge utility mobile browser par work karegi?', answer: 'Yes, SizeSnap.in mobile screens aur browsers ke liye fully optimized layout support provide karta hai.' }
    ]
  },
  'card-joiner/pan-merge': {
    metaTitle: 'Merge PAN Card Front and Back Online Free | SizeSnap',
    metaDescription: 'Combine PAN card front and back side images into a single photo online for free. Clean, private browser-based tool to merge ID cards.',
    h1: 'Merge PAN Card Front & Back Online',
    introParagraph: 'Apne PAN card ya voter ID card ki front aur back side photographs ko aaps me join karke ek single picture document set prepare karein.',
    bodyHtml: `
      <h2>PAN Card Front and Back side merger tool</h2>
      <p>Bank accounts opening, loan verifications, aur e-filing systems me PAN card attachments single page documents require karte hain. Sizesnap dynamic cards merger tool se files instantly merge karein browser me bina graphics software ke.</p>
    `,
    faqs: [
      { question: 'Voter card images merge ho sakti hain?', answer: 'Yes, aap Aadhaar, PAN, Voter ID, driving license aur marksheet sheets merge kar sakte hain.' }
    ]
  },
  'postcard-photo/dsssb-postcard': {
    metaTitle: 'DSSSB Postcard Size Photo Resizer Online (5x7 Inch) | SizeSnap',
    metaDescription: 'Resize and crop photo to postcard size 5x7 inches under 300KB for DSSSB online application form free. 100% private browser processing.',
    h1: 'DSSSB Postcard Size Photo Resizer (5x7 Inch)',
    introParagraph: 'DSSSB notifications ke guidelines ke according apne passport size ya portrait photo ko postcard size 5x7 inch (480x672 pixels) layout aur under 300KB me resize karein.',
    bodyHtml: `
      <h2>DSSSB Postcard Size (5x7) Requirement Kya Hai?</h2>
      <p>Delhi Subordinate Services Selection Board (DSSSB) candidates ke registrations rules me strictly 5x7 inch size postcard photo upload mandatory hai, jo standard passport dimensions se choti ya badi hone par automatic software check block reject kar deta hai.</p>
      <h3>DSSSB Layout Specifications:</h3>
      <ul>
        <li><strong>Physical dimensions:</strong> 5 inches width x 7 inches height.</li>
        <li><strong>Resolution equivalent:</strong> 480 x 672 pixels.</li>
        <li><strong>File weight limits:</strong> 50 KB to 300 KB maximum.</li>
        <li><strong>Aspect ratio:</strong> 5:7 proportions lock.</li>
      </ul>
    `,
    faqs: [
      { question: 'DSSSB postcard photo background color kya hona chahiye?', answer: 'Generally plain white background color with clear face expression specifications verify rule accepted hai.' }
    ]
  },
  'postcard-photo/neet-postcard': {
    metaTitle: 'NEET Postcard Size Photo Resizer Online (4x6 Inch) | SizeSnap',
    metaDescription: 'Resize and crop photo to postcard size 4x6 inches under 200KB for NTA NEET application form free. 100% private browser processing.',
    h1: 'NEET Postcard Size Photo Resizer (4x6 Inch)',
    introParagraph: 'NEET admission guidelines parameters ke matching 4x6 inch postcard dimensions (400x600 pixels) under 200KB formats optimize select karein.',
    bodyHtml: `
      <h2>NEET Postcard size (4"x6") guidelines</h2>
      <p>NTA NEET registration files check system passport photo ke sath-sath postcard format photos demand karta hai, details coverage face area 80% and ears details clear readability targets base checks perform check rules limits standard configurations use click downloads.</p>
    `,
    faqs: [
      { question: 'NEET postcard size measurements kya hain?', answer: 'Physical size 4x6 inches scale, digital equivalent 400x600 pixels limits under 10-200KB range.' }
    ]
  },
  'document-enhancer/remove-shadow': {
    metaTitle: 'Remove Shadow from Document Photo Online Free | SizeSnap',
    metaDescription: 'Clean and remove dark shadows from photos of documents, marksheets, or signatures. Make paper background pure white and text black.',
    h1: 'Remove Shadow from Document Photos Online',
    introParagraph: 'Apne mobile se khinchi gayi marksheet, certificate ya signature photo se unwanted light shadows, dark corners, aur grayish background ko remove karein. Background ko clean white aur text ko high contrast dark banayein.',
    bodyHtml: `
      <h2>Document Photos Se Parchhai/Shadow Kaise Hatayein?</h2>
      <p>Mobile camera se captured documents (certificates, marksheet scans, IDs) me uneven lightning, corners shadow aur grey blur sheets errors common issues hote hain. online portals digital uploads check filters gray sheets reject kar dete hain. sizeSnap dynamic enhancer filter image elements restructure karke clean scanner effect provide karta hai.</p>
      <h3>Bilingual scanner features:</h3>
      <ul>
        <li><strong>Adaptive White threshold:</strong> Greyish background values ko bright pure white paper format output me convert karein.</li>
        <li><strong>Text contrast sharpening:</strong> Signature ink details aur certificate letters values sharpen models set verify filters.</li>
        <li><strong>Private processing:</strong> Documents processed offline securely.</li>
      </ul>
    `,
    faqs: [
      { question: 'Kya ye marksheet scan numbers change to nahi karega?', answer: 'Nahi. isme simple pixel color correction matrices perform hote hain, coordinates values aur textual data intact locked format properties me rehti hain.' }
    ]
  },
  'document-enhancer/signature-sharpener': {
    metaTitle: 'Sharpen Scanned Signature Online Free | SizeSnap',
    metaDescription: 'Sharpen your scanned signature online. Make paper background pure white and ink solid black or blue for exam portals.',
    h1: 'Sharpen Scanned Signature Online Free',
    introParagraph: 'Apne signature scan document file ko target high contrast solid colors filters compile features check complete levels adjust parameters details clean coordinates set parameters.',
    bodyHtml: `
      <h2>Scanned Signature Text Clarify Sharpener</h2>
      <p>Faded signature scans verification systems verify checks read criteria failure issues solve parameters coordinates set, black ink values optimized properties.</p>
    `,
    faqs: [
      { question: 'Ink optimizer black options check kya hai?', answer: 'Blue ink values ko solid black ink specifications conversion dynamic filter options support.' }
    ]
  },
  'split-pdf/extract-pages': {
    metaTitle: 'Split PDF & Extract Pages Online Free | SizeSnap',
    metaDescription: 'Split PDF and extract specific pages into a new PDF file online free. Works locally in your browser, 100% private.',
    h1: 'Split PDF & Extract Pages Online Free',
    introParagraph: 'Apne multi-page PDF document me se specific pages (jaise page 1 ya selected sheets) ko extract karke ek nayi choti PDF file banayein.',
    bodyHtml: `
      <h2>PDF File Ke Pages Kaise Alag Karein? (PDF Splitter)</h2>
      <p>Kuch government registration portals aur marksheet uploads me maximum limits choti rakhne ke sath-sath single pages documents attach require guidelines rules follow details coordinate models, sizeSnap client browser parameters me pdf-lib structures use split actions perform dynamic tools.</p>
    `,
    faqs: [
      { question: 'Kya single files pages compile separate downloads check possible hai?', answer: 'Yes, split pages numbers options dynamic choose click settings direct save download coordinates accessible.' }
    ]
  },
  'background-changer/to-white': {
    metaTitle: 'Change Photo Background to White Online Free | SizeSnap',
    metaDescription: 'Change your photo background to pure white online for free. Convert passport size photo background color locally in your browser.',
    h1: 'Change Photo Background to White Online',
    introParagraph: 'Apne passport size photo ya portrait image ka background color select karke use instantly pure white color sheet me change karein. 100% free and client-side safe.',
    bodyHtml: `
      <h2>Passport Photo Background White Kaise Karein?</h2>
      <p>NEET, SSC, UPSC aur banking exams me strictly instructions rules verify criteria follow settings use background color exactly <strong>White</strong> demand kiye jate hain. SizeSnap.in browser-side graphics tool se coordinates check and threshold pixels adjust karke color change process execute karta hai.</p>
      
      <h3>Bilingual Steps (Hindi & English instructions):</h3>
      <ol>
        <li>Upload target portrait image file choose parameters.</li>
        <li>Select standard background replace preset: <strong>Pure White</strong>.</li>
        <li>Borders tolerance value check controls adjust coordinates settings.</li>
        <li>Generate files weight compressed download file options safe.</li>
      </ol>
    `,
    faqs: [
      { question: 'Background white replace karne se file key properties affect hongi?', answer: 'Nahi, is process me image elements quality and features values strictly local browser me correct settings configurations follow karte hain.' }
    ]
  },
  'background-changer/to-blue': {
    metaTitle: 'Change Photo Background to Blue Online Free | SizeSnap',
    metaDescription: 'Change your photo background to blue online for free. Clean background color changer for passport size photos.',
    h1: 'Change Photo Background to Blue Online',
    introParagraph: 'Apne photo ka background sky blue color filter layout preset me convert karein jo NEET, RRB aur banks notifications rules specifications demand karte hain.',
    bodyHtml: `
      <h2>Blue Background Photo Editor</h2>
      <p>State levels recruitments aur judicial applications profiles photos checks me background sky blue target rules verify parameters use karte hain.</p>
    `,
    faqs: [
      { question: 'Kaun se blue color range supported hain?', answer: 'Standard sky blue and dark blue preset colors easily adjust controls me pre-set metrics coordinate settings verify available hain.' }
    ]
  },
  'exam-pack-generator/sarkari-exam-pack': {
    metaTitle: '1-Click Sarkari Exam Photo & Signature Pack Generator (SSC, NEET, UPSC, IBPS) | SizeSnap',
    metaDescription: 'Auto-format Photo (with Name/Date), Signature, Thumb Impression & Marksheet for SSC, NEET, UPSC, IBPS in 1-Click ZIP. 100% Free & In-Browser Private.',
    h1: '1-Click Sarkari Exam Form Pack Generator (Photo, Signature & Documents in 1 ZIP)',
    introParagraph: 'Kisi bhi Sarkari Exam (SSC CGL, NEET, UPSC, IBPS, Police) ka form bharne ke liye photo, signature aur documents ko official guidelines ke hisaab se 1-click me resize karein aur ready-to-upload ZIP bundle download karein.',
    bodyHtml: `
      <h2>1-Click Sarkari Exam Form Pack Generator Online</h2>
      <p>Sarkari Exam portals jaise SSC, NTA NEET, UPSC aur IBPS par alag-alag documents ke liye alag-alag size aur dimension requirements hoti hain. SizeSnap ka 1-Click Exam Pack Generator sabhi required documents ko ek hi screen par accept karta hai aur instant ready-to-upload ZIP create karta hai.</p>
      <h3>Supported Official Exam Presets:</h3>
      <ul>
        <li><strong>SSC CGL / CHSL / MTS / GD:</strong> Photo (20-50KB, 3.5x4.5cm) + Signature (10-20KB, 4x2cm) + Marksheet (50-200KB).</li>
        <li><strong>NTA NEET UG 2026:</strong> Passport (10-200KB) + Postcard 4x6 (10-200KB) + Signature (4-30KB) + Thumb Impression (10-200KB).</li>
        <li><strong>UPSC Civil Services & NDA:</strong> Photo (20-300KB) + Signature (20-300KB) + Photo ID Card (20-300KB).</li>
        <li><strong>IBPS & SBI Bank PO/Clerk:</strong> Photo (20-50KB) + Signature (10-20KB) + Left Thumb (20-50KB) + Declaration (50-100KB).</li>
      </ul>
    `,
    faqs: [
      { question: 'Kya Candidate Name aur Date of Photo print hoga?', answer: 'Haan, aap apna naam aur date of photo enter karke photo ke bottom me official standard white banner ke saath print kar sakte hain.' },
      { question: 'Kya ZIP file mobile phone me download hoti hai?', answer: 'Haan, ZIP file Android aur iOS dono mobile devices par directly download ho jaati hai aur individual files bhi download kar sakte hain.' },
      { question: 'Kya documents kisi server par upload hote hain?', answer: 'Nahi, sabhi processing 100% client-side browser me hoti hai, aapka data poori tarah private rehta hai.' }
    ]
  },
  'passport-print-sheet/passport-sheet-maker': {
    metaTitle: '4x6 & A4 Passport Photo Print Sheet Maker Online Free (300 DPI PDF) | SizeSnap',
    metaDescription: 'Create 6, 8, 12, or 30 passport size photos (35x45mm) on 4x6 inch glossy paper or A4 sheet with scissor cutting lines for Cyber Cafe & CSC centers.',
    h1: '1-Click 4x6 & A4 Passport Photo Print Sheet Maker (300 DPI Print Ready)',
    introParagraph: 'Single photo upload karke 4x6 inch photo paper ya A4 sheet par 6, 8, ya 30 passport photos ka printable 300 DPI PDF aur JPG layout generate karein with scissor cutting borders.',
    bodyHtml: `
      <h2>Passport Size Photo Print Sheet Studio for Cyber Cafe & CSC</h2>
      <p>Photoshop 7.0 ki zaroorat ke bina, apne customers ke liye 1 second me 4x6 inch paper par 6 ya 8 passport photos aur A4 paper par 30 photos ka 300 DPI high-definition printable sheet banayein.</p>
      <h3>Key Features:</h3>
      <ul>
        <li><strong>Standard Paper Sizes:</strong> 4x6 inch glossy paper, A4 sheet (210x297mm), and 5x7 inch.</li>
        <li><strong>Scissor Cutting Lines:</strong> Dashed cutting guides for fast and clean manual cutting.</li>
        <li><strong>300 DPI Print PDF:</strong> Direct Ctrl+P ready for Epson, Canon, and HP photo printers.</li>
      </ul>
    `,
    faqs: [
      { question: '4x6 paper par kitne passport photos print ho sakte hain?', answer: 'Standard 4x6 inch paper par 6 photos ya 8 photos perfectly print ho sakte hain.' },
      { question: 'Print quality kaisi aayegi?', answer: 'SizeSnap 300 DPI ultra-high definition resolution par PDF render karta hai jisse print bilkul sharp aur professional studio quality ka aata hai.' }
    ]
  },
  'photo-compliance-checker/photo-validator': {
    metaTitle: 'Sarkari Form Photo AI Compliance Checker & Rejection Prevention | SizeSnap',
    metaDescription: 'Instant 8-point automated compliance audit for SSC, NEET, UPSC, IBPS application photos (Size, Background, Dimensions, Blur). Prevent form rejection.',
    h1: 'Sarkari Form Photo AI Compliance Checker & Audit',
    introParagraph: 'Apni application photo ko exam portal par submit karne se pehle 8-point automated rules check karein taaki aapka application form reject na ho.',
    bodyHtml: `
      <h2>8-Point Automated Sarkari Photo Compliance Engine</h2>
      <p>Lakho students ke Sarkari Exam applications minor photo errors (wrong size, dark background, blurry face, incorrect ratio) ki wajah se reject ho jaate hain. SizeSnap ka Compliance Checker 8 criteria verify karta hai aur 1-click me automatically fix karta hai.</p>
    `,
    faqs: [
      { question: 'SSC CGL me photo reject kyu hoti hai?', answer: 'Spectacles glare, cap/mask pehanne, dark background, 20-50KB limit cross hone, ya blurred image hone ki wajah se SSC forms reject ho jaate hain.' },
      { question: 'Kya ye checker 1-click me photo fix kar sakta hai?', answer: 'Haan, "1-Click Auto-Fix & Download" button click karne par photo automatically correct dimensions aur target KB me convert hokar download ho jaati hai.' }
    ]
  },
  'ocr-text-extractor/from-marksheet': {
    metaTitle: 'OCR Extract Text from Marksheet & Certificate Online Free | SizeSnap',
    metaDescription: 'Extract Roll Numbers, Candidate Names, Marks, and text from scanned marksheets and documents with zero typing. 100% in-browser OCR.',
    h1: 'OCR Extract Text from Marksheet & Certificate Online Free',
    introParagraph: 'Scanned 10th/12th marksheets, degree certificates aur documents se roll number aur marks bina type kiye copy karein.',
    bodyHtml: `
      <h2>Client-Side OCR Marksheet Text Extractor</h2>
      <p>High-accuracy Tesseract.js engine use karke apne document image se instant editable text extract karein.</p>
    `,
    faqs: [
      { question: 'Kya Hindi documents ka text extract hota hai?', answer: 'Haan, English aur Hindi dono document formats supported hain.' }
    ]
  },
  'pdf-protect/add-password': {
    metaTitle: 'Lock & Password Protect PDF Online Free (AES Encryption) | SizeSnap',
    metaDescription: 'Add strong password protection and AES encryption to confidential PDF documents online free. 100% private in-browser.',
    h1: 'Lock & Password Protect PDF Documents Online Free',
    introParagraph: 'Apne confidential PDFs aur bank statements me password protection lagayein without uploading files to any server.',
    bodyHtml: `
      <h2>Secure Client-Side PDF Encryption</h2>
      <p>AES encryption standard ke saath apne sensitive documents ko lock karein.</p>
    `,
    faqs: [
      { question: 'Kya ye password kisi server par save hota hai?', answer: 'Nahi, poori encryption aapke device ke browser me hoti hai, koi bhi data server par nahi jaata.' }
    ]
  },
  'pdf-unlock/remove-password': {
    metaTitle: 'Unlock Password Protected PDF Online Free | SizeSnap',
    metaDescription: 'Remove known password from Aadhaar, Salary Slip, and Bank Statement PDFs for permanent unlock online free.',
    h1: 'Unlock Password Protected PDF Online Free',
    introParagraph: 'Aadhaar card aur bank statement PDFs se permanent password remove karein taaki bar-bar password na enter karna pade.',
    bodyHtml: `
      <h2>Instant Client-Side PDF Password Removal</h2>
      <p>Aadhaar card PDF aur e-statements ko unlock karke clean unencrypted PDF download karein.</p>
    `,
    faqs: [
      { question: 'Kya mujhe password pata hona zaroori hai?', answer: 'Haan, authorized access ke liye current password enter karna hota hai jiske baad permanently unlocked PDF milta hai.' }
    ]
  },
  'age-calculator/sarkari-exam': {
    metaTitle: 'Sarkari Exam Age Calculator Online (As on Cutoff Date 2026) | SizeSnap',
    metaDescription: 'Calculate exact age (Years, Months, Days) as on cutoff date for SSC CGL, UPSC, UP Police, RRB NTPC, IBPS with category relaxation. 100% Free.',
    h1: 'Sarkari Exam Age Calculator & Cutoff Eligibility Online Free',
    introParagraph: 'Calculate your exact age as on notification cutoff date (e.g. 01-08-2026 or 01-01-2026) with live eligibility badges and category age relaxations for General, OBC (+3y), SC/ST (+5y), and PwD (+10y).',
    bodyHtml: `
      <h2>Why use SizeSnap Sarkari Exam Age Calculator?</h2>
      <p>Sarkari recruitment notifications like SSC, UPSC CSE, UP Police Constable, Railway RRB, and Banking exams strictly specify age eligibility as on a specific cutoff date. Calculating leap years, exact months, and days manually often leads to application errors.</p>
      <ul>
        <li><strong>Exact Precision:</strong> Gives detailed breakdown of Years, Months, and Days as on the cutoff date.</li>
        <li><strong>Category Age Relaxation:</strong> Automatic +3 years for OBC, +5 years for SC/ST, and +10 years for PwD candidates.</li>
        <li><strong>Live Multi-Exam Matrix:</strong> Real-time eligibility check for 10+ major national exams in 1 click.</li>
      </ul>
    `,
    faqs: [
      { question: 'How is age calculated for SSC CGL & UPSC exams?', answer: 'The age is calculated from your Date of Birth to the cutoff date specified in the official notification (usually August 1st or January 1st of the exam year).' },
      { question: 'Does this calculator apply OBC/SC/ST age relaxation?', answer: 'Yes! Select your category (General, OBC, SC/ST, PwD) from the dropdown and the system will automatically calculate your relaxed maximum age limit.' },
      { question: 'Is my Date of Birth data stored anywhere?', answer: 'No. SizeSnap runs 100% locally in your browser. No personal information is sent to any server.' }
    ]
  },
  'dimension-resizer/in-cm': {
    metaTitle: 'Resize Image in CM & MM Online Free (3.5 x 4.5 cm @ 300 DPI) | SizeSnap',
    metaDescription: 'Resize photos to exact 3.5x4.5 cm, 4x2 cm signature, 2x2 inch, or 35x45 mm online free at 200/300 DPI with KB compressor. 100% in-browser.',
    h1: 'Resize Image in CM, MM, Inches & Pixels Online Free',
    introParagraph: 'Resize photos and scanned signatures into exact physical dimensions (Centimeters, Millimeters, Inches) at 200/300 DPI with target file size control (≤50KB, ≤100KB) for government exam portals.',
    bodyHtml: `
      <h2>Convert Physical Dimensions (CM/MM) to High-Quality Digital Photos</h2>
      <p>Official examination portals (SSC, UPSC, NTA NEET, State PSCs) mandate exact physical dimensions like <strong>3.5 cm × 4.5 cm</strong> for passport photos and <strong>4.0 cm × 2.0 cm</strong> for signatures at 200 or 300 DPI.</p>
      <ul>
        <li><strong>Multi-Unit Support:</strong> Centimeters (CM), Millimeters (MM), Inches, and Pixels (PX).</li>
        <li><strong>DPI Resolution Control:</strong> 100, 200 (Govt Forms standard), 300 (Studio Print standard), or 600 DPI.</li>
        <li><strong>Smart KB Limiter:</strong> Automatically compresses the output image below your required KB limit without blur.</li>
      </ul>
    `,
    faqs: [
      { question: 'How many pixels is 3.5 x 4.5 cm at 300 DPI?', answer: '3.5 cm × 4.5 cm at 300 DPI is exactly 413 × 531 pixels.' },
      { question: 'How many pixels is 3.5 x 4.5 cm at 200 DPI?', answer: '3.5 cm × 4.5 cm at 200 DPI is exactly 276 × 354 pixels (standard for SSC and UPSC uploads).' },
      { question: 'Will resizing in CM reduce photo clarity?', answer: 'No, SizeSnap uses bicubic multi-step interpolation to preserve facial sharpness, eye clarity, and signature edges.' }
    ]
  },
  'merge-pdf/combine': {
    metaTitle: 'Merge PDF Online Free (Small Size & 100% Private) | SizeSnap',
    metaDescription: 'Merge PDF into a small size file online. Combine multiple PDF documents and compress them securely in your browser without uploading to any server.',
    h1: 'Merge PDF Files Online Free (Small Size & Secure)',
    introParagraph: 'Need to combine your 10th marksheet, 12th marksheet, and Aadhaar card into a single PDF? Merge and keep your PDF in a small size securely in your browser without uploading to any server.',
    bodyHtml: `
      <h2>Instant Multi-PDF Combiner for Job Applications</h2>
      <p>When applying for government jobs (SSC, UPSC) or university admissions, you often need to upload all your educational certificates as a single PDF document under a strict size limit. SizeSnap allows you to combine multiple scanned documents and certificates into one unified PDF file with custom page ordering. The processing is 100% secure with zero server uploads.</p>
      
      <h3>Merge and Compress PDF (Small Size)</h3>
      <p>Many users struggle because merging multiple PDFs creates a very large file that gets rejected by portals. While our merger combines your files instantly, you can seamlessly use our <a href="/compress-pdf-to-500kb">PDF Compressor tool</a> right after merging to shrink the final combined document into a small size (like 100KB or 500KB) without losing quality.</p>
      
      <h3>Why Use a Client-Side PDF Merger?</h3>
      <p>Traditional PDF mergers upload your sensitive documents (like Aadhaar, PAN, and marksheets) to remote servers, which can be a privacy risk. SizeSnap uses advanced WebAssembly and Canvas APIs to merge your files locally on your phone or laptop. Your data never touches the internet.</p>

      <h3>How to Combine PDF Files Online</h3>
      <ul>
        <li><strong>Step 1:</strong> Click 'Select Files' to choose two or more PDFs from your device.</li>
        <li><strong>Step 2:</strong> Drag and drop the thumbnails to reorder the pages as per the application requirements.</li>
        <li><strong>Step 3:</strong> Click 'Merge' and download your combined document instantly.</li>
      </ul>
    `,
    faqs: [
      { question: 'Is there a limit on how many PDF files I can merge?', answer: 'You can merge multiple PDF documents directly on your device without any restriction or watermark.' },
      { question: 'Are my confidential documents uploaded to a server?', answer: 'No, SizeSnap merges your PDF files 100% inside your browser. Your files never leave your device.' },
      { question: 'Does merging PDFs reduce the quality?', answer: 'No, our tool combines the files without compressing the original pages, so your text and images remain perfectly sharp and readable.' },
      { question: 'How do I merge and compress a PDF to a small size?', answer: 'First, use this tool to combine your PDFs. Once downloaded, upload that single file to our PDF Compressor to instantly reduce its size to exactly what you need (e.g., under 300KB).' },
      { question: 'Can I reorder the pages before merging?', answer: 'Yes! Once you select the files, you can visually drag and drop them into the exact order you need before generating the final PDF.' }
    ]
  },
  'image-to-pdf/convert': {
    metaTitle: 'JPG to PDF Converter Online Free (Image to PDF Under 200KB) | SizeSnap',
    metaDescription: 'Convert JPG, PNG images to PDF online free. Set target PDF size under 200KB or 500KB for exam portals. Fast, secure, 100% in-browser.',
    h1: 'Convert JPG & PNG Images to PDF Online Free',
    introParagraph: 'Convert photos, bills, ID cards, and document photos into standard PDF format with custom compression to meet recruitment portal file limits.',
    bodyHtml: `
      <h2>Fast Image to PDF Conversion with Custom Compression</h2>
      <p>Transform single or multiple images into a clean, printable PDF document formatted for official portal uploads.</p>
    `,
    faqs: [
      { question: 'Can I convert multiple JPG photos into a single PDF?', answer: 'Yes! Select multiple photos and combine them into a single multi-page PDF document.' },
      { question: 'Can I compress the generated PDF under 200KB?', answer: 'Yes, our built-in image compression ensures your output PDF meets strict recruitment portal size limits.' }
    ]
  },
  'pdf-to-jpg/extract': {
    metaTitle: 'PDF to JPG Converter Online Free (Extract High-Res Images) | SizeSnap',
    metaDescription: 'Convert PDF pages to high-quality JPG/PNG images online free. Extract every page instantly without any ZIP files. 100% client-side privacy.',
    h1: 'Convert PDF Pages to JPG Images Online Free',
    introParagraph: 'Extract all pages from your PDF document into crisp, high-resolution JPG or PNG image files directly in your web browser.',
    bodyHtml: `
      <h2>Extract High-Quality JPG Images from Any PDF</h2>
      <p>Convert e-books, marksheets, scanned forms, and brochures from PDF into clear JPG pictures for easy editing and sharing.</p>
    `,
    faqs: [
      { question: 'How do I download all extracted pages at once?', answer: 'Click the Download All button to securely download every page consecutively directly to your device without needing to extract annoying ZIP files.' }
    ]
  },
  'photo-clarifier/unblur-and-enhance': {
    metaTitle: 'Unblur Image & Clarify Marksheet Photo Online Free | SizeSnap',
    metaDescription: 'Unblur blurry photos, enhance scanned marksheets, and brighten dark signatures online free. 1-Click client-side AI image enhancer.',
    h1: 'Photo & Marksheet Clarifier & Unblur Online Free',
    introParagraph: 'Mobile phone se li gayi andheri ya dhundhli photo aur marksheet scans ko 1-click me unblur, bright aur crystal clear banayein.',
    bodyHtml: `
      <h2>1-Click AI Image Unblur & Document Clarifier</h2>
      <p>Phone camera se click ki gayi marksheets aur passport photos me aksar shadow, yellow tint ya blur hota hai jo Sarkari exam portals par reject ho jata hai.</p>
      <ul>
        <li><strong>Smart Auto-Clarify:</strong> Adaptive histogram balance se dark photos ko natural bright banata hai.</li>
        <li><strong>Unblur Text Kernel:</strong> Convolution unsharp mask se blurry roll numbers aur signature edges ko sharp karta hai.</li>
        <li><strong>Yellow Cast & Shadow Removal:</strong> Scanned paper ke background ko clean white banata hai.</li>
      </ul>
    `,
    faqs: [
      { question: 'Can this tool unblur blurry text on marksheets?', answer: 'Yes! Our high-frequency unsharp convolution filter sharpens document text edges, roll numbers, and signatures.' },
      { question: 'Does it remove yellow tint from phone camera photos?', answer: 'Yes, select the "Remove Yellow Shadow" preset to instantly normalize white paper background.' },
      { question: 'Are my private marksheet photos uploaded to any server?', answer: 'No! All photo enhancement runs 100% locally inside your web browser using HTML5 Canvas.' }
    ]
  },
  'photo-clarifier/enhance-marksheet': {
    metaTitle: 'Enhance Scanned Marksheet & Document Online Free | SizeSnap',
    metaDescription: 'Sharpen text, remove yellow paper background, and make marksheet scans readable for recruitment uploads. 100% free.',
    h1: 'Enhance Scanned Marksheet & Document Online Free',
    introParagraph: 'Marksheet aur certificate ke blurry text aur roll number ko crisp aur clear banayein taaki form verification me koi issue na aaye.',
    bodyHtml: `
      <h2>Make Scanned Marksheets Crystal Clear for Form Uploads</h2>
      <p>Clean up scanned 10th/12th marksheets, degree certificates, and caste certificates with high-contrast document filters.</p>
    `,
    faqs: [
      { question: 'How to make marksheet scan readable?', answer: 'Upload your marksheet photo, choose "Unblur Marksheet Text" or "High-Contrast Scan", and download the clarified JPG.' }
    ]
  },
  'signature-extractor/transparent-signature': {
    metaTitle: 'Make Signature Transparent & Convert Blue Ink to Black Online Free | SizeSnap',
    metaDescription: 'Remove paper background from signature, convert blue ink to official black ink for SSC/UPSC exams, and auto-crop under 10-20KB online free.',
    h1: 'Signature Background Remover & Ink Color Converter Online',
    introParagraph: 'Paper par kiye gaye signature ki photo se background remove karein, blue ink ko official black ink me convert karein aur 10-20KB me save karein.',
    bodyHtml: `
      <h2>1-Click Signature Background Cleaner & Ink Converter</h2>
      <p>Sarkari exam portals (SSC, UPSC, IBPS, NTA) par paper shadow ya light blue signature reject ho jata hai. Is tool se aap:</p>
      <ul>
        <li><strong>Convert Blue Ink to Deep Black:</strong> Mandated for SSC CGL, CHSL, MTS & UPSC applications.</li>
        <li><strong>Paper Shadow Removal:</strong> Phone camera se liye gaye signature ka background 100% pure white ya transparent PNG banayein.</li>
        <li><strong>Auto-Crop Tight Bounding Box:</strong> Signature ke around extra empty paper area ko automatic crop karein.</li>
        <li><strong>Save Under 10KB - 20KB:</strong> Exact official size limit me instant client-side download karein.</li>
      </ul>
    `,
    faqs: [
      { question: 'Why is black ink signature required in SSC and UPSC exams?', answer: 'Official exam guidelines mandate pure black ballpoint pen signature on white paper for high-speed automated document scanning and optical verification.' },
      { question: 'Can I change my blue ink signature photo to black ink?', answer: 'Yes! Select the "Deep Black Ink" mode to automatically convert blue or colored strokes into crisp black ink.' },
      { question: 'Can I download transparent PNG signature for PDF signing?', answer: 'Yes, switch to "100% Transparent PNG" mode to download signature with zero background.' }
    ]
  },
  'photo-name-date/add-name-date-stamp': {
    metaTitle: 'Add Name and Date on Photo Online Free for SSC & NEET (DOP / DOB) | SizeSnap',
    metaDescription: 'Add Candidate Name and Date of Photo (DOP) on passport size photo online free for SSC CGL, CHSL, MTS, GD, NEET & UPSC. Exact 50KB JPG.',
    h1: 'Add Name and Date (DOP) on Photo Online Free',
    introParagraph: 'SSC, NEET aur UPSC exam guidelines ke anusar apni passport photo par apna naam aur photo date (DOP) ka official printed bar lagayein.',
    bodyHtml: `
      <h2>Official SSC / NEET Candidate Name & Date Stamp Maker</h2>
      <p>SSC notifications me mandatory hota hai ki candidate ka naam aur photo lene ki tarikh (Date of Photo - DOP) passport photo ke niche printed ho.</p>
      <ul>
        <li><strong>Official Format:</strong> 3.5 x 4.5 cm passport ratio with bottom solid white name bar.</li>
        <li><strong>Custom Date & DOB:</strong> Set current date or custom DOP/DOB with 1-click.</li>
        <li><strong>Exact 20KB - 50KB JPG:</strong> Guaranteed upload-ready without form rejection.</li>
      </ul>
    `,
    faqs: [
      { question: 'Is Name and Date of Photo (DOP) mandatory for SSC CGL/CHSL/MTS?', answer: 'Yes, SSC photo rules state that the photograph must clearly show the candidate name and the date on which the photo was taken at the bottom.' },
      { question: 'What is the date format for DOP on photo?', answer: 'The standard format is "DOP: DD/MM/YYYY" printed in bold capital letters on a white banner.' },
      { question: 'Will the final photo size be under 50KB?', answer: 'Yes, the tool automatically optimizes the stamped photo between 20KB and 50KB JPG.' }
    ]
  },
  'photo-signature-joiner/photo-and-signature-joint': {
    metaTitle: 'Photo and Signature Joiner Online Free (50KB JPG / PDF) | SizeSnap',
    metaDescription: 'Combine passport photo and signature together into single JPG / PDF under 50KB or 100KB online free. Vertical & horizontal layouts for SSC, DSSSB & Bank exams.',
    h1: 'Photo and Signature Joint Maker Online Free',
    introParagraph: 'Passport photo aur signature ko ek sath vertically ya horizontally attach karke single JPG ya A4 PDF document banayein jo exam portal me 100% accept ho.',
    bodyHtml: `
      <h2>Combine Passport Photo & Signature into Single JPG / PDF Online</h2>
      <p>Many government exams and recruitment boards like DSSSB, Indian Navy, Coast Guard, Bank PO, and High Court forms require candidates to upload photo and signature joined together in a single file.</p>
      <ul>
        <li><strong>Vertical Stack (Standard):</strong> Passport photo on top, signature placed directly below it with optional Name & DOP banner.</li>
        <li><strong>Side-by-Side Horizontal:</strong> Photo on left, signature on right for ID cards and admission applications.</li>
        <li><strong>Target File Size ≤50KB / ≤100KB:</strong> 100% client-side compression without server upload.</li>
        <li><strong>Instant JPG & PDF Export:</strong> Download single image JPG or printable A4 PDF document.</li>
      </ul>
    `,
    faqs: [
      { question: 'Which exams require photo and signature in single file?', answer: 'Exams like DSSSB, Indian Navy, Coast Guard, various state high courts, and certain bank recruitment portals require a combined photo and signature joint.' },
      { question: 'Can I add candidate name and photo date on the joint photo?', answer: 'Yes, you can check the "Add Name & Date of Photo (DOP) Bar" option to automatically print your name and date between the photo and signature.' },
      { question: 'Will the output file be under 50KB?', answer: 'Yes, you can choose the ≤50KB, ≤100KB, or ≤200KB limit and our smart compression engine will keep the file within the exact limit.' }
    ]
  },
  'marksheet-id-merger/merge-marksheet-and-aadhaar': {
    metaTitle: 'Merge Marksheet and Aadhaar Card in One Page PDF Free (200KB) | SizeSnap',
    metaDescription: 'Merge marksheet, degree certificate and Aadhaar card front & back into 1 single-page A4 PDF under 200KB or 500KB online free.',
    h1: 'Merge Marksheet and Aadhaar Card in One Page PDF Online',
    introParagraph: 'Apni marksheet, certificate aur Aadhaar card ko ek single A4 PDF page me combine karein jo sarkari recruitment aur admission portals par turant upload ho sake.',
    bodyHtml: `
      <h2>Merge Scanned Marksheet and ID Card on 1 Single A4 PDF Page</h2>
      <p>Online government recruitment, scholarship portals, and college admission forms often ask candidates to upload multiple proofs (like 10th Marksheet + Aadhaar Card, or Degree + Caste Certificate) into a single 1-page PDF file under 200KB.</p>
      <ul>
        <li><strong>1-Page Standard A4 Layout:</strong> Top half for Marksheet / Certificate, Bottom half for Aadhaar / ID proof.</li>
        <li><strong>Custom Headings:</strong> Add official section headers like "10th Marksheet" and "Aadhaar Card Front & Back".</li>
        <li><strong>Strictly Under 200KB / 500KB:</strong> Guaranteed to fit the file size limits of state PSC and national exam portals.</li>
        <li><strong>100% Private In-Browser:</strong> Your sensitive government documents never leave your phone or computer.</li>
      </ul>
    `,
    faqs: [
      { question: 'How to merge marksheet and Aadhaar card in one page PDF?', answer: 'Upload your marksheet in Document 1 and your Aadhaar card in Document 2. The tool will automatically arrange them on an official A4 template and generate a single PDF under 200KB.' },
      { question: 'Is this document safe to use for sensitive Aadhaar cards?', answer: 'Yes! SizeSnap operates 100% client-side in your web browser. No files or personal data are ever uploaded to any server.' },
      { question: 'Can I choose the output file size limit?', answer: 'Yes, presets for ≤100KB, ≤200KB, ≤300KB, and ≤500KB are available.' }
    ]
  },
  'thumb-resizer/left-thumb-impression': {
    metaTitle: 'Thumb Impression Resizer for SSC, NEET & IBPS Online Free (10KB - 20KB) | SizeSnap',
    metaDescription: 'Resize and clarify Left & Right thumb impression photo online free under 10KB, 20KB or 50KB for SSC, NEET, IBPS & Railway exams. Auto-enhance ridge clarity.',
    h1: 'Thumb Impression Resizer & Ridge Enhancer Online Free',
    introParagraph: 'SSC, IBPS aur NEET exam ke liye apni Left/Right thumb impression (LTI/RTI) ki photo ko crystal clear banayein, background safed karein aur exact 10KB - 20KB me resize karein.',
    bodyHtml: `
      <h2>Left & Right Thumb Impression (LTI) Resizer for Government Recruitment</h2>
      <p>Almost every national exam portal (SSC CGL/CHSL/MTS/GD, NTA NEET, IBPS PO/Clerk, SBI, CTET, and State Police) mandates uploading a scanned Left Hand Thumb Impression (LTI) strictly between <strong>10KB to 20KB or 20KB to 50KB</strong>.</p>
      <ul>
        <li><strong>AI Ridge Pattern Enhancer:</strong> Auto-boosts fingerprint loop and whorl line contrast so the impression is never rejected for being blurry.</li>
        <li><strong>Paper Shadow Remover:</strong> Converts yellow or dim phone camera paper backgrounds into 100% pure crisp white.</li>
        <li><strong>Official Ink Selector:</strong> Convert faded ink into official Blue Stamp Pad ink or deep Black ink.</li>
        <li><strong>LTI / RTI Printed Footer:</strong> Optionally attach an official "LEFT THUMB IMPRESSION (LTI)" label bar.</li>
        <li><strong>Exact 10KB - 20KB Compressor:</strong> Guaranteed acceptance on SSC, IBPS, and NEET candidate login portals.</li>
      </ul>
    `,
    faqs: [
      { question: 'What is the standard thumb impression size for SSC exams?', answer: 'SSC requires Left Thumb Impression (LTI) in JPG format between 10KB to 20KB with 4cm x 3cm (or 4:3) aspect ratio.' },
      { question: 'Which hand thumb impression is required for NEET and IBPS?', answer: 'Unless stated otherwise, male and female candidates should upload their Left Hand Thumb Impression (LTI). If left thumb is unavailable, right thumb can be used.' },
      { question: 'How do I clean dark phone shadows from my thumb impression photo?', answer: 'Simply upload your photo to SizeSnap Thumb Resizer. Our automated paper whitening and ridge contrast filters will instantly make the background crisp white.' }
    ]
  },
  'pdf-page-numberer/add-page-numbers-to-pdf': {
    metaTitle: 'Add Page Numbers to PDF Online Free (Page 1 of N / Roll No) | SizeSnap',
    metaDescription: 'Add page numbers, bates numbering, and candidate roll numbers to PDF documents online free. Fast, secure, 100% in-browser with zero uploads.',
    h1: 'Add Page Numbers to PDF Online Free',
    introParagraph: 'Apni PDF files me page numbers, candidate roll number ya official footer stamp lagayein bina kisi watermark aur server upload ke.',
    bodyHtml: `
      <h2>Fast, Free & Secure PDF Page Numbering Online</h2>
      <p>Number your PDF pages in seconds for college projects, online exam document submissions, court filings, and official recruitment verification.</p>
      <ul>
        <li><strong>Flexible Pagination Formats:</strong> Choose from <code>Page 1 of N</code>, <code>1, 2, 3...</code>, or custom <code>Roll No: [XXXX] | Page [X]</code>.</li>
        <li><strong>Multiple Position Locations:</strong> Stamp numbers at Bottom Right, Bottom Center, Bottom Left, or Top Right.</li>
        <li><strong>Skip Cover Page:</strong> Set a custom starting page offset (e.g. start numbering from page 2).</li>
        <li><strong>100% Client-Side Privacy:</strong> Your PDF documents are modified directly in your browser without ever being uploaded to any server.</li>
      </ul>
    `,
    faqs: [
      { question: 'How do I add page numbers to a PDF for free?', answer: 'Upload your PDF to SizeSnap, choose your preferred format (e.g. Page 1 of N) and position (e.g. Bottom Right), then click Download.' },
      { question: 'Can I add my candidate roll number along with page numbers?', answer: 'Yes! Select the "Roll No + Page" style and type your exam roll number or candidate ID.' },
      { question: 'Does SizeSnap add watermarks to my numbered PDF?', answer: 'No. SizeSnap is 100% free and never adds any watermark or branding to your documents.' }
    ]
  },
  'self-attestation/self-attest-document': {
    metaTitle: 'Self Attested Document Maker Online Free (Add Signature & Date) | SizeSnap',
    metaDescription: 'Add "Self Attested" text, candidate signature and date on marksheet, certificate & Aadhaar card online free. Output under 100KB/200KB in JPG & A4 PDF.',
    h1: 'Self Attested Document & Marksheet Maker Online Free',
    introParagraph: 'College admission aur sarkari exam form ke liye marksheet, degree certificate ya Aadhaar card par "Self Attested" stamp, signature aur date lagayein bina print nikaale.',
    bodyHtml: `
      <h2>Create Official Self-Attested Documents Online in Seconds</h2>
      <p>Almost every Indian university admission, scholarship application, bank KYC, and sarkari exam verification (SSC, UPSC, State PSC) demands that you submit a <strong>"Self Attested"</strong> copy of your marksheet, passing certificate, and ID proof.</p>
      <ul>
        <li><strong>No Printer or Pen Needed:</strong> Avoid printing pages, signing physically, and scanning again with low quality.</li>
        <li><strong>Smart Attestation Stamp Box:</strong> Automatically adds "Self Attested", candidate signature, and current date stamp.</li>
        <li><strong>Flexible Placements:</strong> Place stamp on Bottom Right, Bottom Center, or Bottom Left of the document.</li>
        <li><strong>Strict File Size Guarantee:</strong> Compress to exact ≤100KB, ≤200KB or ≤300KB limits required by admission and recruitment portals.</li>
        <li><strong>Dual Export:</strong> Download both high-res JPG image and 1-page standard A4 PDF.</li>
      </ul>
    `,
    faqs: [
      { question: 'What is a self-attested document?', answer: 'A self-attested document is a photocopy or digital copy of an original document (such as 10th marksheet or Aadhaar card) signed by the owner with the text "Self Attested" and the current date to verify its authenticity.' },
      { question: 'How can I self attest my marksheet online without printing?', answer: 'Upload your marksheet image to SizeSnap, upload or type your signature, set the date, and click Download as JPG or A4 PDF under 200KB.' },
      { question: 'Is online self attestation safe for Aadhaar card?', answer: 'Yes, 100% safe. SizeSnap runs entirely inside your browser (Client-Side). No documents or personal details are uploaded to any server.' }
    ]
  },
  'document-grayscale/convert-to-black-and-white': {
    metaTitle: 'Convert Document & Marksheet to Black & White (Grayscale) Online Free | SizeSnap',
    metaDescription: 'Convert color marksheet and certificate photos to high contrast Black & White (Grayscale) online free. Compress under 50KB/100KB in JPG & A4 PDF.',
    h1: 'Convert Document to Black & White (Grayscale) Online Free',
    introParagraph: 'Sarkari forms ke liye color marksheet aur certificate photo ko official Black & White (Grayscale) me convert karein, background saaf karein aur exact 100KB me download karein.',
    bodyHtml: `
      <h2>Convert Color Documents to Official Black & White (Grayscale)</h2>
      <p>Many government job recruitment portals (such as UPSSSC, MPPEB, RPSC, Railway RRB, and State Police) specifically require candidates to upload <strong>Black & White / Grayscale scanned copies</strong> of marksheets and certificates under 100KB.</p>
      <ul>
        <li><strong>Official Grayscale & 1-Bit B&W:</strong> Remove color noise while boosting black text readability.</li>
        <li><strong>Paper Whitening & Brightness:</strong> Eliminates yellow paper tint and phone shadows.</li>
        <li><strong>Sharp Contrast Slider:</strong> Makes faded handwritten ink and seal stamps crystal clear.</li>
        <li><strong>Direct 50KB / 100KB Compressor:</strong> Ensures instant acceptance on state exam portals.</li>
      </ul>
    `,
    faqs: [
      { question: 'Why do government exam forms require Black & White documents?', answer: 'B&W (Grayscale) documents have smaller file sizes and cleaner text contrast, making them faster to verify on high-volume government servers.' },
      { question: 'How do I convert my color marksheet photo to B&W online?', answer: 'Upload your photo, select the "Official Grayscale" or "High Contrast Text" mode, adjust brightness/contrast if needed, and download in JPG or A4 PDF under 100KB.' },
      { question: 'Will text quality degrade during B&W conversion?', answer: 'No. SizeSnap enhances text edges and binarizes background pixels to ensure maximum readability.' }
    ]
  }
}

export function getPrettySlug(tool: string, variant: string): string | null {
  const mapping: Record<string, string> = {
    'resize-image/to-50kb': 'resize-image-to-50kb',
    'resize-image/to-20kb': 'resize-image-to-20kb',
    'resize-image/to-100kb': 'resize-image-to-100kb',
    'resize-image/to-200kb': 'resize-image-to-200kb',
    'resize-image/to-50kb-for-form': 'resize-image-to-50kb-for-form',
    'resize-image/to-50kb-for-whatsapp': 'resize-image-to-50kb-for-whatsapp',
    'resize-image/to-50kb-for-ssc-exam': 'resize-image-to-50kb-for-ssc-exam',
    'resize-image/to-50kb-without-losing-quality': 'resize-image-to-50kb-without-losing-quality',
    'compress-image/without-losing-quality': 'compress-image-without-losing-quality',
    'resize-image/reduce-without-blur': 'reduce-image-size-without-blur',
    'compress-image/to-50kb': 'compress-image-to-50kb',
    'passport-photo/ssc-exam': 'image-size-for-ssc-form',
    'passport-photo/ssc-mts': 'image-size-for-ssc-mts-exam',
    'signature-resize/ssc-mts-signature': 'resize-signature-for-ssc-mts',
    'passport-photo/upsc-exam': 'photo-size-for-upsc-form',
    'passport-photo/neet-exam': 'image-size-for-neet-form',
    'passport-photo/jee-main': 'image-size-for-jee-main',
    'passport-photo/ibps-exam': 'image-size-for-ibps-exam',
    'signature-resize/ibps-signature': 'resize-signature-for-ibps-exam',
    'signature-resize/neet-signature': 'resize-signature-for-neet',
    'signature-resize/jee-signature': 'resize-signature-for-jee',
    'passport-photo/rrb-ntpc': 'image-size-for-rrb-exam',
    'passport-photo/rrb-alp': 'image-size-for-rrb-alp-exam',
    'passport-photo/rrb-groupd': 'image-size-for-rrb-group-d',
    'passport-photo/sbi-bank': 'photo-size-for-sbi-form',
    'passport-photo/ctet-exam': 'image-size-for-ctet-form',
    'passport-photo/ssc-gd': 'image-size-for-ssc-gd',
    'passport-photo/upsssc-pet': 'photo-size-for-upsssc-pet',
    'signature-resize/rrb-signature': 'resize-signature-for-rrb',
    'signature-resize/rrb-alp-signature': 'resize-signature-for-rrb-alp',
    'signature-resize/rrb-groupd-signature': 'resize-signature-for-rrb-group-d',
    'signature-resize/sbi-signature': 'resize-signature-for-sbi',
    'signature-resize/ctet-signature': 'resize-signature-for-ctet',
    'signature-resize/ssc-gd-signature': 'resize-signature-for-ssc-gd',
    'signature-resize/upsssc-signature': 'resize-signature-for-upsssc',
    'resize-image/to-11kb': '11kb-converter',
    'passport-photo/indian-passport': 'passport-size-photo-maker',
    'compress-pdf/to-500kb': 'pdf-under-500kb',
    'compress-pdf/to-100kb': 'compress-pdf-to-100kb',
    'compress-pdf/to-200kb': 'compress-pdf-to-200kb',
    'compress-pdf/to-300kb': 'compress-pdf-to-300kb',
    'compress-pdf/to-150kb': 'compress-pdf-to-150kb',
    'compress-pdf/to-1mb': 'compress-pdf-to-1mb',
    'passport-photo/up-police-photo': 'photo-size-for-up-police-form',
    'passport-photo/bpsc-exam-photo': 'photo-size-for-bpsc-exam',
    'passport-photo/mppsc-exam-photo': 'photo-size-for-mppsc-form',
    'passport-photo/gate-exam': 'photo-size-for-gate-exam',
    'passport-photo/delhi-police-photo': 'photo-size-for-delhi-police-form',
    'passport-photo/pan-card': 'pan-card-photo-size',
    'signature-resize/ssc-signature': 'resize-signature-for-ssc',
    'signature-resize/upsc-signature': 'resize-signature-for-upsc',
    'signature-resize/pan-card-signature': 'resize-signature-for-pan-card',
    'resize-image/to-30kb': 'resize-image-to-30kb',
    'resize-image/to-15kb': 'resize-image-to-15kb',
    'whatsapp-dp/no-crop': 'whatsapp-dp-size-without-cropping',
    'word-to-pdf/convert': 'word-to-pdf',
    'watermark-image/add-text': 'add-name-and-date-on-photo-online',
    'dpi-converter/to-300': 'convert-image-to-300-dpi',
    'dpi-converter/to-200': 'convert-image-to-200-dpi',
    'card-joiner/aadhaar-merge': 'merge-aadhaar-card-front-and-back',
    'card-joiner/pan-merge': 'merge-pan-card-front-and-back',
    'postcard-photo/dsssb-postcard': 'dsssb-postcard-photo-resizer',
    'postcard-photo/neet-postcard': 'neet-postcard-photo-resizer',
    'document-enhancer/remove-shadow': 'remove-shadow-from-document',
    'document-enhancer/signature-sharpener': 'sharpen-scanned-signature',
    'split-pdf/extract-pages': 'split-pdf-extract-pages',
    'background-changer/to-white': 'change-photo-background-to-white',
    'background-changer/to-blue': 'change-photo-background-to-blue',
    'background-changer/to-transparent': 'remove-background-to-transparent',
    'ocr-text-extractor/from-marksheet': 'ocr-extract-text-from-marksheet',
    'ocr-text-extractor/from-image': 'image-to-text-converter',
    'pdf-protect/add-password': 'password-protect-pdf',
    'pdf-unlock/remove-password': 'unlock-pdf-remove-password',
    'pdf-rotate/organize-pages': 'rotate-and-reorder-pdf-pages',
    'crop-image/square-crop': 'crop-image-to-square',
    'crop-image/circle-crop': 'circle-crop-avatar',
    'exam-pack-generator/sarkari-exam-pack': 'sarkari-exam-pack-generator',
    'passport-print-sheet/passport-sheet-maker': 'passport-photo-print-sheet-maker',
    'photo-compliance-checker/photo-validator': 'photo-compliance-checker',
    'age-calculator/sarkari-exam': 'sarkari-exam-age-calculator',
    'dimension-resizer/in-cm': 'resize-image-in-cm-and-mm',
    'merge-pdf/combine': 'merge-pdf-online',
    'image-to-pdf/convert': 'jpg-to-pdf',
    'pdf-to-jpg/extract': 'pdf-to-jpg',
    'photo-clarifier/unblur-and-enhance': 'unblur-photo-and-marksheet',
    'photo-clarifier/enhance-marksheet': 'enhance-scanned-marksheet',
    'signature-extractor/transparent-signature': 'make-signature-transparent-and-convert-ink',
    'photo-name-date/add-name-date-stamp': 'add-name-and-date-on-photo-for-ssc',
    'photo-signature-joiner/photo-and-signature-joint': 'combine-photo-and-signature-for-exam',
    'marksheet-id-merger/merge-marksheet-and-aadhaar': 'merge-marksheet-and-aadhaar-card-pdf',
    'thumb-resizer/left-thumb-impression': 'thumb-impression-resizer-for-ssc-and-neet',
    'pdf-page-numberer/add-page-numbers-to-pdf': 'add-page-numbers-to-pdf-online',
    'self-attestation/self-attest-document': 'self-attested-document-maker-online',
    'document-grayscale/convert-to-black-and-white': 'convert-document-to-black-and-white',
    'compress-pdf/to-12kb': 'compress-pdf-to-12kb',
    'compress-pdf/to-15kb': 'compress-pdf-to-15kb',
    'compress-pdf/to-400kb': 'compress-pdf-to-400kb',
    'compress-pdf/custom-size': 'compress-pdf-to-custom-size'
  }
  return mapping[`${tool}/${variant}`] || null
}

export function getCustomSeo(tool: string, variant: string): CustomSeoData | null {
  return customSeoData[`${tool}/${variant}`] || null
}

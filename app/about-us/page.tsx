import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Free Image & PDF Resizing Tools | SizeSnap',
  description: 'Learn more about SizeSnap.in. We build free, fast, and secure client-side tools for sizing images and processing PDFs.'
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 prose prose-blue">
      <h1>About SizeSnap.in</h1>
      
      <p>Welcome to <strong>SizeSnap.in</strong>—an entirely free and incredibly fast toolkit designed to help you process, resize, and compress images and PDFs. Owned and built by Pawan Prajapati based out of India, our goal is simple: to provide internet users with the safest and fastest way to modify their digital files.</p>

      <h2>What do we do?</h2>
      <p>SizeSnap provides web-based tools that solve everyday digital utility problems. Whether you are applying for a government job, submitting university scholarship documents, or just trying to email a large PDF, rigid file size limits are always an annoying hurdle. SizeSnap removes that friction instantly by allowing you to dial in exact KB and MB thresholds for your files.</p>

      <h2>Why Choose Us?</h2>
      <ul>
        <li><strong>Uncompromising Privacy:</strong> Our absolute guarantee is this: <strong>No files are uploaded to any server</strong>. Most online converters force you to upload your sensitive documents to their servers. We don&apos;t. All scripts run 100% inside your browser using the HTML5 Canvas API and WebAssembly. Your files never touch our network.</li>
        <li><strong>Completely Free:</strong> There are no paywalls, no daily limits, no hidden features, and no login required.</li>
        <li><strong>No Watermarks:</strong> The files you create and download are entirely yours. We do not brand your edited images or generated PDFs.</li>
        <li><strong>Lightning Processing:</strong> Because there is no upload lag or server queue time, the processing happens locally on your machine—making it blazingly fast.</li>
      </ul>

      <h2>Who is this for?</h2>
      <p>This platform was meticulously designed for:</p>
      <ul>
        <li><strong>Students & Candidates:</strong> Submitting application portals (SSC, UPSC, NEET, Universities) that strictly demand 20KB to 50KB image and signature uploads.</li>
        <li><strong>Professionals:</strong> Dealing with strict email attachment limitations or e-filing payloads where PDFs must be reduced below a megabyte.</li>
        <li><strong>General Web Users:</strong> Anyone looking for a fast, no-nonsense utility that simply gets the job done securely in the quickest time possible.</li>
      </ul>
      <p>Instead of downloading bloated desktop software or risking privacy leaks on sketchy proxy servers, SizeSnap offers a precise, one-click solution directly in your browser.</p>
    </div>
  )
}

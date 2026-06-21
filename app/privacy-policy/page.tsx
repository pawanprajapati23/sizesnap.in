/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Secure Browser Processing | SizeSnap',
  description: 'Learn how SizeSnap.in protects your privacy. We process all files locally in your browser and do not upload your images or PDFs to any server.'
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 prose prose-blue">
      <h1>Privacy Policy</h1>
      <p>Last Updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Introduction</h2>
      <p>Welcome to SizeSnap.in ("we", "our", or "us"), owned by Pawan Prajapati. We respect your privacy and are committed to protecting it. SizeSnap.in provides free, browser-based utilities for compressing, resizing, and converting images and PDF files.</p>

      <h2>2. Absolute Privacy: No File Uploads</h2>
      <p><strong>This is the core foundation of our service:</strong> We do not store or upload user files. All file processing happens 100% locally on your device, within your web browser.</p>
      <ul>
        <li><strong>No files are uploaded to any server.</strong></li>
        <li><strong>All processing is done securely in your browser.</strong></li>
        <li>We cannot see, access, or analyze the files you process.</li>
        <li>No login or registration is required to use any of our tools.</li>
      </ul>

      <h2>3. Data Protection & Privacy Assurance</h2>
      <p>Because our scripts run entirely client-side, your personal documents (photos, signatures, IDs, PDFs) are inherently secure. Nothing is transmitted across our network regarding your file contents, ensuring unparalleled data protection.</p>

      <h2>4. Use of Cookies and Third-Party Services</h2>
      <p>While we do not store your physical files, we do use standard web technologies:</p>
      <ul>
        <li><strong>Cookies:</strong> We use cookies to improve your user experience and for website analytics.</li>
        <li><strong>Google AdSense / Advertisements:</strong> To keep this platform free, we use third-party advertising companies like Google AdSense to serve ads. These companies may use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to our website or other websites on the Internet to provide advertisements about goods and services of interest to you.</li>
        <li><strong>Analytics:</strong> We use analytics tools to monitor website performance and visitor statistics. This data is fully anonymized.</li>
      </ul>

      <h2>5. Opting Out of Ads</h2>
      <p>Users may opt out of personalized advertising by visiting Google's <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">AboutAds.info</a>.</p>

      <h2>6. Changes to This Policy</h2>
      <p>We may update our Privacy Policy periodically. We encourage users to frequently check this page for any changes. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p>

      <h2>7. Contact Us</h2>
      <p>If you have any questions or concerns regarding your privacy while using SizeSnap.in, please reach out directly via email to our owner:</p>
      <p><strong>Email:</strong> <a href="mailto:diplomawithbtech@gmail.com">diplomawithbtech@gmail.com</a></p>
    </div>
  )
}

/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | SizeSnap.in',
  description: 'Read the Terms of Service for using SizeSnap.in. Understand your rights and responsibilities while using our free online image and PDF processing tools.'
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 prose prose-blue">
      <h1>Terms of Service</h1>
      <p>Last Updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using SizeSnap.in (the "Website"), you accept and agree to be bound by the terms and provision of this agreement. SizeSnap.in is owned and operated by Pawan Prajapati.</p>

      <h2>2. Use of Service (Free Tool Disclaimer)</h2>
      <p>SizeSnap.in provides free online tools to resize, compress, and convert images and PDF files directly in your web browser. This service is provided <strong>"as is" and "as available"</strong> without any warranties of any kind. We do not charge users for the utilization of these tools.</p>

      <h2>3. User Responsibility & No File Storage</h2>
      <p>All processing is done securely in your browser. No files are uploaded to any server. Therefore, you are solely responsible for ensuring you have backups of your original files. Once a browser tab is closed, any unsaved processed files are immediately lost. You are completely responsible for the files you process and any consequences resulting from using modified files in official portals.</p>

      <h2>4. Limitation of Liability</h2>
      <p>In no event shall SizeSnap.in, Pawan Prajapati, or associated developers be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of our tools. We hold <strong>no liability for data loss</strong>, corrupted files, rejected application forms due to incorrect dimensions, or any financial/professional damages resulting from tool usage.</p>

      <h2>5. Service Availability</h2>
      <p>While we strive to provide excellent service, we do not guarantee continuous or uninterrupted availability of the site. We reserve the right to modify, pause, or discontinue any feature without prior notice.</p>

      <h2>6. Intellectual Property</h2>
      <p>All content on this website, including text, graphics, logos, and software structure, is the property of SizeSnap.in and protected by copyright laws. You may not duplicate, copy, or reuse any portion of the visual design or code without permission.</p>

      <h2>7. Modifications</h2>
      <p>We reserve the right to modify these terms at any time. Your continued use of the website after such modifications will constitute acknowledgment of the modified terms.</p>
    </div>
  )
}

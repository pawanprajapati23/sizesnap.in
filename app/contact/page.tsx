/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Support & Feedback | SizeSnap',
  description: 'Have a question, feedback, or feature request? Contact the SizeSnap.in support team. We generally respond to all inquiries within 24 to 48 hours.'
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 prose prose-blue">
      <h1>Contact Us</h1>
      
      <p>We'd love to hear from you. If you have questions, feedback, or feature requests regarding any of our image or PDF tools, please don't hesitate to reach out.</p>

      <h2>How to reach us</h2>
      <p>Whether you want to suggest a new tool, report a technical issue, or discuss a business/advertising proposal, please feel free to reach out. We aim to respond to all inquiries within 24-48 hours.</p>
      
      <div className="not-prose bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6 my-8">
        <div className="bg-blue-50 text-blue-600 p-4 rounded-full flex-shrink-0">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Website Owner</div>
          <div className="text-2xl font-bold text-gray-900 mb-3">Pawan Prajapati</div>
          <a href="mailto:diplomawithbtech@gmail.com" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
            diplomawithbtech@gmail.com
          </a>
        </div>
      </div>

      <h2>Report a Bug</h2>
      <p>If one of the tools isn't working perfectly, please let us know so we can fix it! It helps tremendously if you can include:</p>
      <ul>
        <li>The specific tool you were using (e.g., Image to 50KB or Passport Photo Maker)</li>
        <li>The browser you are using (e.g., Chrome, Firefox, Safari)</li>
        <li>Your operating system or device (e.g., Windows 11, Android phone, iPhone)</li>
        <li>A brief description of the issue occurring</li>
      </ul>

      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-8 italic text-gray-700">
        <p className="m-0">
          <strong>Important Note on Privacy:</strong> Because all files are processed locally via your browser, <strong>no files are uploaded to any server</strong>, meaning we do not have access to the files you were trying to convert. Therefore, we cannot recover or troubleshoot specific document files for you personally without you sending them.
        </p>
      </div>
    </div>
  )
}

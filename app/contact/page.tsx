/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | SizeSnap.in',
  description: 'Have a question or feedback? Contact the SizeSnap.in team.'
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 prose prose-blue">
      <h1>Contact Us</h1>
      
      <p>We'd love to hear from you. If you have questions, feedback, or feature requests regarding any of our image or PDF tools, please don't hesitate to reach out.</p>

      <h2>How to reach us</h2>
      <p>Whether you want to suggest a new tool, report an issue, or discuss a business/advertising proposal, you can email owner Pawan Prajapati directly at:</p>
      
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 font-semibold text-blue-900 text-lg text-center my-6">
        <a href="mailto:diplomawithbtech@gmail.com" className="no-underline text-blue-900 hover:text-blue-700">diplomawithbtech@gmail.com</a>
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

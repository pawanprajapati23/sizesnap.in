'use client'
import { useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, Send, ShieldAlert, Phone, Clock } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    try {
      if (db) {
        await addDoc(collection(db, 'user_feedback'), {
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Query',
          message: formData.message,
          timestamp: serverTimestamp(),
          read: false,
          source: 'sizesnap.in/contact'
        })
      }
      setStatus('submitted')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('Contact form error:', err)
      setErrorMsg('Something went wrong. Please email us directly at diplomawithbtech@gmail.com')
      setStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Contact Us &amp; Support
        </h1>
        <p className="max-w-xl mx-auto text-gray-500">
          Have a question, feedback, or feature request? Get in touch with the SizeSnap support team. We respond within 24 to 48 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" /> Website Owner Info
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between border-b pb-2">
                <span>Developer/Owner:</span>
                <span className="font-semibold text-gray-800">Pawan Prajapati</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Profession:</span>
                <span className="font-semibold text-gray-800">B.Tech Student &amp; SDE Aspirant</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Email:</span>
                <span className="font-semibold text-gray-800">diplomawithbtech@gmail.com</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Response Time:</span>
                <span className="font-semibold text-gray-800">24–48 hours</span>
              </div>
            </div>
            <a
              href="mailto:diplomawithbtech@gmail.com"
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-all text-center block text-sm border border-blue-100"
            >
              Email Directly
            </a>
          </div>

          <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 space-y-3">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-700" /> Privacy &amp; Data Note
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed m-0">
              Because all files are processed locally via your browser, <strong>no files are uploaded to any server</strong>. We do not store, see, or have access to any images or PDFs you compress. If a file fails to load or process, we cannot inspect it unless you choose to send it via email attachments.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Common Questions</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" /> My photo is not compressing to the right size</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" /> Report a tool bug or error</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" /> Request a new exam size / tool</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" /> Business / advertising queries</li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Send a Message</h3>

          {status === 'submitted' ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-600 border border-green-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Message Received! ✅</h4>
                <p className="text-sm text-gray-500 mt-1">Thank you for writing. We will review your query and reply to your email within 24–48 hours.</p>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="px-5 py-2 border border-gray-300 hover:border-gray-400 rounded-xl text-sm font-medium transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-sm transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-sm transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Feature request, bug, business query..."
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-sm transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your suggestions or details here..."
                  className="w-full min-h-[130px] p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 text-sm transition-all resize-none"
                  required
                />
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Send className="w-4 h-4" />
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-center text-[11px] text-gray-400">
                By submitting, you agree to our <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>. We never share your info.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

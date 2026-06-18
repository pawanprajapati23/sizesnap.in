'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQ { question: string; answer: string }
interface Props { faqs: FAQ[]; toolName: string }

export default function FaqSection({ faqs, toolName }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // JSON-LD schema for FAQs (SEO boost)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="font-semibold text-gray-800 mb-4">
        Frequently Asked Questions — {toolName}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-sm font-medium text-gray-800">{faq.question}</span>
              {openIndex === index
                ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
              }
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

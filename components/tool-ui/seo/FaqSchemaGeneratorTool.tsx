'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

export function FaqSchemaGeneratorTool() {
  const [faqs, setFaqs] = useState([{ q: '', a: '' }]);

  const addFaq = () => {
    setFaqs([...faqs, { q: '', a: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, key: 'q' | 'a', value: string) => {
    const updated = [...faqs];
    updated[index][key] = value;
    setFaqs(updated);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.filter(f => f.q.trim() && f.a.trim()).map(f => ({
      '@type': 'Question',
      name: f.q.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a.trim()
      }
    }))
  };

  let output = '';
  if (schema.mainEntity.length > 0) {
    output = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p><strong>Strict Warning:</strong> You must <strong>only</strong> use FAQ structured data for questions and answers that are visibly displayed on the page. Adding hidden FAQs is a violation of Google&apos;s spam policies.</p>
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800">FAQ Items</h3>
          <button onClick={addFaq} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded relative flex flex-col gap-3">
              {faqs.length > 1 && (
                <button onClick={() => removeFaq(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex flex-col gap-1.5 pr-6">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Question</label>
                <input type="text" value={faq.q} onChange={e => updateFaq(idx, 'q', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. Is SizeSnap free to use?" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Answer</label>
                <textarea value={faq.a} onChange={e => updateFaq(idx, 'a', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] h-20 resize-y" placeholder="Yes, it is 100% free." />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeOutput value={output} label="Generated FAQPage Schema" filename="faq-schema.json" minHeight="min-h-[250px]" />
    </div>
  );
}

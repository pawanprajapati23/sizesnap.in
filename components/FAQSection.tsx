import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: 'Is SizeSnap really free to use?',
      answer: 'Yes! SizeSnap is completely free. No hidden fees, no premium subscription, and no watermarks added to your files.'
    },
    {
      question: 'Do any files get uploaded to a server?',
      answer: 'No. All processing (image compression, resizing, PDF manipulation) happens 100% in the browser using WebAssembly and HTML5 APIs. Your files never leave your device.'
    },
    {
      question: 'Can I use SizeSnap for government exam photo requirements?',
      answer: 'Absolutely. We provide exact‑KB presets (10KB‑50KB) and tools to meet the strict size limits required by SSC, UPSC, NEET, and other Indian examination portals.'
    },
    {
      question: 'Is it safe for professional use?',
      answer: 'Yes. The app is client‑side only, contains no tracking pixels, and is built with modern security practices. You can also use it for business‑critical PDF compression without risking data leakage.'
    }
  ];

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
      <dl className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 rounded-md p-4 bg-[#FAFAFC]">
            <dt className="font-medium text-gray-800">{faq.question}</dt>
            <dd className="mt-2 text-sm text-gray-600">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default FAQSection;

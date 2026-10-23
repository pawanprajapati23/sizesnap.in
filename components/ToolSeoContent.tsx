import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, HelpCircle, ArrowRight } from 'lucide-react';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolFeature {
  title: string;
  desc: string;
}

export interface ToolSeoContentProps {
  title: string;
  subtitle?: string;
  description: string;
  howToSteps: string[];
  features?: ToolFeature[];
  faqs: ToolFaq[];
  keywords?: string[];
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
}

export function ToolSeoContent({
  title,
  subtitle,
  description,
  howToSteps,
  features,
  faqs,
  keywords,
  table,
}: ToolSeoContentProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Overview & How-To Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
            About {title} Online Free
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* How to use */}
        {howToSteps && howToSteps.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              How to Use {title} (Step-by-Step)
            </h2>
            <ol className="list-decimal list-inside space-y-2.5 text-sm text-gray-600 leading-relaxed">
              {howToSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Optional Data Table */}
        {table && (
          <div>
            {table.caption && (
              <h3 className="text-sm font-bold text-gray-800 mb-2">{table.caption}</h3>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {table.headers.map((h, i) => (
                      <th key={i} className="p-3 border border-gray-200 font-semibold text-gray-800">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {table.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-gray-50/50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 border border-gray-200">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Features Grid */}
        {features && features.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              Key Features &amp; Advantages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {features.map((feat, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50/80 border border-gray-100 rounded-[4px]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-0.5">{feat.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Related Search Queries
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                <h3 className="text-sm font-bold text-gray-800 mb-1">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

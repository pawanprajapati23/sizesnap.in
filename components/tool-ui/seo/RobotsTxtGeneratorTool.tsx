'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';
import { Settings2, Plus, Trash2 } from 'lucide-react';

interface RobotRule {
  agent: string;
  allow: string;
  disallow: string;
}

export function RobotsTxtGeneratorTool() {
  const [rules, setRules] = useState<RobotRule[]>([
    { agent: '*', allow: '/', disallow: '/api/' }
  ]);
  const [sitemap, setSitemap] = useState('');

  const addRule = () => {
    setRules([...rules, { agent: '*', allow: '', disallow: '' }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, key: keyof RobotRule, value: string) => {
    const updated = [...rules];
    updated[index][key] = value;
    setRules(updated);
  };

  let output = '';
  rules.forEach(rule => {
    if (!rule.agent) return;
    output += `User-agent: ${rule.agent}\n`;
    if (rule.allow) {
      rule.allow.split(',').forEach(a => {
        if (a.trim()) output += `Allow: ${a.trim()}\n`;
      });
    }
    if (rule.disallow) {
      rule.disallow.split(',').forEach(d => {
        if (d.trim()) output += `Disallow: ${d.trim()}\n`;
      });
    }
    output += '\n';
  });

  if (sitemap.trim()) {
    output += `Sitemap: ${sitemap.trim()}\n`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <p><strong>Note:</strong> robots.txt controls crawler access to prevent overloading your site, but it is <strong>not</strong> a reliable way to hide pages from Google. To properly remove a page from indexing, use a <code>noindex</code> meta tag.</p>
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-gray-800">Crawler Rules</h3>
            <button onClick={addRule} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>

          {rules.map((rule, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded relative">
              {rules.length > 1 && (
                <button onClick={() => removeRule(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">User-Agent</label>
                  <input type="text" value={rule.agent} onChange={e => updateRule(idx, 'agent', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="*" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Allow (Comma separated)</label>
                  <input type="text" value={rule.allow} onChange={e => updateRule(idx, 'allow', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="/public/" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Disallow (Comma separated)</label>
                  <input type="text" value={rule.disallow} onChange={e => updateRule(idx, 'disallow', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="/admin/" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 pt-4 border-t border-gray-100">
           <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Sitemap URL (Optional)</label>
           <input type="url" value={sitemap} onChange={e => setSitemap(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/sitemap.xml" />
        </div>
      </div>

      <CodeOutput value={output.trim()} label="robots.txt Output" filename="robots.txt" />
    </div>
  );
}

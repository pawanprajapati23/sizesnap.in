'use client';

import React, { useState, useEffect } from 'react';
import { TextOutput } from '../text/TextOutput';
import { Settings2, RefreshCw, AlertCircle } from 'lucide-react';

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "The early bird catches the worm.",
  "Actions speak louder than words.",
  "Beauty is in the eye of the beholder.",
  "Knowledge is power.",
  "Time is money.",
  "Where there is a will, there is a way.",
  "The pen is mightier than the sword.",
  "Practice makes perfect.",
  "Familiarity breeds contempt.",
  "Honesty is the best policy.",
  "Necessity is the mother of invention.",
  "Two wrongs do not make a right.",
  "When in Rome, do as the Romans do.",
  "A picture is worth a thousand words.",
  "Better late than never.",
  "Birds of a feather flock together."
];

export function RandomParagraphGeneratorTool() {
  const [count, setCount] = useState(3);
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [output, setOutput] = useState(() => { return [SENTENCES[Math.floor(Math.random() * SENTENCES.length)], SENTENCES[Math.floor(Math.random() * SENTENCES.length)]].join(' ') + '\n\n' + [SENTENCES[Math.floor(Math.random() * SENTENCES.length)]].join(' '); });

  const generateParagraph = (sentenceCount: number) => {
    let paragraph = [];
    for(let i = 0; i < sentenceCount; i++) {
      const idx = Math.floor(Math.random() * SENTENCES.length);
      paragraph.push(SENTENCES[idx]);
    }
    return paragraph.join(' ');
  };

  const generateText = () => {
    let result = '';
    const safeCount = Math.min(Math.max(1, count), 100); // Safe limit

    let sCount = 5;
    if (length === 'short') sCount = 3;
    if (length === 'long') sCount = 8;

    const paras = [];
    for(let i=0; i<safeCount; i++) {
      const actualSCount = sCount + Math.floor(Math.random() * 3) - 1;
      paras.push(generateParagraph(Math.max(1, actualSCount)));
    }
    result = paras.join('\n\n');
    setOutput(result);
  };



  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm mb-4">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>This tool generates random placeholder text using a curated list of famous proverbs and pangrams. It is <strong>not an AI essay writer</strong>.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /> Paragraphs</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-24 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            min="1"
            max="100"
          />
        </div>

        <div className="flex flex-col gap-1.5 border-l border-gray-100 pl-4">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Length</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <div className="flex items-end h-full mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-4 pt-4 sm:pt-0">
          <button
            onClick={generateText}
            className="flex items-center gap-2 px-4 py-2 bg-[#414FA8] text-white rounded hover:bg-[#343f88] transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Generate
          </button>
        </div>
      </div>

      <TextOutput value={output} label="Random Content" />
    </div>
  );
}

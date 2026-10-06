'use client';

import React, { useState, useEffect } from 'react';
import { TextOutput } from '../text/TextOutput';
import { Settings2, RefreshCw } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
  'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

function generateSentence(wordCount: number) {
  let sentence = [];
  for(let i = 0; i < wordCount; i++) {
    const r = Math.floor(Math.random() * LOREM_WORDS.length);
    let word = LOREM_WORDS[r];
    if (i === 0) word = word.charAt(0).toUpperCase() + word.slice(1);
    sentence.push(word);
  }
  return sentence.join(' ') + '.';
}

function generateParagraph(sentenceCount: number) {
  let paragraph = [];
  for(let i = 0; i < sentenceCount; i++) {
    const len = Math.floor(Math.random() * 10) + 5;
    paragraph.push(generateSentence(len));
  }
  return paragraph.join(' ');
}

export function LoremIpsumGeneratorTool() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState(() => { return generateParagraph(5) + '\n\n' + generateParagraph(6) + '\n\n' + generateParagraph(4); });

  const generateText = () => {
    let result = '';
    const safeCount = Math.min(Math.max(1, count), 10000); // Safe limit to prevent freezing

    if (type === 'paragraphs') {
      const paras = [];
      for(let i=0; i<safeCount; i++) {
        paras.push(generateParagraph(Math.floor(Math.random() * 4) + 4));
      }
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sents = [];
      for(let i=0; i<safeCount; i++) {
        sents.push(generateSentence(Math.floor(Math.random() * 10) + 5));
      }
      result = sents.join(' ');
    } else if (type === 'words') {
      const words = [];
      for(let i=0; i<safeCount; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      result = words.join(' ');
      if (result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1) + '.';
      }
    }

    setOutput(result);
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /> Generate</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-24 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
              min="1"
              max="10000"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
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

      <TextOutput value={output} label="Generated Dummy Text" />
    </div>
  );
}

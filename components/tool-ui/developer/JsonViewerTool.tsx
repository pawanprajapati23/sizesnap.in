'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { ChevronRight, ChevronDown } from 'lucide-react';

// Recursive Node Component
const JsonNode = ({ k, value, isLast }: { k?: string, value: any, isLast: boolean }) => {
  const [expanded, setExpanded] = useState(true);

  if (value === null) {
    return <div>{k && <span className="text-blue-400 font-semibold">{k}: </span>}<span className="text-gray-400">null</span>{!isLast && ','}</div>;
  }

  if (typeof value === 'boolean') {
    return <div>{k && <span className="text-blue-400 font-semibold">{k}: </span>}<span className="text-orange-400">{value ? 'true' : 'false'}</span>{!isLast && ','}</div>;
  }

  if (typeof value === 'number') {
    return <div>{k && <span className="text-blue-400 font-semibold">{k}: </span>}<span className="text-emerald-400">{value}</span>{!isLast && ','}</div>;
  }

  if (typeof value === 'string') {
    return <div>{k && <span className="text-blue-400 font-semibold">{k}: </span>}<span className="text-amber-300">&quot;{value}&quot;</span>{!isLast && ','}</div>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <div>{k && <span className="text-blue-400 font-semibold">{k}: </span>}[]{!isLast && ','}</div>;
    }
    return (
      <div className="flex flex-col">
        <div className="flex items-center cursor-pointer hover:bg-white/5 w-fit rounded pr-2" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronDown className="w-3 h-3 text-gray-500 mr-1" /> : <ChevronRight className="w-3 h-3 text-gray-500 mr-1" />}
          {k && <span className="text-blue-400 font-semibold">{k}: </span>}
          <span className="text-gray-300">[ {expanded ? '' : `... ${value.length} items ]${!isLast ? ',' : ''}`}</span>
        </div>
        {expanded && (
          <div className="pl-6 border-l border-gray-700/50 ml-1.5 my-0.5">
            {value.map((v, i) => <JsonNode key={i} value={v} isLast={i === value.length - 1} />)}
          </div>
        )}
        {expanded && <div>]<span className="text-gray-300">{!isLast && ','}</span></div>}
      </div>
    );
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return <div>{k && <span className="text-blue-400 font-semibold">{k}: </span>}{`{}`}{!isLast && ','}</div>;
    }
    return (
      <div className="flex flex-col">
        <div className="flex items-center cursor-pointer hover:bg-white/5 w-fit rounded pr-2" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronDown className="w-3 h-3 text-gray-500 mr-1" /> : <ChevronRight className="w-3 h-3 text-gray-500 mr-1" />}
          {k && <span className="text-blue-400 font-semibold">{k}: </span>}
          <span className="text-gray-300">{`{`} {expanded ? '' : `... ${keys.length} keys }${!isLast ? ',' : ''}`}</span>
        </div>
        {expanded && (
          <div className="pl-6 border-l border-gray-700/50 ml-1.5 my-0.5">
            {keys.map((key, i) => <JsonNode key={key} k={key} value={value[key]} isLast={i === keys.length - 1} />)}
          </div>
        )}
        {expanded && <div>{`}`}<span className="text-gray-300">{!isLast && ','}</span></div>}
      </div>
    );
  }

  return null;
};

export function JsonViewerTool() {
  const [input, setInput] = useState('');

  let parsedJson = null;
  let error = null;

  if (input.trim()) {
    try {
      parsedJson = JSON.parse(input);
    } catch (e: any) {
      error = e.message || 'Invalid JSON format';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste JSON here to view tree..." label="Raw JSON" />

        <div className={`w-full rounded-[4px] border shadow-xs flex flex-col overflow-hidden ${error ? 'border-red-800 bg-[#3A1D1D]' : 'border-gray-800 bg-[#1E1E1E]'}`}>
          <div className={`px-4 py-2 border-b ${error ? 'border-red-900 bg-[#4A2323]' : 'border-gray-700 bg-[#252526]'}`}>
            <label className={`text-xs font-semibold uppercase tracking-wider ${error ? 'text-red-300' : 'text-gray-300'}`}>
              {error ? 'Error' : 'Interactive Viewer'}
            </label>
          </div>
          <div className="w-full p-4 overflow-auto text-sm font-mono leading-relaxed min-h-[300px] text-[#D4D4D4] whitespace-pre">
            {error ? (
               <span className="text-red-200">{error}</span>
            ) : parsedJson !== null ? (
               <JsonNode value={parsedJson} isLast={true} />
            ) : (
               <span className="text-gray-500 italic">Tree will appear here...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

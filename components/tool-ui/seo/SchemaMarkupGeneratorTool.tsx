'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';

export function SchemaMarkupGeneratorTool() {
  const [type, setType] = useState('WebSite');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  // Specific fields
  const [logo, setLogo] = useState('');
  const [publisher, setPublisher] = useState('');

  let schema: any = {
    '@context': 'https://schema.org',
  };

  if (type === 'WebSite') {
    schema['@type'] = 'WebSite';
    if (name) schema.name = name;
    if (url) schema.url = url;
    if (description) schema.description = description;
  } else if (type === 'WebPage') {
    schema['@type'] = 'WebPage';
    if (name) schema.name = name;
    if (url) schema.url = url;
    if (description) schema.description = description;
  } else if (type === 'Organization') {
    schema['@type'] = 'Organization';
    if (name) schema.name = name;
    if (url) schema.url = url;
    if (logo) schema.logo = logo;
  } else if (type === 'Article') {
    schema['@type'] = 'Article';
    if (name) schema.headline = name;
    if (description) schema.description = description;
    if (publisher) schema.publisher = { '@type': 'Organization', name: publisher };
  } else if (type === 'Product') {
    schema['@type'] = 'Product';
    if (name) schema.name = name;
    if (description) schema.description = description;
  }

  // Common UI states missing from generic
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');

  // Recompute inside render block since hooks can't be conditional.
  // We'll mutate the base schema above safely.
  if (type === 'Article') {
    if (image) schema.image = image;
    if (author) schema.author = { '@type': 'Person', name: author };
  } else if (type === 'Product') {
    if (image) schema.image = image;
  }

  const output = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <p><strong>Note:</strong> Schema markup helps search engines understand your content. Do not provide fake data (e.g., fake aggregate ratings) or you may incur a manual penalty from Google.</p>
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
         <div className="flex flex-col gap-1.5 border-b pb-4">
           <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Schema Type</label>
           <select value={type} onChange={e => setType(e.target.value)} className="w-full sm:w-64 bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
             <option value="WebSite">WebSite</option>
             <option value="WebPage">WebPage</option>
             <option value="Organization">Organization</option>
             <option value="Article">Article</option>
             <option value="Product">Product</option>
           </select>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Name / Title</label>
             <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="Enter title or name..." />
           </div>

           {(type === 'WebSite' || type === 'WebPage' || type === 'Organization') && (
             <div className="flex flex-col gap-1.5 md:col-span-2">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">URL</label>
               <input type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com" />
             </div>
           )}

           {(type === 'WebSite' || type === 'WebPage' || type === 'Article' || type === 'Product') && (
             <div className="flex flex-col gap-1.5 md:col-span-2">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</label>
               <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] h-20 resize-y" placeholder="Brief description..." />
             </div>
           )}

           {type === 'Organization' && (
             <div className="flex flex-col gap-1.5 md:col-span-2">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Logo URL</label>
               <input type="url" value={logo} onChange={e => setLogo(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/logo.png" />
             </div>
           )}

           {(type === 'Article' || type === 'Product') && (
             <div className="flex flex-col gap-1.5 md:col-span-2">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Image URL</label>
               <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/image.jpg" />
             </div>
           )}

           {type === 'Article' && (
             <>
               <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Author Name</label>
                 <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="John Doe" />
               </div>
               <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Publisher Name</label>
                 <input type="text" value={publisher} onChange={e => setPublisher(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="News Corp" />
               </div>
             </>
           )}
        </div>
      </div>

      <CodeOutput value={output} label="Generated JSON-LD" filename="schema.json" minHeight="min-h-[250px]" />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';

export function PackingSlipGeneratorTool() {
  const [orderNo, setOrderNo] = useState('ORD-1001');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [storeName, setStoreName] = useState('My Store');
  const [shipTo, setShipTo] = useState('John Doe\n123 Main St\nApt 4B\nNew York, NY 10001');
  const [items, setItems] = useState([
    { id: '1', sku: 'TSHIRT-RED', desc: 'Red T-Shirt', qty: '2' },
    { id: '2', sku: 'MUG-BLU', desc: 'Blue Ceramic Mug', qty: '1' }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), sku: '', desc: '', qty: '1' }]);
  };

  const updateItem = (id: string, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const downloadPdf = async () => {
    setIsProcessing(true);
    try {
      // Dynamic import to avoid heavy bundle
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(storeName || 'Store Name', 14, 20);

      doc.setFontSize(16);
      doc.setTextColor(100);
      doc.text("PACKING SLIP", 14, 30);

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont("helvetica", "normal");
      doc.text(`Order Number: ${orderNo}`, 14, 45);
      doc.text(`Date: ${orderDate}`, 14, 50);

      doc.setFont("helvetica", "bold");
      doc.text("Ship To:", 14, 65);
      doc.setFont("helvetica", "normal");
      const splitAddress = doc.splitTextToSize(shipTo, 80);
      doc.text(splitAddress, 14, 70);

      let startY = 100;

      // Table Header
      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 240, 240);
      doc.rect(14, startY - 5, 182, 8, 'F');
      doc.text("SKU", 16, startY);
      doc.text("Description", 60, startY);
      doc.text("Qty", 180, startY, { align: "right" });

      doc.setFont("helvetica", "normal");
      startY += 10;

      for (const item of items) {
        if (!item.desc && !item.sku) continue;
        doc.text(item.sku, 16, startY);

        const splitDesc = doc.splitTextToSize(item.desc, 110);
        doc.text(splitDesc, 60, startY);

        doc.text(item.qty.toString(), 180, startY, { align: "right" });

        startY += (splitDesc.length * 5) + 3;

        if (startY > 280) {
          doc.addPage();
          startY = 20;
        }
      }

      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("Thank you for your business!", 105, 290, { align: "center" });

      doc.save(`Packing-Slip-${orderNo}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-8">

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div>
               <label className="text-sm font-bold text-gray-700 block mb-1">Store / Company Name</label>
               <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:ring-[#414FA8] focus:border-[#414FA8]" />
             </div>
             <div>
               <label className="text-sm font-bold text-gray-700 block mb-1">Order Number</label>
               <input type="text" value={orderNo} onChange={e => setOrderNo(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:ring-[#414FA8] focus:border-[#414FA8]" />
             </div>
             <div>
               <label className="text-sm font-bold text-gray-700 block mb-1">Order Date</label>
               <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:ring-[#414FA8] focus:border-[#414FA8]" />
             </div>
          </div>

          <div>
             <label className="text-sm font-bold text-gray-700 block mb-1">Ship To Address</label>
             <textarea
               value={shipTo}
               onChange={e => setShipTo(e.target.value)}
               rows={6}
               className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:ring-[#414FA8] focus:border-[#414FA8] resize-none"
             ></textarea>
          </div>
       </div>

       <div>
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <h3 className="font-bold text-gray-800">Order Items</h3>
            <button onClick={addItem} className="text-sm text-[#414FA8] font-bold flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          <div className="space-y-3">
             {items.map((item, i) => (
               <div key={item.id} className="flex gap-3 items-start">
                  <input
                    type="text" value={item.sku} onChange={e => updateItem(item.id, 'sku', e.target.value)}
                    placeholder="SKU" className="w-1/4 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#414FA8]"
                  />
                  <input
                    type="text" value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)}
                    placeholder="Description" className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#414FA8]"
                  />
                  <input
                    type="number" value={item.qty} min="1" onChange={e => updateItem(item.id, 'qty', e.target.value)}
                    className="w-20 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#414FA8]"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className="mt-1 p-2 text-gray-400 hover:text-red-500 rounded disabled:opacity-30 disabled:hover:text-gray-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             ))}
          </div>
       </div>

       <div className="pt-4 border-t border-gray-100">
         <button
           onClick={downloadPdf}
           disabled={isProcessing}
           className="w-full flex items-center justify-center gap-2 py-3 bg-[#414FA8] text-white font-bold rounded-lg hover:bg-[#343f88] transition-colors disabled:opacity-50"
         >
           <Download className="w-5 h-5" />
           {isProcessing ? 'Generating PDF...' : 'Download Packing Slip (PDF)'}
         </button>
       </div>

    </div>
  );
}

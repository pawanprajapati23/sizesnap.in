export default function PayPalDonate() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm mt-8">
      <div className="text-center md:text-left flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Support Our Free Tools ☕</h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
          We provide these tools completely free without any watermarks or limits. 
          If this tool helped you today, please consider a small donation to help keep our servers running!
        </p>
      </div>
      
      {/* Donation Card */}
      <div className="flex-shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center gap-3 w-full sm:w-auto min-w-[200px] shadow-sm">
        
        {/* QR Code for Indian Users */}
        <div className="w-24 h-24 bg-white p-1 rounded-lg border border-gray-200 shadow-sm mx-auto flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/upi-qr.jpg" alt="UPI QR Code" className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center leading-tight">
          Scan to Donate<br/>(India Only)
        </p>

        <div className="w-full h-px bg-gray-200 my-1"></div>

        {/* PayPal for International */}
        <form action="https://www.paypal.com/ncp/payment/QHT392F2ZNXS6" method="post" target="_blank" className="w-full flex flex-col items-center">
          <input 
            type="submit" 
            value="Donate via PayPal" 
            className="w-full bg-[#FFD140] hover:bg-[#FFC400] text-black font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
          />
          <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider text-center mt-2">
            Global Users
          </p>
        </form>

      </div>
    </div>
  )
}

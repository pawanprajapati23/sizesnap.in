export default function PayPalDonate() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="text-center md:text-left flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Support Our Free Tools ☕</h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We provide these tools completely free without any watermarks or limits. 
          If this tool saved you time today, consider donating to help us keep the servers running and tools ad-light!
        </p>
      </div>
      
      <div className="flex-shrink-0 w-full md:w-auto bg-gray-50 p-5 rounded-xl border border-gray-100 flex justify-center">
        <style dangerouslySetInnerHTML={{__html: `
          .pp-QHT392F2ZNXS6 {
            text-align: center;
            border: none;
            border-radius: 0.5rem;
            min-width: 11.625rem;
            padding: 0 2rem;
            height: 2.75rem;
            font-weight: bold;
            background-color: #FFD140;
            color: #000000;
            font-family: "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
            line-height: 1.25rem;
            cursor: pointer;
            transition: transform 0.2s ease, background-color 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .pp-QHT392F2ZNXS6:hover {
            transform: translateY(-1px);
            background-color: #FFC400;
          }
        `}} />
        <form action="https://www.paypal.com/ncp/payment/QHT392F2ZNXS6" method="post" target="_blank" style={{ display: 'inline-grid', justifyItems: 'center', alignContent: 'start', gap: '0.75rem' }}>
          <input className="pp-QHT392F2ZNXS6" type="submit" value="Donate via PayPal" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
          <section style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-2px' }}>
            Powered by 
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" style={{ height: '0.875rem', verticalAlign: 'middle', marginLeft: '0.25rem' }} />
          </section>
        </form>
      </div>
    </div>
  )
}

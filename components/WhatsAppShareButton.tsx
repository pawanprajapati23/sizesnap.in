'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

interface WhatsAppShareProps {
  url?: string;
  title?: string;
  message?: string;
  className?: string;
}

export function WhatsAppShareButton({
  url,
  title = 'SizeSnap - Free Image & PDF Tool',
  message,
  className = '',
}: WhatsAppShareProps) {
  const handleShare = () => {
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://www.sizesnap.in');
    const shareText = message
      ? `${message}\n${currentUrl}`
      : `🔥 ${title} - Free, exact KB size, zero server uploads:\n${currentUrl}`;

    const encoded = encodeURIComponent(shareText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[4px] bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xs transition-colors cursor-pointer ${className}`}
      title="Share with friends or WhatsApp study groups"
    >
      {/* WhatsApp SVG Icon */}
      <svg
        className="h-3.5 w-3.5 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.996.586 3.864 1.603 5.441L2 22l4.673-1.554c1.517.927 3.284 1.455 5.358 1.455 5.535 0 10.031-4.496 10.031-10.031S17.566 2 12.031 2zm0 18.25c-1.789 0-3.468-.535-4.887-1.455l-.35-.228-2.775.923.923-2.705-.228-.363c-.998-1.589-1.554-3.444-1.554-5.391 0-4.509 3.669-8.178 8.178-8.178s8.178 3.669 8.178 8.178-3.669 8.178-8.178 8.178zm4.48-6.132c-.246-.123-1.455-.718-1.68-.801-.226-.082-.39-.123-.554.123s-.637.801-.78 1.047c-.144.246-.287.267-.533.144-.246-.123-1.041-.384-1.983-1.224-.734-.654-1.23-1.462-1.374-1.708-.144-.246-.015-.379.108-.502.111-.111.246-.287.369-.431.123-.144.164-.246.246-.41.082-.164.041-.308-.02-.431s-.554-1.334-.759-1.827c-.2-.48-.403-.414-.554-.422l-.472-.008c-.164 0-.431.062-.656.308-.226.246-.862.842-.862 2.053s.883 2.381 1.006 2.545c.123.164 1.737 2.653 4.208 3.719.588.254 1.047.406 1.405.52.591.188 1.128.161 1.553.098.473-.07 1.455-.595 1.66-1.169.205-.574.205-1.066.144-1.169-.062-.102-.226-.164-.472-.287z" />
      </svg>
      <span>Share on WhatsApp</span>
    </button>
  );
}

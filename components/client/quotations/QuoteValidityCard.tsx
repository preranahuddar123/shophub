'use client';

import React from 'react';

interface QuoteValidityCardProps {
  validUntil: string;
  validityNote?: string;
}

export default function QuoteValidityCard({
  validUntil,
  validityNote,
}: QuoteValidityCardProps) {
  return (
    <div className="bg-[#FAF7F2] rounded-[24px] p-5 relative border border-black/[0.04] shadow-xs overflow-hidden">
      {/* Red Left Accent Curve matching Screenshot 2 */}
      <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#DC2626] rounded-r-full" />

      <div className="pl-3">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#DC2626] block mb-1.5">
          QUOTE VALIDITY
        </span>
        <p className="text-xs text-gray-700 leading-relaxed font-normal">
          {validityNote || `Valid until ${validUntil}. Prices may shift after this date based on vendor availability.`}
        </p>
      </div>
    </div>
  );
}

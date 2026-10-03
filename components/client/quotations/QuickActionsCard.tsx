'use client';

import React, { useState } from 'react';

interface QuickActionsCardProps {
  pdfUrl?: string;
  quoteUrl?: string;
  onRequestChanges: () => void;
  onShareQuote?: () => void;
}

export default function QuickActionsCard({
  pdfUrl,
  quoteUrl,
  onRequestChanges,
  onShareQuote,
}: QuickActionsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (onShareQuote) {
      onShareQuote();
      return;
    }
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(quoteUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('PDF download will begin shortly.');
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-black/[0.04] shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-gray-950 mb-4">
        QUICK ACTIONS
      </h3>

      <div className="space-y-3">
        {/* Open Live Design Quote (Direct Link) */}
        {quoteUrl && (
          <a
            href={quoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FAF7F2] hover:bg-[#F2ECE1] text-gray-950 text-xs font-bold py-3.5 px-4 rounded-full border border-[#E8E1D5] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer no-underline shadow-2xs"
          >
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>View Live Quote Link</span>
          </a>
        )}

        {/* Download PDF Quote */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full bg-black hover:bg-zinc-800 text-white text-xs font-bold py-3.5 px-4 rounded-full shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF Quote</span>
        </button>

        {/* Request Changes */}
        <button
          type="button"
          onClick={onRequestChanges}
          className="w-full bg-white hover:bg-[#FAF7F2] text-gray-800 text-xs font-bold py-3 px-4 rounded-full border border-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Request Changes</span>
        </button>

        {/* Share Quote */}
        <button
          type="button"
          onClick={handleShare}
          className="w-full bg-white hover:bg-[#FAF7F2] text-gray-800 text-xs font-bold py-3 px-4 rounded-full border border-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer relative"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{copied ? 'Link Copied to Clipboard!' : 'Share Quote'}</span>
        </button>
      </div>
    </div>
  );
}

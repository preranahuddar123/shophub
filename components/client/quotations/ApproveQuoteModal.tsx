'use client';

import React, { useState } from 'react';
import { ActiveQuoteDetail } from '@/lib/client/types';

interface ApproveQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: ActiveQuoteDetail;
  onConfirmApprove: () => Promise<void>;
}

export default function ApproveQuoteModal({
  isOpen,
  onClose,
  quote,
  onConfirmApprove,
}: ApproveQuoteModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!agreed) return;
    try {
      setIsSubmitting(true);
      await onConfirmApprove();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#FFF7F7] border border-[#DC2626]/20 text-[#DC2626] flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-950 tracking-tight">
          Approve Quotation
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {quote.quoteNumber} • Revision {quote.revision}
        </p>

        {/* Amount Card */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 my-5 border border-black/[0.04]">
          <div className="flex justify-between items-center text-sm mb-1 text-gray-600">
            <span>Total Approved Value</span>
            <span className="text-xl font-black text-gray-950">
              {quote.financialSummary.totalAmountFormatted}
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            Includes all materials, carpentry fabrication, and installation taxes.
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <label className="flex items-start gap-3 text-xs text-gray-700 cursor-pointer select-none mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded text-[#DC2626] focus:ring-[#DC2626] cursor-pointer"
          />
          <span>
            I confirm approval of revision <strong>{quote.revision}</strong> for project execution and authorize procurement of specified items.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!agreed || isSubmitting}
            onClick={handleConfirm}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              agreed && !isSubmitting
                ? 'bg-[#B91C1C] hover:bg-[#991B1B] active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <span>Confirm & Approve</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

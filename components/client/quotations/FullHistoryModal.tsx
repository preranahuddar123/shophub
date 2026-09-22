'use client';

import React from 'react';
import { QuotationSummaryItem } from '@/lib/client/types';

interface FullHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotations: QuotationSummaryItem[];
  onSelectQuote: (quoteNum: string) => void;
}

export default function FullHistoryModal({
  isOpen,
  onClose,
  quotations,
  onSelectQuote,
}: FullHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] max-w-xl w-full p-6 sm:p-7 shadow-2xl relative select-none max-h-[90vh] flex flex-col"
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

        {/* Header */}
        <div className="shrink-0 mb-5 pr-8">
          <span className="text-[10.5px] font-bold text-[#DC2626] uppercase tracking-widest block">
            ESTIMATE TIMELINE
          </span>
          <h3 className="text-xl font-bold text-gray-950 tracking-tight mt-0.5">
            Full Quotation History
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Complete lifecycle of revisions generated for your project.
          </p>
        </div>

        {/* History Timeline */}
        <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-1">
          {quotations.map((q, idx) => (
            <div
              key={q.id || q.quoteNumber}
              onClick={() => {
                onSelectQuote(q.quoteNumber);
                onClose();
              }}
              className="p-4 rounded-2xl border border-gray-100 hover:border-black/20 hover:bg-[#FAF7F2] transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-950 text-sm">{q.quoteNumber}</span>
                  <span className="bg-[#EDE8DF] text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                    {q.revision}
                  </span>
                  {idx === 0 && (
                    <span className="bg-[#DC2626] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      Latest
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">Issued on {q.dateIssued}</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-sm text-gray-950">{q.totalAmountFormatted}</div>
                <div className="text-xs font-medium mt-0.5">
                  {q.status === 'Pending Approval' && <span className="text-[#DC2626]">Pending Approval</span>}
                  {q.status === 'Approved' && <span className="text-[#65783A]">Approved</span>}
                  {q.status === 'Expired' && <span className="text-gray-400">Expired</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 pt-4 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

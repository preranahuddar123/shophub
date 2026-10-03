'use client';

import React from 'react';
import { ActiveQuoteDetail } from '@/lib/client/types';

interface DetailedComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: ActiveQuoteDetail;
}

export default function DetailedComparisonModal({
  isOpen,
  onClose,
  quote,
}: DetailedComparisonModalProps) {
  if (!isOpen) return null;

  const comp = quote.revisionComparison;
  const isSingleVersion =
    !comp ||
    !comp.comparedWith ||
    comp.comparedWith === 'None' ||
    !comp.keyChanges ||
    comp.keyChanges.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative select-none max-h-[90vh] flex flex-col"
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
        <div className="shrink-0 mb-4 pr-8">
          <span className="text-[10.5px] font-bold text-[#DC2626] uppercase tracking-widest block">
            COMPARISON REPORT
          </span>
          <h3 className="text-xl font-bold text-gray-950 tracking-tight mt-0.5">
            {isSingleVersion ? `Quotation ${quote.revision}` : `Revision ${quote.revision} vs ${comp.comparedWith}`}
          </h3>
          {!isSingleVersion && (
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
              <span>Overall Variance:</span>
              <span className="font-bold text-[#DC2626]">{comp.priceVarianceFormatted}</span>
            </div>
          )}
        </div>

        {/* Changes List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 my-2 pr-1">
          {isSingleVersion ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              <p className="font-semibold text-gray-700">Initial Project Baseline</p>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                This is the initial finalized project quotation. When design changes or room modifications are requested, comparative revisions and price variance tracking will appear here.
              </p>
            </div>
          ) : (
            comp.keyChanges.map((change) => (
              <div key={change.id} className="py-3.5 flex items-start gap-3">
                {change.type === 'add' && (
                  <div className="w-6 h-6 rounded-full border border-[#15803D] text-[#15803D] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    +
                  </div>
                )}
                {change.type === 'remove' && (
                  <div className="w-6 h-6 rounded-full border border-[#DC2626] text-[#DC2626] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    -
                  </div>
                )}
                {change.type === 'upgrade' && (
                  <div className="w-6 h-6 rounded-full border border-[#DC2626] text-[#DC2626] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ⇄
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-gray-950">
                      {change.title}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-400 capitalize">
                      {change.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {change.subtitle}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="shrink-0 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Quote #{quote.quoteNumber}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}

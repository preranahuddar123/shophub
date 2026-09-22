'use client';

import React from 'react';
import { QuotationRevisionComparison } from '@/lib/client/types';

interface CompareRevisionsCardProps {
  comparison: QuotationRevisionComparison;
  onViewDetailedReport: () => void;
}

export default function CompareRevisionsCard({
  comparison,
  onViewDetailedReport,
}: CompareRevisionsCardProps) {
  const isSingleVersion =
    !comparison ||
    !comparison.comparedWith ||
    comparison.comparedWith === 'None' ||
    !comparison.keyChanges ||
    comparison.keyChanges.length === 0;

  if (isSingleVersion) {
    return (
      <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-black/[0.04] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-gray-950">
            COMPARE REVISIONS
          </h3>
          <span className="text-[11px] font-bold text-[#65783A] bg-[#F4EFE6] px-2.5 py-0.5 rounded-full">
            Initial Version
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mt-2 font-medium">
          This is the initial finalized project quotation. When design revisions or scope updates are submitted, comparative price variance and item modifications will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-black/[0.04] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-gray-950">
          COMPARE REVISIONS
        </h3>
        <span className="text-xs font-bold text-[#DC2626]">
          vs {comparison.comparedWith}
        </span>
      </div>

      {/* Price Variance Row */}
      <div className="flex items-center justify-between py-1">
        <span className="text-xs font-medium text-gray-600">Price Variance</span>
        <div className={`flex items-center gap-1 font-black text-sm ${comparison.isIncrease ? 'text-[#DC2626]' : 'text-[#15803D]'}`}>
          {comparison.isIncrease ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span>{comparison.priceVarianceFormatted}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-4" />

      {/* Key Changes Section */}
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3.5">
          KEY CHANGES
        </span>

        <div className="space-y-3.5">
          {comparison.keyChanges.map((change) => (
            <div key={change.id} className="flex items-start gap-3">
              {/* Plus / Minus / Upgrade Icon */}
              {change.type === 'add' && (
                <div className="w-5 h-5 rounded-full border border-[#15803D] text-[#15803D] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
              {change.type === 'remove' && (
                <div className="w-5 h-5 rounded-full border border-[#DC2626] text-[#DC2626] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </div>
              )}
              {change.type === 'upgrade' && (
                <div className="w-5 h-5 rounded-full border border-[#DC2626] text-[#DC2626] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="text-xs font-bold text-gray-900 leading-snug">
                  {change.title}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {change.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link at Bottom */}
        <button
          type="button"
          onClick={onViewDetailedReport}
          className="text-xs font-bold text-[#DC2626] hover:text-[#991B1B] hover:underline cursor-pointer block mt-5 transition-colors text-left"
        >
          View Detailed Comparison Report
        </button>
      </div>
    </div>
  );
}

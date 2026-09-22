'use client';

import React from 'react';
import { MilestonePaymentSummaryData } from '@/lib/client/types';

interface PaymentSummaryCardProps {
  summary?: MilestonePaymentSummaryData;
  onPayClick?: () => void;
  showActions?: boolean;
  className?: string;
}

export default function PaymentSummaryCard({
  summary,
  onPayClick,
  showActions = true,
  className = '',
}: PaymentSummaryCardProps) {
  if (!summary) return null;

  const rows: {
    label: string;
    value: string;
    isPrimary?: boolean;
    isMuted?: boolean;
    isBold?: boolean;
  }[] = [
    {
      label: 'Total Quotation Value (latest)',
      value: summary.totalQuotationValueFormatted,
      isBold: true,
    },
    {
      label: summary.cumulativePercentLabel,
      value: summary.cumulativeTargetFormatted,
    },
    {
      label: 'Total Paid Till Now',
      value: summary.alreadyPaidFormatted,
    },
    {
      label: 'Amount to Collect Now',
      value: summary.amountToCollectNowFormatted,
      isPrimary: true,
    },
    {
      label: 'Remaining Project Balance',
      value: summary.remainingBalanceFormatted,
      isBold: true,
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-[#DDCDC1] bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      {/* Header with Title and Red Quote Tag */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-1 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF0101]" />
          <h4 className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#32261C]">
            Payment Summary
          </h4>
        </div>
        {summary.quoteNum && (
          <span className="text-xs font-bold text-[#EF0101] tracking-wide font-mono bg-[#FDF2F2] px-2.5 py-0.5 rounded-md border border-[#FCDAD7]">
            {summary.quoteNum}
          </span>
        )}
      </div>

      {/* Official Design Module Milestone Notice */}
      {summary.stageNote && (
        <div className="mb-4 text-xs leading-relaxed text-[#4A3E36] bg-[#FAF7F2] border border-[#DDCDC1]/70 rounded-xl px-3.5 py-2.5">
          {summary.stageNote}
        </div>
      )}

      {/* Breakdown Rows */}
      <div className="space-y-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-3 text-xs py-1.5 px-2 rounded-lg transition-colors ${
              row.isPrimary
                ? 'bg-[#FDF6F0] border border-[#F0DDCF] text-[#32261C]'
                : ''
            }`}
          >
            <span
              className={`${
                row.isPrimary
                  ? 'font-bold text-[#32261C]'
                  : row.isBold
                  ? 'font-medium text-gray-800'
                  : 'text-gray-500'
              }`}
            >
              {row.label}
            </span>
            <span
              className={`tabular-nums ${
                row.isPrimary
                  ? 'font-black text-[15px] text-[#EF0101]'
                  : row.isBold
                  ? 'font-bold text-gray-950 text-sm'
                  : 'font-semibold text-gray-700'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-5 pt-3 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center gap-2.5">
          {summary.amountToCollectNow > 0 ? (
            <button
              type="button"
              onClick={onPayClick}
              className="w-full sm:flex-1 bg-black hover:bg-zinc-800 text-white font-bold text-xs py-3 px-4 rounded-full transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pay {summary.amountToCollectNowFormatted} Now</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (
            <div className="w-full sm:flex-1 py-2.5 px-3.5 rounded-full bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Current Stage Dues Cleared (60% Paid)
              </span>
            </div>
          )}

          <a
            href={
              summary.quoteUrl ||
              (summary.quoteId
                ? `https://design.hubinterior.com/quote/${summary.quoteId}`
                : '#')
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center text-xs font-bold text-gray-800 hover:text-black py-3 px-5 rounded-full border border-gray-300 hover:border-gray-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            View Quote
          </a>
        </div>
      )}
    </div>
  );
}

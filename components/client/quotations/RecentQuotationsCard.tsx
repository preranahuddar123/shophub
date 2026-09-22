'use client';

import React from 'react';
import { QuotationSummaryItem } from '@/lib/client/types';

interface RecentQuotationsCardProps {
  quotations: QuotationSummaryItem[];
  selectedQuoteNumber: string;
  onSelectQuote: (quoteNumber: string) => void;
}

export default function RecentQuotationsCard({
  quotations,
  selectedQuoteNumber,
  onSelectQuote,
}: RecentQuotationsCardProps) {
  return (
    <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-black/[0.04] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-black uppercase tracking-[0.18em] text-gray-900">
          RECENT QUOTATIONS
        </h2>
        <span className="bg-[#DC2626] text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-xs">
          {quotations.length}
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-[#FAF7F2] text-[11px] font-bold text-gray-500 uppercase tracking-wider rounded-xl overflow-hidden">
              <th className="py-3 px-5 rounded-l-xl">QUOTE #</th>
              <th className="py-3 px-4">DATE ISSUED</th>
              <th className="py-3 px-4">REVISION</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">TOTAL AMOUNT</th>
              <th className="py-3 px-5 rounded-r-xl w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80 text-sm">
            {quotations.map((q) => {
              const isSelected = q.quoteNumber === selectedQuoteNumber;

              return (
                <tr
                  key={q.id || q.quoteNumber}
                  onClick={() => onSelectQuote(q.quoteNumber)}
                  className={`cursor-pointer transition-all duration-150 group ${
                    isSelected
                      ? 'bg-[#FAF7F2]/80 font-medium'
                      : 'hover:bg-[#FAF7F2]/40'
                  }`}
                >
                  {/* Quote Number */}
                  <td className="py-4 px-5 font-bold text-gray-950">
                    <span className="group-hover:text-[#DC2626] transition-colors">
                      {q.quoteNumber}
                    </span>
                  </td>

                  {/* Date Issued */}
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {q.dateIssued}
                  </td>

                  {/* Revision Badge */}
                  <td className="py-4 px-4">
                    <span className="inline-block bg-[#F2EDE4] text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                      {q.revision}
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {q.status === 'Pending Approval' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                          <span className="font-bold text-[#DC2626]">
                            Pending Approval
                          </span>
                        </>
                      )}
                      {q.status === 'Approved' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#65783A] shrink-0" />
                          <span className="font-bold text-[#65783A]">
                            Approved
                          </span>
                        </>
                      )}
                      {(q.status === 'Expired' || q.status === 'Superseded') && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                          <span className="font-medium text-gray-500">
                            {q.status}
                          </span>
                        </>
                      )}
                      {q.status !== 'Pending Approval' && q.status !== 'Approved' && q.status !== 'Expired' && q.status !== 'Superseded' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                          <span className="font-medium text-gray-500">
                            {q.status}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-4 px-4 text-right font-black text-gray-950 text-[15px]">
                    {q.totalAmountFormatted}
                  </td>

                  {/* Right Arrow Chevron */}
                  <td className="py-4 px-5 text-right text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all">
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

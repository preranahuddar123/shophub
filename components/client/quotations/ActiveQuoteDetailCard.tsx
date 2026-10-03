'use client';

import React, { useState } from 'react';
import { ActiveQuoteDetail } from '@/lib/client/types';

interface ActiveQuoteDetailCardProps {
  quote: ActiveQuoteDetail;
  onApproveClick: () => void;
  isApproved?: boolean;
}

export default function ActiveQuoteDetailCard({
  quote,
  onApproveClick,
  isApproved = false,
}: ActiveQuoteDetailCardProps) {
  // Manage accordion states: initially living and kitchen open, others collapsed
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    quote.rooms.forEach((r, idx) => {
      initial[r.id] = r.defaultExpanded !== undefined ? r.defaultExpanded : idx < 2;
    });
    return initial;
  });

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const currentStatus = isApproved ? 'Approved' : quote.status;

  return (
    <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-black/[0.04] shadow-sm flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
              Active Quote Detail
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {quote.revisionLabel || `${quote.quoteNumber} • Revision ${quote.revision}`}
            </p>
          </div>

          {/* Action: Approve Quote Button */}
          {currentStatus === 'Approved' ? (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] text-[#65783A] text-xs font-bold border border-[#65783A]/20 shadow-xs self-start sm:self-auto">
              <svg className="w-4 h-4 text-[#65783A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Quote Approved</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onApproveClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Approve Quote</span>
            </button>
          )}
        </div>

        {/* Room Accordions List */}
        <div className="space-y-4 mb-8">
          {quote.rooms.map((room) => {
            const isOpen = expandedRooms[room.id] ?? false;

            return (
              <div
                key={room.id}
                className="border border-[#EFECE6] rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
              >
                {/* Room Header Strip (Warm Cream / Beige) */}
                <button
                  type="button"
                  onClick={() => toggleRoom(room.id)}
                  className="w-full bg-[#F4EFE6] hover:bg-[#EFE9DD] px-5 py-3.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    {/* Room Category Icon */}
                    {room.icon === 'living' && (
                      <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 11V7a3 3 0 013-3h10a3 3 0 013 3v4M4 11a3 3 0 00-3 3v4a2 2 0 002 2h18a2 2 0 002-2v-4a3 3 0 00-3-3M4 11h16M7 19v2M17 19v2" />
                      </svg>
                    )}
                    {room.icon === 'kitchen' && (
                      <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M5 18h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {room.icon === 'bedroom' && (
                      <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v11M21 7v11M3 13h18M5 13V9a2 2 0 012-2h10a2 2 0 012 2v4M7 10h.01M17 10h.01" />
                      </svg>
                    )}
                    {room.icon !== 'living' && room.icon !== 'kitchen' && room.icon !== 'bedroom' && (
                      <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}

                    <span className="font-bold text-sm text-gray-950 tracking-tight">
                      {room.roomName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-gray-950">
                      {room.totalAmountFormatted}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Room Items List */}
                {isOpen && (
                  <div className="divide-y divide-gray-100 bg-white">
                    {room.items.map((item) => (
                      <div
                        key={item.id}
                        className="px-6 py-3.5 flex items-center justify-between text-sm hover:bg-gray-50/50 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-gray-900 leading-snug">
                            {item.name}
                          </div>
                          {item.category && (
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {item.category}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-gray-950 ml-4 whitespace-nowrap">
                          {item.priceFormatted}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Summary Strip at Bottom */}
      <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.16em] block">
            FINANCIAL SUMMARY
          </span>
          <p className="text-xs text-gray-500 mt-1 font-normal">
            {quote.financialSummary.note || 'Includes all materials, labor, and taxes.'}
          </p>
        </div>

        <div className="text-right space-y-1 sm:min-w-[200px]">
          <div className="flex items-center justify-between sm:justify-end gap-6 text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-800">
              {quote.financialSummary.subtotalFormatted}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 text-sm text-gray-600">
            <span>Tax ({quote.financialSummary.taxPercent}%)</span>
            <span className="font-semibold text-gray-800">
              {quote.financialSummary.taxAmountFormatted}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-black text-gray-950">
              {quote.financialSummary.totalAmountFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import PaymentSummaryCard from './PaymentSummaryCard';
import { MilestonePaymentSummaryData } from '@/lib/client/types';

interface PaymentSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: MilestonePaymentSummaryData;
  onPayNow?: () => void;
}

export default function PaymentSummaryModal({
  isOpen,
  onClose,
  summary,
  onPayNow,
}: PaymentSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-black/[0.06] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4">
          <div className="text-[11px] font-bold text-[#DC2626] uppercase tracking-[0.16em]">
            Milestone 03 • 10% Payment
          </div>
          <h3 className="text-xl font-extrabold text-gray-950 tracking-tight mt-0.5">
            Milestone Payment Details
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Complete details from the Design Module latest quotation and prior sales payments.
          </p>
        </div>

        <PaymentSummaryCard
          summary={summary}
          onPayClick={onPayNow || onClose}
          showActions={true}
        />
      </div>
    </div>
  );
}

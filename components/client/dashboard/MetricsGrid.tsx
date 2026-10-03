'use client';

import React, { useState } from 'react';
import { useClientDashboard } from '@/lib/client/ClientDashboardContext';
import {
  CompletionRingIcon,
  FlagIcon,
  WalletCardIcon,
} from '../icons/ClientIcons';
import PaymentSummaryModal from './PaymentSummaryModal';

export default function MetricsGrid() {
  const { data, isLoading } = useClientDashboard();
  const metrics = data.metrics;
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {metrics.map((metric) => {
          const isPayment = metric.type === 'payment';

          return (
            <div
              key={metric.title}
              onClick={() => {
                if (isPayment) setShowPaymentModal(true);
              }}
              className={`bg-white rounded-[28px] p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-black/[0.03] flex flex-col justify-between min-h-[140px] transition-all ${
                isPayment
                  ? 'cursor-pointer hover:shadow-[0_8px_30px_-4px_rgba(220,38,38,0.12)] hover:border-red-100 group'
                  : 'hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.06)]'
              }`}
            >
              {/* Header with Title and Optional Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-bold text-gray-500 tracking-[0.14em] uppercase">
                  {metric.title}
                </span>
                {metric.type === 'completion' && (
                  <CompletionRingIcon className="w-5 h-5" />
                )}
                {metric.type === 'milestone' && (
                  <FlagIcon className="w-4 h-4 text-[#DC2626]" />
                )}
                {isPayment && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#DC2626] transition-colors">
                      Breakdown
                    </span>
                    <WalletCardIcon className="w-5 h-5 text-[#DC2626]" />
                  </div>
                )}
              </div>

              {/* Value & Extra widgets */}
              <div className="mt-4">
                {isLoading ? (
                  <div className="h-8 w-28 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <div className="text-2xl sm:text-[28px] font-extrabold text-gray-950 tracking-tight truncate">
                    {metric.value}
                  </div>
                )}

                {/* Subtext e.g. Remaining: ₹9,99,959 */}
                {metric.subtext && !isLoading && (
                  <div className="mt-1.5 text-xs text-gray-500 font-medium tracking-tight">
                    {metric.subtext}
                  </div>
                )}

                {metric.type === 'completion' && (
                  <div className="mt-2.5 w-full bg-[#EFECE6] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#DC2626] h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${metric.percentage ?? 65}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Payment Summary Modal */}
      {data.paymentSummary && (
        <PaymentSummaryModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          summary={data.paymentSummary}
        />
      )}
    </>
  );
}

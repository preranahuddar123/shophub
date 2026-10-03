'use client';

import React from 'react';
import { ProjectReadinessItem } from '@/lib/client/types';

interface ExecutionReadinessCardProps {
  items: ProjectReadinessItem[];
}

export default function ExecutionReadinessCard({ items }: ExecutionReadinessCardProps) {
  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-black/[0.04]">
      {/* Card Header */}
      <h3 className="text-[11.5px] font-black uppercase tracking-[0.18em] text-gray-500 mb-6">
        Execution Readiness
      </h3>

      {/* Progress Items */}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.name}>
            {/* Title & Percentage */}
            <div className="flex items-center justify-between text-xs sm:text-[13px] font-extrabold text-gray-900 mb-2">
              <span className="tracking-tight">{item.name}</span>
              <span className="tabular-nums text-[#DC2626] font-extrabold text-sm">
                {item.percentage}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-[#EFEAE1] h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-[#DC2626] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            {/* Subtext description with checkmark */}
            <div className="flex items-center gap-1.5 text-[11.5px] text-gray-500 font-medium leading-tight">
              {item.isComplete && (
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-[9px] font-bold">
                  ✓
                </span>
              )}
              <span className={item.isComplete ? 'text-gray-600' : 'text-gray-500'}>
                {item.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

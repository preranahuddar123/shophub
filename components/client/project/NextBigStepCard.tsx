'use client';

import React from 'react';

interface NextBigStepCardProps {
  title?: string;
  startDate?: string;
}

export default function NextBigStepCard({
  title = 'Hardwood Flooring Polish',
  startDate = 'Starting June 24, 2024',
}: NextBigStepCardProps) {
  return (
    <div className="bg-[#0F0E0E] text-white rounded-[32px] p-6 sm:p-7 relative overflow-hidden shadow-md flex flex-col justify-between min-h-[170px]">
      {/* Background Architectural Blueprint Watermark */}
      <div className="absolute -right-4 -bottom-6 w-36 h-36 opacity-10 pointer-events-none text-white">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 85V45L50 15L85 45V85H15Z" />
          <path d="M35 85V55H65V85" />
          <path d="M42 35H58" />
          <path d="M50 27V43" />
        </svg>
      </div>

      <div className="relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-1">
          NEXT BIG STEP
        </span>
        <h4 className="text-xl sm:text-[23px] font-extrabold text-white tracking-tight leading-snug">
          {title}
        </h4>
      </div>

      <div className="relative z-10 mt-4">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-200">
          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{startDate}</span>
        </div>
      </div>
    </div>
  );
}

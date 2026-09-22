'use client';

import React from 'react';
import Link from 'next/link';
import { useClientDashboard } from '@/lib/client/ClientDashboardContext';

export default function UpcomingActions() {
  const { data } = useClientDashboard();
  const actions = data.upcomingActions;

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-black/[0.03] flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight">
          Upcoming Actions
        </h3>
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          {actions.length} Pending
        </span>
      </div>

      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        {actions.map((action) => {
          const content = (
            <div className="bg-[#FAF7F2] hover:bg-[#F5F1E8] transition-colors rounded-2xl p-4 flex items-start gap-3.5 cursor-pointer group w-full">
              {/* Icon Avatar */}
              {action.type === 'quote' && (
                <div className="w-9 h-9 rounded-full bg-[#231F20] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
              )}

              {action.type === 'material' && (
                <div className="w-9 h-9 rounded-full bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {action.type === 'payment' && (
                <div className="w-9 h-9 rounded-full bg-[#FCE8E5] text-[#DC2626] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </div>
              )}

              {action.type === 'appointment' && (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-sm font-bold text-gray-950 group-hover:text-black">
                    {action.title}
                  </div>
                  {action.actionText && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] shrink-0">
                      {action.actionText} →
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 font-normal mt-0.5 leading-snug">
                  {action.subtitle}
                </div>
              </div>
            </div>
          );

          if (action.href) {
            if (action.isExternal) {
              return (
                <a
                  key={action.id}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                >
                  {content}
                </a>
              );
            }
            return (
              <Link key={action.id} href={action.href} className="block no-underline">
                {content}
              </Link>
            );
          }

          return <div key={action.id}>{content}</div>;
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ProjectTimelineMilestone } from '@/lib/client/types';

interface TimelineMilestonesCardProps {
  milestones: ProjectTimelineMilestone[];
  onViewSchedule?: () => void;
}

export default function TimelineMilestonesCard({
  milestones,
  onViewSchedule,
}: TimelineMilestonesCardProps) {
  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-black/[0.04]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-1">
        <h3 className="text-xl sm:text-[23px] font-extrabold text-gray-950 tracking-tight">
          Timeline & Milestones
        </h3>
        <button
          type="button"
          onClick={onViewSchedule}
          className="text-xs font-bold text-[#DC2626] hover:text-red-700 transition-colors inline-flex items-center gap-1 group"
        >
          <span>View Full Schedule</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-1">
        {milestones.map((milestone, idx) => {
          const isLast = idx === milestones.length - 1;
          const isCompleted = milestone.status === 'completed';
          const isActive = milestone.status === 'active';

          return (
            <div key={milestone.id} className="relative flex items-start gap-4 pb-7 last:pb-0">
              {/* Vertical Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute left-[11px] top-6 bottom-0 w-[2px] ${
                    isCompleted
                      ? 'bg-[#DC2626]'
                      : isActive
                      ? 'border-l-2 border-dashed border-[#DC2626]'
                      : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Node Icon */}
              <div className="relative z-10 flex items-center justify-center shrink-0 mt-0.5">
                {isCompleted && (
                  <div className="w-[22px] h-[22px] rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                    ✓
                  </div>
                )}

                {isActive && (
                  <div className="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-[#DC2626] ring-4 ring-[#DC2626]/20 flex items-center justify-center shadow-xs animate-pulse" />
                )}

                {!isCompleted && !isActive && (
                  <div className="w-[22px] h-[22px] rounded-full bg-[#E5E0D8] border border-gray-300" />
                )}
              </div>

              {/* Milestone Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={`text-sm tracking-tight ${
                      isActive
                        ? 'font-bold text-[#DC2626]'
                        : isCompleted
                        ? 'font-bold text-gray-900'
                        : 'font-semibold text-gray-600'
                    }`}
                  >
                    {milestone.title}
                  </h4>

                  {/* Right Badges */}
                  <div className="text-right shrink-0">
                    {isActive ? (
                      <div>
                        <span className="inline-block bg-[#DC2626] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          Active Phase
                        </span>
                        {milestone.estCompletion && (
                          <span className="text-[10px] font-semibold text-gray-400 block mt-0.5">
                            {milestone.estCompletion}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block bg-[#F4EFE6] text-gray-600 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full">
                        {milestone.date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 font-normal mt-1 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

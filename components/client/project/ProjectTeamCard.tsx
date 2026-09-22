'use client';

import React from 'react';
import { ProjectTeamContact } from '@/lib/client/types';

interface ProjectTeamCardProps {
  teamContacts: ProjectTeamContact[];
  onContactClick?: (contact: ProjectTeamContact) => void;
}

// Helper to generate initials from person's name
function getInitials(name: string): string {
  if (!name) return 'H';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Sophisticated role-tailored color accents for initials avatars
function getRoleBadgeStyle(role: string): string {
  const r = (role || '').toUpperCase();
  if (r.includes('DESIGNER')) {
    return 'bg-[#FFF1EE] text-[#C2410C] border-[#FDBA74]/50 ring-2 ring-[#FFF1EE]'; // Warm terracotta / designer
  }
  if (r.includes('RELATIONSHIP') || (r.includes('MANAGER') && !r.includes('PROJECT'))) {
    return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]/60 ring-2 ring-[#FFFBEB]'; // Warm golden amber
  }
  if (r.includes('PROJECT') || r.includes('SITE') || r.includes('ENGINEER')) {
    return 'bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]/60 ring-2 ring-[#F0FDF4]'; // Sage / forest green
  }
  return 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]/60 ring-2 ring-[#F8FAFC]'; // Slate stone
}

export default function ProjectTeamCard({
  teamContacts,
  onContactClick,
}: ProjectTeamCardProps) {
  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col justify-between">
      <div>
        <h3 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight mb-5">
          Your Project Team
        </h3>

        {/* Team Member Rows */}
        <div className="space-y-4">
          {teamContacts.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#FAF7F2] transition-colors"
            >
              {/* Initials Avatar and Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full border flex items-center justify-center font-bold text-sm tracking-wider shadow-xs shrink-0 select-none transition-transform hover:scale-105 ${getRoleBadgeStyle(
                    member.role
                  )}`}
                  title={member.name}
                >
                  {getInitials(member.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 tracking-tight truncate">
                    {member.name}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5 truncate">
                    {member.role}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {member.actionType === 'email' && (
                  <a
                    href={`mailto:${member.email || 'design@hubinterior.com'}`}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                    title={`Email ${member.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <polyline points="3 7 12 13 21 7" />
                    </svg>
                  </a>
                )}

                {member.actionType === 'call' && (
                  <a
                    href={`tel:${member.phone || '+918861464757'}`}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                    title={`Call ${member.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                )}

                {member.actionType === 'chat' && (
                  <button
                    type="button"
                    onClick={() => onContactClick?.(member)}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                    title={`Chat with ${member.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Policy Callout Box */}
      <div className="mt-5 p-3.5 rounded-2xl bg-[#F8F4ED] border border-[#E8E1D3]/80 flex items-start gap-2.5">
        <div className="w-4 h-4 rounded-full bg-[#DC2626] text-white flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">
          i
        </div>
        <p className="text-[11px] text-gray-600 leading-snug">
          Your team is on-site <span className="font-semibold text-gray-800">Mon–Sat, 9 AM – 6 PM</span>. Emergency support is available 24/7.
        </p>
      </div>
    </div>
  );
}

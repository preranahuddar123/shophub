'use client';

import React from 'react';
import { LatestDesignRevision } from '@/lib/client/types';

interface LatestRevisionCardProps {
  revision?: LatestDesignRevision;
}

export default function LatestRevisionCard({
  revision = {
    fileName: 'Project_Final_V4.pdf',
    fileSize: '12.4 MB',
    updatedText: 'Updated yesterday • 12.4 MB',
    downloadUrl: '#',
  },
}: LatestRevisionCardProps) {
  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-black/[0.04]">
      <h3 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight mb-4">
        Latest Design Revision
      </h3>

      {/* PDF Download Attachment Box */}
      <a
        href={revision.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        download={revision.fileName}
        className="flex items-center justify-between p-4 rounded-2xl border border-[#E5E0D8] bg-[#FBF9F5] hover:bg-[#F5EFE6] transition-all group no-underline"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Red PDF Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] text-[#DC2626] flex items-center justify-center shrink-0 border border-[#F8D0CC] shadow-2xs">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-1v-2h1c.55 0 1 .45 1 1s-.45 1-1 1zm5 2h-1v-4h1c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1zm-8.5-5h2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5H6v-5zm6 0h2.5c1.38 0 2.5 1.12 2.5 2.5v2c0 1.38-1.12 2.5-2.5 2.5H12v-7zm6 2h-2v1h1.5v1H16v2h-1.5v-5H18v1z" />
            </svg>
          </div>

          {/* Details */}
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 group-hover:text-black tracking-tight truncate">
              {revision.fileName}
            </div>
            <div className="text-[11px] font-medium text-gray-500 mt-0.5 truncate">
              {revision.updatedText}
            </div>
          </div>
        </div>

        {/* Download Action Icon */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-black transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
      </a>
    </div>
  );
}

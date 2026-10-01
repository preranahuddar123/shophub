'use client';

/**
 * ==============================================================================
 * COMPONENT: components/brands/BrandsSidebar.tsx
 * PURPOSE: Left ERP Sidebar Navigation (Offerings Pro / ENTERPRISE EDITION)
 * ==============================================================================
 * DESIGN & LAYOUT:
 * - 1:1 match with user's screenshot: light gray background (`#EBECEF`),
 *   "Offerings Pro" logo mark, "ENTERPRISE EDITION" badge.
 * - Active pill on "CATEGORIES" / "Brands", inactive links for Offerings, Pricing, etc.
 * - Bottom "VIEW REPORTS" action button.
 * ==============================================================================
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BrandsSidebarProps {
  onOpenReports?: () => void;
}

export default function BrandsSidebar({ onOpenReports }: BrandsSidebarProps) {

  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#EBECEF] min-h-screen flex flex-col fixed left-0 top-0 z-30 border-r border-[#E0E2E7]">
      {/* Top Branding */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3">
          {/* Black rounded square logo */}
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-xs flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-extrabold text-gray-950 tracking-tight leading-tight">
              Offerings<br />Pro
            </div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              ENTERPRISE EDITION
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5">
        {/* Master Catalog */}
        <Link
          href="/offerings"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-950 hover:bg-gray-200/50 transition-colors tracking-wide"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>MASTER CATALOG</span>
        </Link>

        {/* Categories / Brands (Active in screenshot) */}
        <Link
          href="/brands"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold bg-black text-white shadow-xs tracking-wide transition-all"
        >
          {/* 3 circular nodes arranged in triangle / cluster */}
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="6" r="3" fill="currentColor" />
            <circle cx="6" cy="18" r="3" fill="currentColor" />
            <circle cx="18" cy="18" r="3" fill="currentColor" />
            <line x1="12" y1="9" x2="6" y2="15" stroke="white" strokeWidth="1.5" />
            <line x1="12" y1="9" x2="18" y2="15" stroke="white" strokeWidth="1.5" />
            <line x1="9" y1="18" x2="15" y2="18" stroke="white" strokeWidth="1.5" />
          </svg>
          <span>CATEGORIES</span>
        </Link>

        {/* Import */}
        <Link
          href="/import"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-950 hover:bg-gray-200/50 transition-colors tracking-wide"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>IMPORT</span>
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-950 hover:bg-gray-200/50 transition-colors tracking-wide"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>SETTINGS</span>
        </Link>
      </nav>

      {/* Bottom Button (from Screenshot 2) */}
      <div className="p-4">
        <button
          onClick={onOpenReports}
          className="w-full bg-white hover:bg-gray-50 border border-gray-200/90 rounded-xl px-4 py-2.5 shadow-xs flex items-center gap-2.5 transition-all text-left group"
        >
          <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="12" width="4" height="8" rx="1" />
            <rect x="10" y="6" width="4" height="14" rx="1" />
            <rect x="17" y="2" width="4" height="18" rx="1" />
          </svg>
          <span className="text-[11px] font-bold text-gray-800 tracking-wider uppercase group-hover:text-black">
            VIEW REPORTS
          </span>
        </button>
      </div>
    </aside>
  );
}

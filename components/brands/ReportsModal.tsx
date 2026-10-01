'use client';

/**
 * ==============================================================================
 * COMPONENT: components/brands/ReportsModal.tsx
 * PURPOSE: Catalog Analytics & Portfolio Reports Modal Dialog
 * ==============================================================================
 * TRIGGERED BY:
 * - The "VIEW REPORTS" button at the bottom of the left sidebar (BrandsSidebar).
 *
 * FUNCTIONALITY:
 * - Summarizes total catalog size, active offerings, country diversity, and
 *   pending approvals with visual progress bars and metrics.
 * ==============================================================================
 */

import React from 'react';
import { BrandStats } from '@/lib/db/homesmerry';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: BrandStats;
}

export default function ReportsModal({ isOpen, onClose, stats }: ReportsModalProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="12" width="4" height="8" rx="1" />
                <rect x="10" y="6" width="4" height="14" rx="1" />
                <rect x="17" y="2" width="4" height="18" rx="1" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-black text-gray-950 tracking-tight">Master Catalog Reports</h3>
              <p className="text-[11px] text-gray-500">Enterprise Brand Portfolio & Distribution Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Global Network
              </div>
              <div className="text-xl font-black text-gray-900">
                {stats?.countriesCount || 32} Countries
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Top sourcing from Italy, Sweden, Germany & Spain
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Active Offerings Rate
              </div>
              <div className="text-xl font-black text-emerald-600">
                98.8%
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {stats?.activeOfferingsFormatted || '42.5k'} items in stock
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-[11px] font-bold text-gray-700 mb-2">Regional Sourcing Distribution</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Europe (Italy, Sweden, Germany, Spain)</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-black h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Asia Pacific (India, Japan)</span>
                  <span>24%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>North America & Others</span>
                  <span>8%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-5 mt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}

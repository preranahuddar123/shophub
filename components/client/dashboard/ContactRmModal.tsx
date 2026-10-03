'use client';

import React from 'react';
import Image from 'next/image';
import { useClientDashboard } from '@/lib/client/ClientDashboardContext';

export default function ContactRmModal() {
  const { isContactModalOpen, closeContactModal, data } = useClientDashboard();

  if (!isContactModalOpen) return null;

  const rm = data.team.relationshipManager;
  const designer = data.team.designer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[28px] max-w-lg w-full p-7 shadow-2xl border border-black/5 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeContactModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Title */}
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DC2626]">
            Dedicated Team
          </span>
          <h3 id="contact-modal-title" className="text-2xl font-extrabold text-gray-950 tracking-tight mt-1">
            Contact Project Team
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Reach out directly to your assigned Relationship Manager and Interior Designer for {data.profile.propertyDetails || 'your project'}.
          </p>
        </div>

        <div className="space-y-4">
          {/* Relationship Manager Card */}
          {rm && (
            <div className="bg-[#FAF7F2] rounded-2xl p-4.5 border border-black/[0.04] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-[#FDE68A]/60 bg-[#FFFBEB] text-[#B45309] flex items-center justify-center font-bold text-sm tracking-wider shadow-xs shrink-0 select-none">
                  {rm.name ? (rm.name.trim().split(/\s+/).length === 1 ? rm.name.slice(0, 2).toUpperCase() : (rm.name.trim().split(/\s+/)[0][0] + rm.name.trim().split(/\s+/).slice(-1)[0][0]).toUpperCase()) : 'RM'}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {rm.role}
                  </div>
                  <div className="text-base font-bold text-gray-950">
                    {rm.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {rm.phone || '+91 98450 12345'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${rm.phone || '+919845012345'}`}
                  className="px-3.5 py-2 rounded-full bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  Call
                </a>
                <a
                  href={`mailto:${rm.email || 'rm@hubinterior.com'}`}
                  className="px-3.5 py-2 rounded-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          )}

          {/* Interior Designer Card */}
          {designer && (
            <div className="bg-[#FAF7F2] rounded-2xl p-4.5 border border-black/[0.04] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-[#FDBA74]/50 bg-[#FFF1EE] text-[#C2410C] flex items-center justify-center font-bold text-sm tracking-wider shadow-xs shrink-0 select-none">
                  {designer.name ? (designer.name.trim().split(/\s+/).length === 1 ? designer.name.slice(0, 2).toUpperCase() : (designer.name.trim().split(/\s+/)[0][0] + designer.name.trim().split(/\s+/).slice(-1)[0][0]).toUpperCase()) : 'ID'}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider">
                    {designer.role}
                  </div>
                  <div className="text-base font-bold text-gray-950">
                    {designer.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {designer.email || 'design@hubinterior.com'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${designer.phone || '+919845067890'}`}
                  className="px-3.5 py-2 rounded-full bg-[#DC2626] text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
                >
                  Call
                </a>
                <a
                  href={`mailto:${designer.email || 'design@hubinterior.com'}`}
                  className="px-3.5 py-2 rounded-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA / Working Hours */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Working Hours: Mon - Sat (10 AM - 7 PM)</span>
          <button
            type="button"
            onClick={closeContactModal}
            className="font-bold text-gray-900 hover:underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

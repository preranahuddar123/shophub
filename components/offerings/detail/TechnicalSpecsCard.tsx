'use client';

import { useState } from 'react';

interface TechnicalSpecsProps {
  primaryMaterial?: string;
  frameFinish?: string;
  dimensions?: string;
  weightCapacity?: string;
  warranty?: string;
  origin?: string;
}

export default function TechnicalSpecsCard({
  primaryMaterial = 'Aniline Suede (Grade A)',
  frameFinish = 'Matte Carbon Aluminum',
  dimensions = '820mm x 780mm x 940mm',
  weightCapacity = 'Up to 150kg (330lbs)',
  warranty = '10-Year Structural, 3-Year Textile',
  origin = 'Assembled in Denmark',
}: TechnicalSpecsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
      >
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          Technical Specifications
        </h2>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-6 pb-6 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 pt-4">
            {/* Primary Material */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                PRIMARY MATERIAL
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {primaryMaterial}
              </div>
            </div>

            {/* Frame Finish */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                FRAME FINISH
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {frameFinish}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                DIMENSIONS (W x D x H)
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {dimensions}
              </div>
            </div>

            {/* Weight Capacity */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                WEIGHT CAPACITY
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {weightCapacity}
              </div>
            </div>

            {/* Warranty */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                WARRANTY
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {warranty}
              </div>
            </div>

            {/* Origin */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                ORIGIN
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {origin}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

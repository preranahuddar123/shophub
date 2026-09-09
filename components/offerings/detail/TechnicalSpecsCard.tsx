'use client';

import { useState } from 'react';

interface AdditionalAttr {
  attribute_name: string;
  value: string;
}

interface TechnicalSpecsProps {
  primaryMaterial?: string;
  secondaryMaterial?: string;
  frameFinish?: string;
  dimensions?: string;
  weight?: string;
  weightCapacity?: string;
  assemblyRequired?: string;
  cushionDesc?: string;
  additionalAttributes?: AdditionalAttr[];
  brand?: string;
}

export default function TechnicalSpecsCard({
  primaryMaterial = '—',
  secondaryMaterial = '—',
  frameFinish = '—',
  dimensions = '—',
  weight = '—',
  weightCapacity = '—',
  assemblyRequired = '—',
  cushionDesc,
  additionalAttributes = [],
  brand,
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
              <div className="text-sm font-semibold text-gray-900 capitalize">
                {primaryMaterial && primaryMaterial !== '—'
                  ? primaryMaterial.replace(/_/g, ' ').toLowerCase()
                  : '—'}
              </div>
            </div>

            {/* Secondary Material & Finish */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                SECONDARY MATERIAL & FINISH
              </div>
              <div className="text-sm font-semibold text-gray-900 capitalize">
                {secondaryMaterial && secondaryMaterial !== '—'
                  ? secondaryMaterial.replace(/_/g, ' ').toLowerCase()
                  : '—'}{' '}
                {frameFinish && frameFinish !== '—'
                  ? `(${frameFinish.replace(/_/g, ' ').toLowerCase()} Finish)`
                  : ''}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                DIMENSIONS (L × W × H)
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {dimensions}
              </div>
            </div>

            {/* Product Weight */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                PRODUCT WEIGHT
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {weight}
              </div>
            </div>

            {/* Weight / Load Capacity */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                WEIGHT CAPACITY
              </div>
              <div className="text-sm font-semibold text-gray-900 capitalize">
                {weightCapacity && weightCapacity !== '—'
                  ? weightCapacity.replace(/_/g, ' ').toLowerCase()
                  : '—'}
              </div>
            </div>

            {/* Assembly Required */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                ASSEMBLY REQUIRED
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {assemblyRequired}
              </div>
            </div>

            {/* Cushion / Features */}
            {cushionDesc && (
              <div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                  CUSHION & BUILD
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {cushionDesc}
                </div>
              </div>
            )}

            {/* Additional Attributes from DB */}
            {additionalAttributes.map((attr, idx) => (
              <div key={idx}>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                  {attr.attribute_name.toUpperCase()}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {attr.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

interface OfferingImageGalleryProps {
  primaryImage?: string;
  galleryImages?: string[];
  productName: string;
  category?: string;
}

export default function OfferingImageGallery({
  primaryImage,
  galleryImages = [],
  productName,
  category = '—',
}: OfferingImageGalleryProps) {
  const [hasError, setHasError] = useState(false);

  // Generate 2-letter monogram
  const initials = productName
    ? productName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'PR';

  return (
    <div className="space-y-4">
      {/* Large Hero Showcase Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center p-8 h-[460px] relative group">
        {!hasError && primaryImage && !primaryImage.includes('example.com') ? (
          <img
            src={primaryImage}
            alt={productName}
            onError={() => setHasError(true)}
            className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-radial from-gray-50 to-white rounded-xl border border-gray-100">
            {/* Monogram Badge */}
            <div className="w-24 h-24 rounded-2xl bg-gray-900 text-white font-black text-3xl flex items-center justify-center tracking-wider shadow-lg mb-4">
              {initials}
            </div>

            {/* Category Pill */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-gray-100 text-gray-700 mb-2">
              {category}
            </span>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 max-w-sm">
              {productName}
            </h3>

            <p className="text-xs text-gray-400 mt-1 font-medium">
              Verified Product Catalog Image
            </p>
          </div>
        )}
      </div>

      {/* Gallery Indicator Bar */}
      <div className="flex items-center gap-3">
        <div className="px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 flex items-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Primary Catalog View</span>
        </div>

        {galleryImages.length > 0 && (
          <div className="px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-medium text-gray-500">
            {galleryImages.length} Additional Render{galleryImages.length > 1 ? 's' : ''} Attached
          </div>
        )}
      </div>
    </div>
  );
}

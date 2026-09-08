'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OfferingImageGalleryProps {
  primaryImage?: string;
  galleryImages?: string[];
  productName: string;
}

export default function OfferingImageGallery({
  primaryImage,
  galleryImages = [],
  productName,
}: OfferingImageGalleryProps) {
  // Curated thumbnails aligned with the design specification
  const defaultImages = [
    '/images/offerings/aero-suede-hero.jpg',
    '/images/offerings/thumb-suede.jpg',
    '/images/offerings/thumb-side.jpg',
    '/images/offerings/thumb-room.jpg',
  ];

  // Merge provided images or fall back to high-res design renders
  const allImages = primaryImage && primaryImage !== '/images/products/default.svg'
    ? [primaryImage, ...galleryImages, ...defaultImages].slice(0, 3)
    : defaultImages;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = allImages[selectedIndex] || defaultImages[0];

  return (
    <div className="space-y-4">
      {/* Large Hero Image Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center p-6 h-[460px] relative group">
        <div className="relative w-full h-full">
          <Image
            src={activeImage}
            alt={productName}
            fill
            className="object-contain transition-all duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex items-center gap-3">
        {/* Thumbnail 1: Texture */}
        <button
          onClick={() => setSelectedIndex(1)}
          className={`relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border transition-all ${
            selectedIndex === 1
              ? 'ring-2 ring-black border-transparent shadow-sm scale-95'
              : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
          }`}
          title="Fabric / Texture"
        >
          <Image
            src="/images/offerings/thumb-suede.jpg"
            alt="Texture view"
            fill
            className="object-cover"
          />
        </button>

        {/* Thumbnail 2: Profile */}
        <button
          onClick={() => setSelectedIndex(2)}
          className={`relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border transition-all ${
            selectedIndex === 2
              ? 'ring-2 ring-black border-transparent shadow-sm scale-95'
              : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
          }`}
          title="Profile view"
        >
          <Image
            src="/images/offerings/thumb-side.jpg"
            alt="Side profile"
            fill
            className="object-cover"
          />
        </button>

        {/* Thumbnail 3: In-Situ Penthouse */}
        <button
          onClick={() => setSelectedIndex(3)}
          className={`relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border transition-all ${
            selectedIndex === 3
              ? 'ring-2 ring-black border-transparent shadow-sm scale-95'
              : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
          }`}
          title="Room setting"
        >
          <Image
            src="/images/offerings/thumb-room.jpg"
            alt="Interior view"
            fill
            className="object-cover"
          />
        </button>

        {/* Thumbnail 4: Hero Reset or Upload Slot */}
        <button
          onClick={() => setSelectedIndex(0)}
          className={`relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 ${
            selectedIndex === 0 ? 'ring-2 ring-black border-solid' : ''
          }`}
          title="Reset hero or upload new render"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

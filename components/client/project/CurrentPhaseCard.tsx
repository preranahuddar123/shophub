'use client';

import React, { useState } from 'react';
import { SitePhotoItem } from '@/lib/client/types';

interface CurrentPhaseCardProps {
  phaseTitle: string;
  overallProgress: number;
  sitePhotos: SitePhotoItem[];
  onOpenGallery?: () => void;
}

export default function CurrentPhaseCard({
  phaseTitle,
  overallProgress,
  sitePhotos,
  onOpenGallery,
}: CurrentPhaseCardProps) {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const safePhotos = sitePhotos && sitePhotos.length > 0 ? sitePhotos : [];
  const totalCount = safePhotos.length || 1;
  const currentIndex = Math.min(activeRoomIndex, Math.max(0, totalCount - 1));
  const secondaryIndex = (currentIndex + 1) % totalCount;
  const secondaryPhoto = safePhotos[secondaryIndex];

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX - currentX;
    if (diff > 50) {
      // Swiped left -> next
      setActiveRoomIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
      setTouchStartX(null);
    } else if (diff < -50) {
      // Swiped right -> prev
      setActiveRoomIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col justify-between">
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center bg-[#DC2626] text-white text-[10.5px] font-black uppercase tracking-[0.16em] px-3.5 py-1 rounded-full shadow-xs">
            CURRENT PHASE
          </span>

          <div className="text-right">
            <span className="text-3xl sm:text-[34px] font-extrabold text-gray-950 tracking-tight leading-none block">
              {overallProgress}<span className="text-xl sm:text-2xl font-bold ml-0.5">%</span>
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mt-1">
              Overall Progress
            </span>
          </div>
        </div>

        {/* Phase Title - Google Manrope */}
        <h2 className="text-2xl sm:text-[34px] font-extrabold text-gray-950 tracking-tight mt-3 mb-4 leading-[1.15]">
          {phaseTitle}
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-[#EFEAE1] h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-[#DC2626] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Media Gallery / Pinterest Photo Collage Layout (Directly below progress bar, matching Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
        {/* Main Photo (Left 8 Cols) */}
        <div
          className="md:col-span-8 relative rounded-[24px] sm:rounded-[28px] overflow-hidden aspect-[16/11] sm:aspect-[16/10] group shadow-xs bg-stone-100 select-none cursor-pointer"
          onClick={onOpenGallery}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Smooth Sliding Track */}
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {safePhotos.map((photo, idx) => (
              <div key={photo.id || idx} className="w-full h-full shrink-0 relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle Gradient Overlay for Clean Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Bottom Left Photo Caption */}
                <div className="absolute bottom-3.5 left-4 sm:left-5 right-4 text-white pointer-events-none">
                  <p className="text-xs sm:text-[13px] font-semibold tracking-wide text-white drop-shadow-sm line-clamp-1">
                    {photo.roomName?.includes('Master') || photo.title?.includes('Master')
                      ? 'Master Suite Panel Installation (June 12)'
                      : (photo.caption || photo.title)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Chevron Controls on Hover */}
          {totalCount > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRoomIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRoomIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Right 4 Cols: Secondary Room Thumbnail + Minimalist Camera Tile */}
        <div className="md:col-span-4 flex flex-row md:flex-col gap-3.5 sm:gap-4">
          {/* Secondary Room Thumbnail */}
          {secondaryPhoto && (
            <div
              onClick={() => setActiveRoomIndex(secondaryIndex)}
              className="flex-1 relative rounded-[20px] sm:rounded-[24px] overflow-hidden aspect-[16/10] md:aspect-auto md:h-1/2 group cursor-pointer shadow-xs bg-stone-100"
            >
              <img
                src={secondaryPhoto.imageUrl}
                alt={secondaryPhoto.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />
            </div>
          )}

          {/* Minimalist Aesthetic Camera Card (Matching Image 1) */}
          <button
            type="button"
            onClick={onOpenGallery}
            aria-label="View photo gallery"
            className="flex-1 rounded-[20px] sm:rounded-[24px] bg-[#EFECE4] hover:bg-[#E5E0D6] transition-all flex items-center justify-center aspect-[16/10] md:aspect-auto md:h-1/2 group cursor-pointer border border-[#DDD6C8]/60 shadow-xs"
          >
            <div className="relative text-[#78716C] group-hover:text-[#292524] transition-all group-hover:scale-110">
              {/* Camera Body Outline */}
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
              {/* Camera Plus (+) Badge */}
              <div className="absolute -top-1 -right-1.5 w-3.5 h-3.5 flex items-center justify-center font-bold text-xs text-[#78716C] group-hover:text-[#292524]">
                +
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { SitePhotoItem } from '@/lib/client/types';

interface SitePhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: SitePhotoItem[];
}

export default function SitePhotoGalleryModal({
  isOpen,
  onClose,
  photos,
}: SitePhotoGalleryModalProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const totalCount = photos.length;
  const currentPhoto = photos[selectedIdx] || photos[0];

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  };

  const handleNext = () => {
    setSelectedIdx((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalCount, onClose]);

  if (!isOpen || !photos.length) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.touches[0].clientX;
    if (diff > 50) {
      handleNext();
      setTouchStartX(null);
    } else if (diff < -50) {
      handlePrev();
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] sm:rounded-[32px] max-w-5xl w-full p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 mb-2.5 sm:mb-3 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#DC2626] uppercase tracking-widest block">
              APPROVED ROOM DESIGNS
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight mt-0.5">
              {currentPhoto.roomName || currentPhoto.title}
            </h3>
            {currentPhoto.date && (
              <span className="text-[11px] sm:text-xs text-gray-400 font-medium block mt-0.5">
                Design Specs Verified • {currentPhoto.date}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Room Navigation Buttons: Full width distribution matching standard website */}
        <div className="shrink-0 mb-2.5 sm:mb-3 w-full">
          {totalCount <= 4 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
              {photos.map((p, idx) => {
                const isSelected = idx === selectedIdx;
                const displayName = p.roomName || p.title;
                return (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer select-none w-full min-w-0 ${
                      isSelected
                        ? 'bg-[#FFF7F7] border-[#DC2626] shadow-xs ring-2 ring-[#DC2626]/25'
                        : 'bg-[#FAF7F2] hover:bg-[#F3ECE0] border-black/[0.06]'
                    }`}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#B91C1C] flex items-center justify-center shrink-0 shadow-xs">
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FDE047]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold truncate ${isSelected ? 'text-[#DC2626]' : 'text-gray-800'}`}>
                      {displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
              {photos.map((p, idx) => {
                const isSelected = idx === selectedIdx;
                const displayName = p.roomName || p.title;
                return (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl border text-left shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#FFF7F7] border-[#DC2626] shadow-xs ring-2 ring-[#DC2626]/25'
                        : 'bg-[#FAF7F2] hover:bg-[#F3ECE0] border-black/[0.06]'
                    }`}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#B91C1C] flex items-center justify-center shrink-0 shadow-xs">
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FDE047]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold ${isSelected ? 'text-[#DC2626]' : 'text-gray-800'}`}>
                      {displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Sliding Photo Container */}
        <div
          className="relative rounded-xl sm:rounded-2xl overflow-hidden flex-1 min-h-[160px] max-h-[46vh] sm:max-h-[50vh] bg-black shadow-inner flex items-center justify-center group select-none w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Photo Counter Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10.5px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full pointer-events-none shadow-xs z-10">
            {selectedIdx + 1} / {totalCount}
          </div>

          {/* Smooth Sliding Track */}
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${selectedIdx * 100}%)` }}
          >
            {photos.map((p, idx) => (
              <div key={p.id || idx} className="w-full h-full shrink-0 relative flex items-center justify-center bg-black">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Floating Chevron Buttons */}
          {totalCount > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        {currentPhoto.caption && (
          <p className="shrink-0 text-xs sm:text-[13px] text-gray-600 font-medium mt-2 sm:mt-2.5 px-1 leading-relaxed line-clamp-2">
            {currentPhoto.caption}
          </p>
        )}

        {/* Thumbnail Selector Row: Full width distribution matching standard website */}
        <div className="shrink-0 mt-2 sm:mt-2.5 pt-2 sm:pt-2.5 border-t border-gray-100 w-full">
          {totalCount <= 4 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
              {photos.map((p, idx) => {
                const isSelected = idx === selectedIdx;
                const roomLabel = p.roomName?.split(' - ')[0] || p.title;
                return (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-full h-15 sm:h-18 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden transition-all relative cursor-pointer group ${
                      isSelected
                        ? 'ring-2 ring-[#DC2626] ring-offset-2 shadow-md'
                        : 'opacity-70 hover:opacity-100 border border-black/[0.08]'
                    }`}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Clear, Non-Truncated Room Banner */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-3 pb-1.5 px-2 text-center">
                      <span className="block text-[11px] sm:text-xs font-bold text-white leading-tight drop-shadow-sm truncate">
                        {roomLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
              {photos.map((p, idx) => {
                const isSelected = idx === selectedIdx;
                const roomLabel = p.roomName?.split(' - ')[0] || p.title;
                return (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-24 h-14 sm:w-28 sm:h-16 md:w-32 md:h-18 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 transition-all relative cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#DC2626] ring-offset-2 shadow-md'
                        : 'opacity-65 hover:opacity-100 border border-black/[0.08]'
                    }`}
                  >
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-3 pb-1 px-1.5 text-center">
                      <span className="block text-[10px] sm:text-[11px] font-bold text-white leading-tight drop-shadow-sm truncate">
                        {roomLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


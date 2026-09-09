'use client';

import React from 'react';
import { OfferingResponse } from '@/lib/types/offerings/offering.types';

interface OfferingRowProps {
  offering: OfferingResponse;
}

export default function OfferingRow({ offering }: OfferingRowProps) {
  // Stock display matching reference UI
  const getStockDisplay = () => {
    if (offering.offering_type?.toUpperCase() === 'SERVICE') {
      return (
        <span className="text-xs text-gray-500 font-medium">N/A (Unlimited)</span>
      );
    }

    const currentStock = offering.inventory?.current_stock ?? 0;
    const minLevel = offering.inventory?.minimum_stock_level ?? 5;

    if (currentStock === 0) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-gray-400"></span>
          <span>0 (Pre-order)</span>
        </div>
      );
    }

    if (currentStock <= minLevel) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          <span>Low ({currentStock})</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-900 font-medium">
        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span>{currentStock} In Stock</span>
      </div>
    );
  };

  // Status display matching reference UI
  const isDraft =
    offering.status?.toUpperCase() === 'DRAFT' ||
    offering.status?.toUpperCase() === 'IN_REVIEW';
  const statusBadge = isDraft ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 uppercase">
      DRAFT
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 uppercase">
      ACTIVE
    </span>
  );

  // Selling & Cost Prices formatted
  const sellingPrice = offering.pricing?.selling_price ?? 0;
  const costPrice = offering.pricing?.cost_price ?? offering.pricing?.cost ?? 0;

  // Margin
  const margin = offering.pricing?.margin_percentage;

  // Relative time helper
  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now.getTime() - past.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours <= 0) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // Category fallback
  const categoryName =
    offering.product?.category ||
    offering.category ||
    'LIGHTING';

  // Subtitle
  const subtitle =
    offering.subCategoryName ||
    offering.subcategory ||
    `${categoryName} / Fixtures`;

  return (
    <tr className="hover:bg-gray-50/80 transition-colors">
      {/* 1. OFFERING NAME with thumbnail & subtitle */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-200 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {offering.media?.primary_image ? (
              <img
                src={offering.media.primary_image}
                alt={offering.offering_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('bg-gray-900', 'text-white');
                    target.parentElement.innerHTML = offering.offering_name.slice(0, 2).toUpperCase();
                  }
                }}
              />
            ) : (
              <span>{offering.offering_name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          {/* Text block */}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {offering.offering_name}
            </div>
            <div className="text-xs text-gray-500 font-normal truncate mt-0.5">
              {subtitle}
            </div>
          </div>
        </div>
      </td>

      {/* 2. SKU */}
      <td className="px-6 py-4">
        <div className="text-xs font-mono text-gray-500 tracking-wide">
          {offering.sku_id || 'N/A'}
        </div>
      </td>

      {/* 3. CATEGORY */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 font-normal">{categoryName}</div>
      </td>

      {/* 4. TYPE */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
          {offering.offering_type?.toLowerCase() || 'product'}
        </span>
      </td>

      {/* 5. PRICE */}
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-bold text-gray-900">
            ${sellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {costPrice > 0 && (
            <div className="text-xs text-gray-500 font-normal mt-0.5">
              Cost: ${costPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </td>

      {/* 6. MARGIN */}
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-emerald-600">
          {margin != null ? `${Number(margin).toFixed(1)}%` : '—'}
        </div>
      </td>

      {/* 7. STOCK */}
      <td className="px-6 py-4">{getStockDisplay()}</td>

      {/* 8. STATUS */}
      <td className="px-6 py-4">{statusBadge}</td>

      {/* 9. UPDATED */}
      <td className="px-6 py-4">
        <div className="text-xs text-gray-500 font-normal">
          {getRelativeTime(offering.updated_at)}
        </div>
      </td>
    </tr>
  );
}

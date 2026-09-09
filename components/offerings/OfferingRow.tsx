'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  OfferingResponse,
  getOfferingTypeBadgeClass,
  getStatusBadgeClass,
  getStockDisplay,
  formatOfferingDate,
} from '@/lib/types/offerings/offering.types';

interface OfferingRowProps {
  offering: OfferingResponse;
}

export default function OfferingRow({ offering }: OfferingRowProps) {
  const router = useRouter();

  const typeBadgeClass = getOfferingTypeBadgeClass(offering.offering_type || 'Product');
  const statusBadgeClass = getStatusBadgeClass(offering.status);
  const stockDisplay = getStockDisplay(offering);

  const sellingPrice = offering.pricing?.selling_price ?? 0;
  const costPrice = offering.pricing?.cost_price ?? offering.pricing?.cost ?? 0;
  const margin = offering.pricing?.margin_percentage;

  const handleRowClick = () => {
    const targetId = offering.prodId || '1';
    router.push(`/offerings/single_offering?id=${targetId}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
      tabIndex={0}
      role="button"
      className="border-b border-gray-100 hover:bg-gray-50/80 cursor-pointer transition-colors group focus:outline-none focus:bg-gray-50"
    >
      {/* 1. OFFERING NAME */}
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">
          {offering.offering_name}
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
        <div className="text-sm text-gray-900">
          {offering.product?.category || offering.category || 'N/A'}
        </div>
      </td>

      {/* 4. TYPE */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${typeBadgeClass}`}
        >
          {offering.offering_type?.toLowerCase() || 'product'}
        </span>
      </td>

      {/* 5. PRICE & COST */}
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-bold text-gray-900">
            ₹{sellingPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-gray-500">
            Cost: ₹{costPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </td>

      {/* 6. MARGIN */}
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-emerald-600">
          {margin != null && !isNaN(Number(margin)) && Number(margin) !== 0
            ? `${Number(margin).toFixed(1)}%`
            : '—'}
        </div>
      </td>

      {/* 7. STOCK */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full flex-shrink-0 ${stockDisplay.dotColor}`}></span>
          <div>
            <span className={`text-sm font-medium ${stockDisplay.textColor}`}>
              {stockDisplay.text}
            </span>
            {stockDisplay.subtext && (
              <span className="text-xs text-gray-500 ml-1">{stockDisplay.subtext}</span>
            )}
          </div>
        </div>
      </td>

      {/* 8. STATUS */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${statusBadgeClass}`}
        >
          {offering.status}
        </span>
      </td>

      {/* 9. UPDATED */}
      <td className="px-6 py-4">
        <div className="text-xs text-gray-500 font-normal">
          {formatOfferingDate(offering.updated_at)}
        </div>
      </td>
    </tr>
  );
}

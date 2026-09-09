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
      {/* Offering Name */}
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">
          {offering.offering_name}
        </div>
      </td>

      {/* SKU */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700">{offering.sku_id || 'N/A'}</div>
      </td>

      {/* Category - from product.category */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{offering.product?.category || offering.category || 'N/A'}</div>
      </td>

      {/* Type */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeBadgeClass}`}
        >
          {offering.offering_type}
        </span>
      </td>

      {/* Price & Cost */}
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            ₹{(offering.pricing?.selling_price ?? 0).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-xs text-gray-500">
            Cost: ₹{(offering.pricing?.cost_price ?? offering.pricing?.cost ?? 0).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      </td>

      {/* Margin */}
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-green-600">
          {offering.pricing?.margin_percentage && offering.pricing.margin_percentage !== 0
            ? `${offering.pricing.margin_percentage.toFixed(1)}%`
            : '—'}
        </div>
      </td>

      {/* Stock */}
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

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${statusBadgeClass}`}
        >
          {offering.status}
        </span>
      </td>

      {/* Updated */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{formatOfferingDate(offering.updated_at)}</div>
      </td>
    </tr>
  );
}

'use client';

import React from 'react';
import {
  Offering,
  getOfferingTypeBadgeClass,
  getStatusBadgeClass,
  getStockDisplayInfo,
} from '@/types/offerings/offering.types';

interface OfferingRowProps {
  offering: Offering;
}

export default function OfferingRow({ offering }: OfferingRowProps) {
  const typeBadgeClass = getOfferingTypeBadgeClass(offering.type);
  const statusBadgeClass = getStatusBadgeClass(offering.status);
  const stockDisplay = getStockDisplayInfo({
    type: offering.type,
    stock: offering.stock,
    stockLevel: offering.stockLevel,
  });

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Offering Name */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{offering.name}</div>
      </td>

      {/* SKU */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700">{offering.sku}</div>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{offering.category}</div>
      </td>

      {/* Type */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeBadgeClass}`}
        >
          {offering.type}
        </span>
      </td>

      {/* Price & Cost */}
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            ₹{offering.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-gray-500">
            Cost: ₹{offering.cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </td>

      {/* Margin */}
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-green-600">
          {!isNaN(offering.margin) && offering.margin !== 0
            ? `${offering.margin.toFixed(1)}%`
            : '—'}
        </div>
      </td>

      {/* Stock */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full flex-shrink-0 ${stockDisplay.dotColor}`}
          ></span>
          <div>
            <span className={`text-sm font-medium ${stockDisplay.textColor}`}>
              {stockDisplay.text}
            </span>
            {stockDisplay.subtext && (
              <span className="text-xs text-gray-500 ml-1">
                {stockDisplay.subtext}
              </span>
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

      {/* Vendor */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700">{offering.vendor}</div>
      </td>

      {/* Updated */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{offering.updated}</div>
      </td>
    </tr>
  );
}

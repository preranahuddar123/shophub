import Image from 'next/image';
import { Offering } from '@/lib/types';

interface OfferingRowProps {
  offering: Offering;
}

export default function OfferingRow({ offering }: OfferingRowProps) {
  // Type badge styling
  const typeBadgeClass =
    offering.type === 'Product'
      ? 'bg-purple-50 text-purple-700 border border-purple-200'
      : 'bg-gray-100 text-gray-700 border border-gray-200';

  // Status badge styling
  const statusBadgeClass =
    offering.status === 'Active'
      ? 'bg-green-50 text-green-700 border border-green-200'
      : offering.status === 'Inactive'
      ? 'bg-gray-100 text-gray-700 border border-gray-200'
      : 'bg-orange-50 text-orange-600 border border-orange-200';

  // Stock level styling
  const getStockDisplay = () => {
    if (offering.type === 'Service') {
      return {
        text: 'N/A',
        subtext: '(Unlimited)',
        dotColor: 'bg-gray-400',
        textColor: 'text-gray-600',
      };
    }

    switch (offering.stockLevel) {
      case 'In Stock':
        return {
          text: `${offering.stock} In Stock`,
          subtext: null,
          dotColor: 'bg-green-500',
          textColor: 'text-gray-900',
        };
      case 'Low Stock':
        return {
          text: `Low (${offering.stock})`,
          subtext: null,
          dotColor: 'bg-orange-500',
          textColor: 'text-orange-600',
        };
      case 'Pre-order':
        return {
          text: '0 (Pre-order)',
          subtext: null,
          dotColor: 'bg-gray-400',
          textColor: 'text-gray-600',
        };
      default:
        return {
          text: `${offering.stock}`,
          subtext: null,
          dotColor: 'bg-gray-400',
          textColor: 'text-gray-900',
        };
    }
  };

  const stockDisplay = getStockDisplay();

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Offering Name with Image */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src={offering.image}
              alt={offering.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{offering.name}</div>
            <div className="text-xs text-gray-500">{offering.subcategory}</div>
          </div>
        </div>
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

      {/* Price */}
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            ${offering.price.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">Cost: ${offering.cost.toFixed(2)}</div>
        </div>
      </td>

      {/* Margin */}
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-green-600">{offering.margin.toFixed(1)}%</div>
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
        <div className="text-sm text-gray-600">{offering.updated}</div>
      </td>
    </tr>
  );
}

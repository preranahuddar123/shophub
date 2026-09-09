'use client';

interface TimelineProps {
  sellingPrice?: number;
  costPrice?: number;
  pricingDesc?: string;
  currentStock?: number;
  vendor?: string;
  leadTime?: number;
  auditDesc?: string;
  publishingStatus?: string;
  scheduleLaunch?: string;
}

export default function ActivityTimelineCard({
  sellingPrice = 0,
  costPrice = 0,
  pricingDesc = '',
  currentStock = 0,
  vendor = '—',
  leadTime = 0,
  auditDesc = 'Catalog record',
  publishingStatus = 'PUBLISHED',
  scheduleLaunch,
}: TimelineProps) {
  const events = [
    {
      id: '1',
      title: 'Pricing Active',
      description: `MSRP ₹${sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Cost: ₹${costPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })})${pricingDesc ? ` — ${pricingDesc}` : ''}.`,
      timestamp: 'Active Pricing',
      iconType: 'price' as const,
    },
    {
      id: '2',
      title: 'Inventory & Procurement',
      description: `${currentStock} units in stock. Preferred vendor: ${vendor}${leadTime ? ` with ${leadTime} days lead time` : ''}.`,
      timestamp: 'Live Stock',
      iconType: 'gallery' as const,
    },
    {
      id: '3',
      title: 'Catalog Record Created',
      description: `${auditDesc}. Visibility status: ${publishingStatus}.`,
      timestamp:
        scheduleLaunch && scheduleLaunch !== '—'
          ? new Date(scheduleLaunch).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Active',
      iconType: 'created' as const,
    },
  ];

  const renderIcon = (type: 'price' | 'gallery' | 'created') => {
    switch (type) {
      case 'price':
        return (
          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        );
      case 'gallery':
        return (
          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case 'created':
        return (
          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
      {/* Header */}
      <h2 className="text-base font-bold text-gray-900 tracking-tight">
        Activity Timeline
      </h2>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-px before:bg-gray-200">
        {events.map((event) => (
          <div key={event.id} className="relative group">
            {/* Circular Node */}
            <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center transition-colors group-hover:border-black group-hover:bg-gray-50">
              {renderIcon(event.iconType)}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-gray-900">
                {event.title}
              </div>
              <div className="text-xs text-gray-600 leading-snug">
                {event.description}
              </div>
              <div className="text-[11px] font-medium text-gray-400">
                {event.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

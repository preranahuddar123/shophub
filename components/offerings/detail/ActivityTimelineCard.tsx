'use client';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  iconType: 'price' | 'gallery' | 'created';
}

export default function ActivityTimelineCard() {
  const events: TimelineEvent[] = [
    {
      id: '1',
      title: 'Price adjusted',
      description: 'MSRP increased from $3,200 to $3,450 by Robert K.',
      timestamp: 'Oct 04, 2024 • 09:15 AM',
      iconType: 'price',
    },
    {
      id: '2',
      title: 'Gallery updated',
      description: '3 high-resolution studio renders added.',
      timestamp: 'Sep 28, 2024 • 02:30 PM',
      iconType: 'gallery',
    },
    {
      id: '3',
      title: 'Offering created',
      description: 'Initial catalog entry by System integration.',
      timestamp: 'Aug 12, 2024 • 11:00 AM',
      iconType: 'created',
    },
  ];

  const renderIcon = (type: TimelineEvent['iconType']) => {
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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

      {/* View Full Log Button */}
      <button className="w-full bg-gray-100/90 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors text-center mt-2">
        VIEW FULL LOG
      </button>
    </div>
  );
}

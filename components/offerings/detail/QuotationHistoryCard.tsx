'use client';

interface QuoteItem {
  id: string;
  projectName: string;
  quantity: number;
  date: string;
  status: 'In Review' | 'Closed / Won' | 'Draft' | 'Expired';
}

export default function QuotationHistoryCard() {
  const quotes: QuoteItem[] = [
    {
      id: 'QT-2024-8891',
      projectName: 'Global Tech HQ - Office Refit',
      quantity: 24,
      date: '03 Oct 2024',
      status: 'In Review',
    },
    {
      id: 'QT-2024-8542',
      projectName: 'Skyline Tower Executive Lounge',
      quantity: 6,
      date: '28 Sep 2024',
      status: 'Closed / Won',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
      {/* Header */}
      <h2 className="text-base font-bold text-gray-900 tracking-tight">
        Quotation Usage History
      </h2>

      {/* Quotes List */}
      <div className="divide-y divide-gray-100">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 px-2 rounded-lg transition-colors"
          >
            {/* Quote ID & Project */}
            <div>
              <div className="text-sm font-bold text-gray-900">
                {quote.id}
              </div>
              <div className="text-xs text-gray-500">
                {quote.projectName}
              </div>
            </div>

            {/* Qty, Date & Badge */}
            <div className="flex items-center gap-6 text-xs">
              <div className="font-semibold text-gray-700">
                Qty: {quote.quantity}
              </div>
              <div className="text-gray-500">
                {quote.date}
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    quote.status === 'In Review'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : quote.status === 'Closed / Won'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {quote.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-gray-100 text-center">
        <button className="text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors py-1">
          View All 18 Related Quotes
        </button>
      </div>
    </div>
  );
}

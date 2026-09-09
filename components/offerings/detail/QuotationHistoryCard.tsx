'use client';

interface QuoteItem {
  id: string;
  projectName: string;
  quantity: number;
  date: string;
  status: 'In Review' | 'Closed / Won' | 'Draft' | 'Expired';
}

interface QuotationHistoryCardProps {
  skuId?: string;
  quotes?: QuoteItem[];
}

export default function QuotationHistoryCard({
  skuId = '—',
  quotes = [],
}: QuotationHistoryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          Quotation Usage History
        </h2>
        {quotes.length > 0 && (
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {quotes.length} Quote{quotes.length > 1 ? 's' : ''} Linked
          </span>
        )}
      </div>

      {/* Quotes List or DB Empty State */}
      {quotes.length > 0 ? (
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
      ) : (
        <div className="bg-gray-50/60 rounded-xl p-6 border border-gray-100 text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-700">
            No active quotation records found for {skuId} in database.
          </p>
          <p className="text-[11px] text-gray-400">
            Quotations generated via Prolance / ERP will synchronize with this offering automatically.
          </p>
        </div>
      )}
    </div>
  );
}

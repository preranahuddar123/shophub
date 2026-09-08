'use client';

interface OfferingPricingSummaryProps {
  offeringName: string;
  category?: string;
  subcategory?: string;
  sku?: string;
  batchNumber?: string;
  upc?: string;
  price?: number;
  deliveryTime?: string;
  isVerified?: boolean;
}

export default function OfferingPricingSummary({
  offeringName,
  category = 'FURNITURE',
  subcategory = 'LOUNGE',
  sku = 'AS-LX-2024-CH',
  batchNumber = '#902-A',
  upc = '8492039481',
  price = 3450,
  deliveryTime = '4-6 Weeks',
  isVerified = true,
}: OfferingPricingSummaryProps) {
  const formattedPrice = price.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      {/* Category Subtitle & Verified Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          {category} / {subcategory}
        </span>
        {isVerified && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-600 border border-green-200">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>VERIFIED LISTING</span>
          </div>
        )}
      </div>

      {/* Main Title */}
      <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
        {offeringName}
      </h1>

      {/* Identifiers / Meta Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* SKU */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 rounded-md text-xs font-semibold text-gray-700">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>SKU: {sku}</span>
        </div>

        {/* Batch */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 rounded-md text-xs font-semibold text-gray-700">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Batch: {batchNumber}</span>
        </div>

        {/* UPC */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 rounded-md text-xs font-semibold text-gray-700">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span>UPC: {upc}</span>
        </div>
      </div>

      {/* Current Market Price (MSRP) Card */}
      <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-100">
        <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">
          CURRENT MARKET PRICE (MSRP)
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-400 text-lg font-normal">₹</span>
          <span className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            {formattedPrice}
          </span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            INR
          </span>
        </div>
      </div>

      {/* Estimated Delivery Card */}
      <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>ESTIMATED DELIVERY</span>
        </div>
        <div className="text-lg font-bold text-gray-900">
          {deliveryTime}
        </div>
      </div>

      {/* Internal Classification */}
      <div>
        <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2.5">
          INTERNAL CLASSIFICATION
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Executive */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black text-white text-xs font-bold shadow-xs">
            <span>★</span>
            <span>Executive</span>
          </span>

          {/* Bestseller */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-200 text-gray-700 text-xs font-bold">
            <span>⚡</span>
            <span>Bestseller</span>
          </span>

          {/* High Margin */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>High Margin</span>
          </span>
        </div>
      </div>
    </div>
  );
}

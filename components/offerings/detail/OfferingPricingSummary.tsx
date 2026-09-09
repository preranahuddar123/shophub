'use client';

interface OfferingPricingSummaryProps {
  offeringName: string;
  category?: string;
  subcategory?: string;
  sku?: string;
  batchNumber?: string;
  upc?: string;
  price?: number;
  costPrice?: number;
  discount?: number;
  gstRate?: string;
  units?: string;
  shortDesc?: string;
  longDesc?: string;
  brand?: string;
  tags?: string[];
  keywords?: string[];
  isVerified?: boolean;
}

export default function OfferingPricingSummary({
  offeringName,
  category = 'OFFERING',
  subcategory = '',
  sku = '—',
  batchNumber = '',
  upc = '',
  price = 0,
  costPrice = 0,
  discount = 0,
  gstRate = 'GST_18',
  units = 'PER_PIECE',
  shortDesc,
  longDesc,
  brand,
  tags = [],
  keywords = [],
  isVerified = true,
}: OfferingPricingSummaryProps) {
  const formattedPrice = price.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedCost = costPrice.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedGst = gstRate ? gstRate.replace(/_/g, ' ') : 'GST 18%';
  const formattedUnits = units ? units.replace(/_/g, ' ').toLowerCase() : 'piece';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      {/* Category Subtitle & Verified Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          {category} {subcategory ? `/ ${subcategory}` : ''} {brand ? `• ${brand}` : ''}
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

      {/* Main Title & Short Description */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
          {offeringName}
        </h1>
        {shortDesc && (
          <p className="mt-1.5 text-xs text-gray-600 font-medium">
            {shortDesc}
          </p>
        )}
      </div>

      {/* Identifiers / Meta Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* SKU */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 rounded-md text-xs font-semibold text-gray-700">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>SKU: {sku}</span>
        </div>

        {/* Batch / Accounting Code */}
        {batchNumber && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 rounded-md text-xs font-semibold text-gray-700">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Batch: {batchNumber}</span>
          </div>
        )}

        {/* UPC / Barcode */}
        {upc && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100/90 rounded-md text-xs font-semibold text-gray-700">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>UPC: {upc}</span>
          </div>
        )}
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
            INR / {formattedUnits}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 font-medium">
          <span>Cost: ₹{formattedCost}</span>
          {discount > 0 && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              {discount}% Discount Applied
            </span>
          )}
          <span>{formattedGst}</span>
        </div>
      </div>

      {/* Long Description */}
      {longDesc && (
        <div className="pt-2">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">
            ABOUT THIS OFFERING
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {longDesc}
          </p>
        </div>
      )}

      {/* Internal Classification & Tags (from SEO keywords) */}
      <div>
        <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2.5">
          CLASSIFICATION & TAGS
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {brand && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black text-white text-xs font-bold shadow-xs">
              <span>★</span>
              <span>{brand}</span>
            </span>
          )}

          {(keywords && keywords.length > 0 ? keywords : tags).map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold capitalize"
            >
              #{item}
            </span>
          ))}

          {price > costPrice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span>High Margin</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import OfferingDetailHeader from './OfferingDetailHeader';
import OfferingImageGallery from './OfferingImageGallery';
import OfferingPricingSummary from './OfferingPricingSummary';
import TechnicalSpecsCard from './TechnicalSpecsCard';
import InventorySourcingCard from './InventorySourcingCard';
import InternalNotesCard from './InternalNotesCard';
import ActivityTimelineCard from './ActivityTimelineCard';
import QuotationHistoryCard from './QuotationHistoryCard';
import { Offering } from '@/lib/types';
import { ProdDataResDTO } from '@/lib/types/dto.types';
import { PrimaryCategory, SecondaryCategory } from '@/lib/types/api.types';

interface OfferingDetailViewProps {
  offering?: Offering | null;
  product?: ProdDataResDTO | null;
  primaryCategory?: PrimaryCategory | null;
  secondaryCategories?: SecondaryCategory[];
  currentSecondaryCategory?: SecondaryCategory | null;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export default function OfferingDetailView({
  offering,
  product,
  primaryCategory,
  secondaryCategories = [],
  currentSecondaryCategory,
  isLoading = false,
  error,
  onRefresh,
}: OfferingDetailViewProps) {
  // Extract data with graceful fallbacks matching the exact design spec
  const offeringName =
    product?.offering_name ||
    offering?.name ||
    'Aero Suede Lounge';

  const categoryName =
    primaryCategory?.primaryCategoryName ||
    offering?.parentCategoryName ||
    offering?.category ||
    product?.category ||
    'Executive Series';

  const subcategory =
    currentSecondaryCategory?.secondaryCategoryName ||
    (secondaryCategories.length > 0 ? secondaryCategories[0].secondaryCategoryName : null) ||
    offering?.subcategory ||
    (product as any)?.subCategoryName ||
    'LOUNGE';

  const status =
    product?.internal?.visibility_status?.publishing_status ||
    offering?.status ||
    'ACTIVE';

  const sku =
    product?.sku_id ||
    (offering?.sku && offering.sku !== 'N/A' ? offering.sku : 'AS-LX-2024-CH');

  const price =
    product?.pricing?.selling_price ||
    offering?.price ||
    3450;

  const vendor =
    product?.inventory?.sourcingLogistics?.preferred_vendor ||
    (offering?.vendor && offering.vendor !== 'Unnamed Offering' ? offering.vendor : 'Nordic Design Collective (NDC)');

  // Specs from product or defaults
  const specs = product?.specifications;
  const primaryMaterial =
    specs?.material_finish?.primary_material || 'Aniline Suede (Grade A)';
  const frameFinish =
    specs?.material_finish?.finish_type || 'Matte Carbon Aluminum';
  const dimensions = specs?.physical_dimensions
    ? `${specs.physical_dimensions.length || 820}mm x ${specs.physical_dimensions.width || 780}mm x ${specs.physical_dimensions.height || 940}mm`
    : '820mm x 780mm x 940mm';
  const weightCapacity =
    specs?.technical_properties?.load_capacity || 'Up to 150kg (330lbs)';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Error notification if API failed and running in fallback */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold">Offline / Fallback:</span>
            <span>{error}</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="underline font-semibold hover:text-amber-900 cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Top Breadcrumb & Header Action */}
      <OfferingDetailHeader
        offeringName={offeringName}
        categoryName={categoryName}
        status={status}
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Approx 60% width on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Hero Image & Thumbnail Gallery */}
          <OfferingImageGallery
            primaryImage={product?.media?.primary_image || offering?.image}
            galleryImages={product?.media?.gallery_images || []}
            productName={offeringName}
          />

          {/* 2. Technical Specifications Card */}
          <TechnicalSpecsCard
            primaryMaterial={primaryMaterial}
            frameFinish={frameFinish}
            dimensions={dimensions}
            weightCapacity={weightCapacity}
          />

          {/* 3. Inventory & Sourcing Card */}
          <InventorySourcingCard
            preferredVendor={vendor}
          />

          {/* 4. Quotation Usage History Card */}
          <QuotationHistoryCard />
        </div>

        {/* Right Column (Approx 40% width on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 5. Product Header, Pricing & Classification */}
          <OfferingPricingSummary
            offeringName={offeringName}
            category={String(categoryName).toUpperCase()}
            subcategory={subcategory}
            sku={sku}
            price={price}
          />

          {/* 6. Internal Notes Card */}
          <InternalNotesCard />

          {/* 7. Activity Timeline Card */}
          <ActivityTimelineCard />
        </div>
      </div>
    </div>
  );
}

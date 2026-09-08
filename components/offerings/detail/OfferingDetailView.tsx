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

interface OfferingDetailViewProps {
  offering?: Offering | null;
  product?: ProdDataResDTO | null;
}

export default function OfferingDetailView({ offering, product }: OfferingDetailViewProps) {
  // Extract data with graceful fallbacks matching the exact design spec
  const offeringName =
    offering?.name ||
    product?.offering_name ||
    'Aero Suede Lounge';

  const categoryName =
    offering?.parentCategoryName ||
    offering?.category ||
    product?.category ||
    'Executive Series';

  const subcategory =
    offering?.subcategory ||
    (product as any)?.subCategoryName ||
    'LOUNGE';

  const status =
    offering?.status ||
    (product?.internal?.visibility_status?.publishing_status === 'PUBLISHED'
      ? 'ACTIVE'
      : 'ACTIVE');

  const sku =
    offering?.sku && offering.sku !== 'N/A'
      ? offering.sku
      : product?.sku_id || 'AS-LX-2024-CH';

  const price =
    offering?.price ||
    product?.pricing?.selling_price ||
    3450;

  const vendor =
    offering?.vendor && offering.vendor !== 'Unnamed Offering'
      ? offering.vendor
      : product?.inventory?.sourcingLogistics?.preferred_vendor ||
        'Nordic Design Collective (NDC)';

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
            primaryImage={offering?.image || product?.media?.primary_image}
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

// ============================================================================
// OFFERING TYPES - Backend response contracts and UI presentation models
// ============================================================================

export type OfferingType = 'Product' | 'Service' | 'Bundle' | string;
export type OfferingStatus = 'Active' | 'Inactive' | 'Draft' | 'Published' | string;
export type StockLevel = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre-order' | 'Unlimited';

/**
 * Raw Offering document structure returned from Elasticsearch backend
 */
export interface OfferingResponse {
  prodId?: string | number;
  id?: string | number;
  offering_name?: string;
  name?: string;
  offering_type?: string;
  type?: string;
  sku_id?: string;
  sku?: string;
  status?: string;
  updated_at?: string;
  updated?: string;
  description?: string;
  pricing?: {
    selling_price?: number;
    cost_price?: number;
    cost?: number;
    margin_percentage?: number;
    gst_rate?: string;
    price_unit?: string;
  };
  inventory?: {
    current_stock?: number;
    minimum_stock_level?: number;
    reorder_quantity?: number;
  };
  sourcingLogistics?: {
    preferred_vendor?: string;
  };
  product?: {
    category?: string;
    offering_name?: string;
  };
  category?: string;
  internal?: {
    visibility_status?: {
      publishing_status?: string;
    };
    restricted_region?: string;
  };
  brand?: string;
  subCategoryName?: string;
  subcategory?: string;
  [key: string]: any;
}

/**
 * Normalized Offering UI presentation model consumed by components
 */
export interface Offering {
  id: string;
  name: string;
  sku: string;
  category: string;
  parentCategoryName?: string;
  subcategory?: string;
  type: OfferingType;
  price: number;
  cost: number;
  margin: number;
  stock: number;
  stockLevel: StockLevel;
  status: OfferingStatus;
  vendor: string;
  updated: string;
  image?: string;
}

/**
 * Returns Tailwind badge class string for offering type
 */
export function getOfferingTypeBadgeClass(type: string): string {
  const normalized = type?.toLowerCase() || '';
  if (normalized === 'product') {
    return 'bg-purple-50 text-purple-700 border border-purple-200';
  }
  if (normalized === 'service') {
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  }
  return 'bg-gray-100 text-gray-700 border border-gray-200';
}

/**
 * Returns Tailwind badge class string for offering status
 */
export function getStatusBadgeClass(status: string): string {
  const normalized = status?.toLowerCase() || '';
  if (normalized === 'active' || normalized === 'published' || normalized === 'approved') {
    return 'bg-green-50 text-green-700 border border-green-200';
  }
  if (normalized === 'inactive' || normalized === 'archived' || normalized === 'discontinued') {
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
  return 'bg-orange-50 text-orange-600 border border-orange-200';
}

/**
 * Returns stock display properties for offering row
 */
export function getStockDisplayInfo(offering: {
  type: string;
  stock: number;
  stockLevel?: string;
}): {
  text: string;
  subtext: string | null;
  dotColor: string;
  textColor: string;
} {
  if (offering.type?.toLowerCase() === 'service') {
    return {
      text: 'N/A',
      subtext: '(Unlimited)',
      dotColor: 'bg-gray-400',
      textColor: 'text-gray-600',
    };
  }

  if (offering.stock <= 0) {
    return {
      text: '0 (Out of Stock)',
      subtext: null,
      dotColor: 'bg-red-500',
      textColor: 'text-red-600',
    };
  }

  if (offering.stockLevel === 'Low Stock' || offering.stock <= 10) {
    return {
      text: `Low (${offering.stock})`,
      subtext: null,
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-600',
    };
  }

  return {
    text: `${offering.stock} In Stock`,
    subtext: null,
    dotColor: 'bg-green-500',
    textColor: 'text-gray-900',
  };
}

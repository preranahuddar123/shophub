import {
  OfferingResponse,
  Offering,
  OfferingType,
  OfferingStatus,
  StockLevel,
} from '@/types/offerings/offering.types';

/**
 * Maps a single raw OfferingResponse from Elasticsearch backend to the UI Offering presentation model
 */
export function mapOfferingResponseToUI(raw: OfferingResponse): Offering {
  const typeStr = raw.offering_type || raw.type || 'Product';
  // Capitalize properly: "PRODUCT" -> "Product", "SERVICE" -> "Service"
  const type: OfferingType =
    typeStr.charAt(0).toUpperCase() + typeStr.slice(1).toLowerCase();

  const price = Number(raw.pricing?.selling_price ?? 0);
  const cost = Number(raw.pricing?.cost_price ?? raw.pricing?.cost ?? 0);

  let margin = Number(raw.pricing?.margin_percentage);
  if (isNaN(margin) || margin === undefined || margin === null) {
    margin = price > 0 ? ((price - cost) / price) * 100 : 0;
  }

  const stock = Number(raw.inventory?.current_stock ?? 0);
  const minStock = Number(raw.inventory?.minimum_stock_level ?? 10);

  let stockLevel: StockLevel = 'In Stock';
  if (type.toLowerCase() === 'service') {
    stockLevel = 'Unlimited';
  } else if (stock <= 0) {
    stockLevel = 'Out of Stock';
  } else if (stock <= minStock) {
    stockLevel = 'Low Stock';
  }

  const statusRaw =
    raw.internal?.visibility_status?.publishing_status || raw.status || 'Active';
  // Normalize status text: e.g. "PUBLISHED" -> "Published", "DRAFT" -> "Draft", "ACTIVE" -> "Active"
  const status: OfferingStatus =
    statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).toLowerCase();

  const vendor =
    raw.sourcingLogistics?.preferred_vendor ||
    raw.vendor ||
    raw.product?.offering_name ||
    'In House';

  const dateStr = raw.updated_at || raw.updated;
  let formattedDate = 'Recently';
  if (dateStr) {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      formattedDate = dateStr;
    }
  }

  return {
    id: String(raw.prodId ?? raw.id ?? raw.sku_id ?? Math.random().toString(36).substring(2)),
    name: raw.offering_name || raw.name || 'Unnamed Offering',
    sku: raw.sku_id || raw.sku || 'N/A',
    category: raw.product?.category || raw.category || 'General',
    parentCategoryName: raw.parentCategoryName,
    subcategory: raw.subcategory || raw.subCategoryName || '',
    type,
    price,
    cost,
    margin,
    stock,
    stockLevel,
    status,
    vendor,
    updated: formattedDate,
    image: raw.image,
  };
}

/**
 * Maps an array of OfferingResponse items to UI Offering models
 */
export function mapOfferingResponsesToUI(rawList: OfferingResponse[]): Offering[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(mapOfferingResponseToUI);
}

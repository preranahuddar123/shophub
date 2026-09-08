import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Offering, StockLevel, OfferingStatus, OfferingType } from '../../types';
import { Product } from '../../types/api.types';
import { ProdDataResDTO } from '../../types/dto.types';
import { getAllProducts } from '../../api/product.service';

/**
 * Mapper adhering strictly to the user requirements:
 * Offering Name → product.offering_name
 * SKU → product.sku_id
 * Category → product.category (never primaryCategoryName or secondaryCategoryName!)
 * Type → product.offering_type
 * Price → product.pricing.selling_price
 * Margin → product.pricing.margin_percentage
 * Stock → product.inventory.current_stock
 * Status → product.internal.visibility_status.publishing_status
 * Vendor → product.offering_name (Do NOT use brand or preferred_vendor!)
 * Updated → 'Recently'
 */
export const convertProductToOffering = (
  product: Product | ProdDataResDTO,
  fallbackIndex = 0,
  parentName = ''
): Offering => {
  const offeringName = product.offering_name || 'Unnamed Offering';
  const skuId = product.sku_id || 'N/A';
  const offeringType = product.offering_type || 'PRODUCT';
  const category = product.category || 'Uncategorized';

  const publishingStatus =
    product.internal?.visibility_status?.publishing_status ||
    (product as any).status ||
    'DRAFT';

  const currentStock = product.inventory?.current_stock ?? (product as any).stock ?? 0;
  const minimumStock = product.inventory?.minimum_stock_level ?? 0;

  const sellingPrice = product.pricing?.selling_price ?? (product as any).price ?? 0;
  const costPrice =
    product.pricing?.cost_price ??
    (product.pricing as any)?.cost ??
    (sellingPrice > 0 ? sellingPrice * 0.6 : 0);

  const rawMargin = product.pricing?.margin_percentage;
  const margin =
    rawMargin !== null && rawMargin !== undefined
      ? rawMargin
      : sellingPrice > 0
      ? ((sellingPrice - costPrice) / sellingPrice) * 100
      : 0;

  const id = product.prodId
    ? String(product.prodId)
    : (product as any).productId
    ? String((product as any).productId)
    : `${skuId}-${fallbackIndex}`;

  const normalizedType: OfferingType =
    String(offeringType).toUpperCase() === 'SERVICE' ? 'Service' : 'Product';

  let stockLevel: StockLevel;
  if (normalizedType === 'Service') {
    stockLevel = 'Unlimited';
  } else if (currentStock > minimumStock) {
    stockLevel = 'In Stock';
  } else if (currentStock > 0 && currentStock <= minimumStock) {
    stockLevel = 'Low Stock';
  } else {
    stockLevel = 'Pre-order';
  }

  const normalizedStatus: OfferingStatus =
    String(publishingStatus).toUpperCase() === 'PUBLISHED' ? 'Active' : 'Draft';

  // Vendor MUST use product.offering_name (Do NOT use brand or preferred_vendor)
  const vendor = offeringName;

  return {
    id,
    name: offeringName,
    sku: skuId,
    category, // Strictly product.category, e.g. LIGHTING
    parentCategoryName: parentName,
    subcategory: (product as any).subCategoryName || '',
    type: normalizedType,
    price: sellingPrice,
    cost: costPrice,
    margin,
    stock: currentStock,
    stockLevel,
    status: normalizedStatus,
    vendor,
    updated: 'Recently',
    image: (product.media as any)?.primary_image || '/images/products/default.svg',
  };
};

/**
 * Deduplicate offerings by unique ID and SKU
 */
export const deduplicateOfferings = (items: Offering[]): Offering[] => {
  const seenIds = new Set<string>();
  const seenSkus = new Set<string>();
  const result: Offering[] = [];

  for (const item of items) {
    const idKey = item.id;
    const skuKey = item.sku;
    if (!seenIds.has(idKey) && (skuKey === 'N/A' || !seenSkus.has(skuKey))) {
      seenIds.add(idKey);
      if (skuKey !== 'N/A') {
        seenSkus.add(skuKey);
      }
      result.push(item);
    }
  }

  return result;
};

export interface OfferingsState {
  offerings: Offering[];
  currentPage: number; // 1-indexed for UI
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: OfferingsState = {
  offerings: [],
  currentPage: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 1,
  isLoading: false,
  error: null,
};

// Fetch offerings from backend with pagination (Pageable: 0-indexed)
export const fetchBackendOfferings = createAsyncThunk(
  'offerings/fetchBackendOfferings',
  async ({ page, size = 10 }: { page: number; size?: number }) => {
    // page argument is 1-indexed from UI; backend expects 0-indexed
    const backendPage = Math.max(0, page - 1);
    const response = await getAllProducts(backendPage, size);
    return {
      pageResponse: response,
      requestedPage: page,
    };
  }
);

export const offeringsSlice = createSlice({
  name: 'offerings',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setHierarchyOfferings: (
      state,
      action: PayloadAction<{ products: Product[]; parentName?: string }>
    ) => {
      const { products, parentName = '' } = action.payload;
      const converted = products.map((prod, idx) =>
        convertProductToOffering(prod, idx, parentName)
      );
      const deduplicated = deduplicateOfferings(converted);
      state.offerings = deduplicated;
      state.totalElements = deduplicated.length;
      state.totalPages = Math.max(1, Math.ceil(deduplicated.length / state.pageSize));
      state.currentPage = 1;
      state.isLoading = false;
      state.error = null;
    },
    clearOfferings: (state) => {
      state.offerings = [];
      state.totalElements = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBackendOfferings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBackendOfferings.fulfilled, (state, action) => {
        state.isLoading = false;
        const pageData = action.payload.pageResponse;
        const converted = pageData.content.map((prod, idx) =>
          convertProductToOffering(prod, idx)
        );
        state.offerings = deduplicateOfferings(converted);
        state.totalElements = pageData.totalElements;
        state.totalPages = Math.max(1, pageData.totalPages);
        state.currentPage = action.payload.requestedPage;
      })
      .addCase(fetchBackendOfferings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load products from backend';
      });
  },
});

export const {
  setCurrentPage,
  setPageSize,
  setHierarchyOfferings,
  clearOfferings,
} = offeringsSlice.actions;

export default offeringsSlice.reducer;

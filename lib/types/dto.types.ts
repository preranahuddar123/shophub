/**
 * Data Transfer Objects (DTOs) and Types
 * Request bodies, response bodies, and domain models
 */

// ============================================================================
// PAGINATION DTO
// ============================================================================

export interface PaginationRequestDto {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// SEARCH REQUEST/RESPONSE DTO
// ============================================================================

export interface SearchRequestDto {
  query: string;
  pagination: PaginationRequestDto;
  filters?: FilterRequestDto;
}

export interface SearchResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
  took: number; // Elasticsearch query time in ms
}

// ============================================================================
// FILTER REQUEST DTO
// ============================================================================

export interface FilterRequestDto {
  types?: string[]; // [Product, Service]
  statuses?: string[]; // [Active, Draft, Published]
  vendors?: string[]; // Offering names
  categories?: string[]; // Product categories [LIGHTING, etc]
  stocks?: string[]; // [In Stock, Low Stock, Pre-order, Unlimited]
  priceRange?: {
    min: number;
    max: number;
  };
}

// ============================================================================
// OFFERING RESPONSE DTO
// ============================================================================

export interface OfferingResponseDto {
  prodId: string;
  offering_name: string;
  offering_type: string; // PRODUCT, SERVICE
  sku_id: string;
  status: string; // Active, Draft, Published
  updated_at?: string;
  description?: string;
  pricing: {
    selling_price: number;
    cost_price?: number;
    cost?: number;
    margin_percentage?: number;
  };
  inventory: {
    current_stock: number;
    minimum_stock_level: number;
    reorder_quantity?: number;
    sourcingLogistics?: {
      preferred_vendor?: string;
    };
  };
  product?: {
    category: string; // e.g., LIGHTING, ELECTRONICS
    offering_name?: string;
  };
  internal?: {
    visibility_status: {
      publishing_status: string; // PUBLISHED, DRAFT
    };
  };
  brand?: string;
  subCategoryName?: string;
  subcategory?: string;
  [key: string]: any; // Allow additional fields
}

// ============================================================================
// FILTER OPTIONS RESPONSE DTO
// ============================================================================

export interface FilterOptionsResponseDto {
  types: string[]; // [PRODUCT, SERVICE]
  statuses: string[]; // [PUBLISHED, DRAFT]
  categories: string[]; // [LIGHTING, ELECTRONICS]
  vendors: string[]; // Offering names
  stocks: string[]; // [In Stock, Low Stock, Pre-order, Unlimited]
  priceRange: {
    min: number;
    max: number;
  };
}

// ============================================================================
// BULK FILTER REQUEST/RESPONSE (for filtering existing offerings)
// ============================================================================

export interface BulkFilterRequestDto {
  offerings: OfferingResponseDto[];
  filters: FilterRequestDto;
}

export interface BulkFilterResponseDto {
  data: OfferingResponseDto[];
  filtered: number;
  total: number;
}

// ============================================================================
// OFFERINGS PAGE STATE DTO
// ============================================================================

export interface OfferingsPageStateDto {
  offerings: OfferingResponseDto[];
  filters: FilterRequestDto;
  searchQuery: string;
  pagination: PaginationMetaDto;
  isLoading: boolean;
  error: string | null;
  filterOptions: FilterOptionsResponseDto | null;
}

// ============================================================================
// API ERROR RESPONSE DTO
// ============================================================================

export interface ApiErrorResponseDto {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

// ============================================================================
// CATEGORY API RESPONSE DTOs (from existing APIs)
// ============================================================================

export interface CategoryProductDto {
  prodId?: string;
  offering_name: string;
  offering_type: string;
  sku_id: string;
  category?: string;
  pricing: {
    selling_price: number;
    cost?: number;
    margin_percentage?: number;
  };
  inventory: {
    current_stock: number;
    minimum_stock_level: number;
  };
  internal: {
    visibility_status: {
      publishing_status: string;
    };
  };
}

export interface PrimaryCategoryDto {
  primaryCategoryId: string;
  primaryCategoryName: string;
  primaryCategoryDescription?: string;
  products?: CategoryProductDto[];
  subCategory?: any[];
}

export interface SecondaryCategoryDto {
  secondaryCategoryId: string;
  secondaryCategoryName: string;
  secondaryCategoryDescription?: string;
  products?: CategoryProductDto[];
  subCategory?: any[];
}

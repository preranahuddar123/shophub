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

export interface ProdDataResDTO {
  prodId: number | string;
  offering_name: string;
  offering_type: string;
  sku_id: string;
  category?: string;
  brand?: string;
  tags?: string[];
  short_desc?: string;
  long_desc?: string;
  featured_offer?: boolean;
  pricing?: {
    selling_price: number;
    cost_price?: number;
    cost?: number;
    discount?: number;
    gst_rate?: string;
    units?: string;
    margin_percentage?: number;
    desc?: string;
  };
  inventory?: {
    sku_Id?: string;
    barcode?: string;
    current_stock: number;
    minimum_stock_level: number;
    reorder_quantity?: number;
    sourcingLogistics?: {
      preferred_vendor?: string;
      lead_time?: number;
    };
  };
  internal?: {
    visibility_status?: {
      publishing_status: string;
      visibility?: boolean;
      schedule_launch?: string;
    };
    access_permissions?: {
      allowed_users?: string[];
      restricted_region?: string;
    };
    system_hooks_integration?: {
      erp_module_integration?: {
        sales_module?: boolean;
        inventory_sync?: boolean;
        procurement_pipeline?: boolean;
        accounting_code?: string;
      };
    };
    audit_trail_notes?: {
      desc?: string;
    };
  };
  media?: {
    primary_image?: string;
    gallery_images?: string[];
    video_link?: string;
    image_360?: string;
    product_brochure?: string;
    upload_draw?: string;
  };
  specifications?: {
    physical_dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      weight?: number;
    };
    material_finish?: {
      primary_material?: string;
      secondary_material?: string;
      finish_type?: string;
    };
    technical_properties?: {
      assembly_required?: boolean;
      load_capacity?: string;
      desc?: string;
    };
    additional_attributes?: Array<{
      attribute_name: string;
      value: string;
    }>;
  };
  seo?: {
    page_title?: string;
    meta_desc?: string;
    url_slug?: string;
    keywords?: string[];
  };
  [key: string]: any;
}

export interface PageResponse<T> {
  content: T[];
  pageable?: any;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ElasticsearchSearchRequest {
  from?: number;
  size?: number;
  [key: string]: any;
}

export interface ElasticsearchSearchResponse<T> {
  took: number;
  timed_out: boolean;
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: Array<{
      _index: string;
      _id: string;
      _score: number;
      _source: T;
    }>;
  };
}

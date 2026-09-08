// Exact TypeScript DTOs matching Spring Boot backend Domain models

export type BackendOfferingType = 'PRODUCT' | 'SERVICE' | 'BUNDLE';

export type BackendOfferingCategory =
  | 'FURNITURE'
  | 'DECOR'
  | 'LIGHTING'
  | 'BEDDING'
  | 'BATH'
  | 'KITCHEN'
  | 'OUTDOOR'
  | 'STORAGE'
  | 'RUGS'
  | 'WALL_ART'
  | 'OTHER';

export type BackendPublishingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PricingResDTO {
  cost_price: number | null;
  selling_price: number | null;
  discount: number | null;
  gst_rate: string | null;
  units: string | null;
  margin_percentage: number | null;
  desc?: string | null;
}

export interface InventoryResDTO {
  sku_Id: string;
  current_stock: number;
  minimum_stock_level: number;
  reorder_quantity: number;
  sourcingLogistics?: {
    preferred_vendor?: string | null;
    lead_time?: number | null;
  } | null;
}

export interface InternalResDTO {
  visibility_status?: {
    publishing_status?: BackendPublishingStatus | string;
    visibility?: boolean;
    schedule_launch?: string | null;
  } | null;
  access_permissions?: {
    allowed_users?: string[];
    restricted_region?: string;
  } | null;
  system_hooks_integration?: {
    erp_module_integration?: {
      sales_module?: boolean;
      inventory_sync?: boolean;
      procurement_pipeline?: boolean;
      accounting_code?: string;
    };
  } | null;
  audit_trail_notes?: {
    desc?: string;
  } | null;
}

export interface MediaResDTO {
  primary_image?: string;
  gallery_images?: string[];
  video_link?: string;
  image_360?: string;
  product_brochure?: string;
  upload_draw?: string;
}

export interface SpecificationsResDTO {
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
}

export interface SEOResDTO {
  page_title?: string;
  meta_desc?: string;
  url_slug?: string;
  keywords?: string[];
}

// Prod_Data_Res_DTO & full Product representation from backend
export interface ProdDataResDTO {
  prodId: number;
  offering_name: string;
  offering_type: BackendOfferingType | string;
  pricing?: PricingResDTO | null;
  sku_id: string;
  category: BackendOfferingCategory | string;
  brand?: string | null;
  tags?: string[] | null;
  short_desc?: string | null;
  long_desc?: string | null;
  featured_offer?: boolean;
  inventory?: InventoryResDTO | null;
  media?: MediaResDTO | null;
  specifications?: SpecificationsResDTO | null;
  seo?: SEOResDTO | null;
  internal?: InternalResDTO | null;
}

// Secondary category response DTO with recursive subCategory hierarchy
export interface SecondaryCatResData {
  secondaryCategoryId: number;
  secondaryCategoryName: string;
  secondaryCategoryDescription?: string | null;
  subCategory?: SecondaryCatResData[] | null;
  products?: ProdDataResDTO[] | null;
}

// Primary category response DTO
export interface PrimaryCatResData {
  primaryCategoryId: number;
  primaryCategoryName: string;
  primaryCategoryDescription?: string | null;
  subCategory?: SecondaryCatResData[] | null;
  products?: ProdDataResDTO[] | null;
}

// Spring Data Page response format
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Typed Elasticsearch contracts
export interface ElasticsearchFilterQuery {
  term?: Record<string, string | number | boolean>;
  match?: Record<string, string>;
  range?: Record<string, { gte?: number; lte?: number; gt?: number; lt?: number }>;
}

export interface ElasticsearchSearchRequest {
  query?: {
    bool?: {
      must?: Array<ElasticsearchFilterQuery | Record<string, any>>;
      filter?: Array<ElasticsearchFilterQuery | Record<string, any>>;
      should?: Array<ElasticsearchFilterQuery | Record<string, any>>;
      must_not?: Array<ElasticsearchFilterQuery | Record<string, any>>;
    };
  };
  from?: number;
  size?: number;
  sort?: Array<Record<string, 'asc' | 'desc'>>;
}

export interface ElasticsearchHit<T> {
  _index: string;
  _id: string;
  _score: number;
  _source: T;
}

export interface ElasticsearchSearchResponse<T> {
  took: number;
  timed_out: boolean;
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number | null;
    hits: ElasticsearchHit<T>[];
  };
}

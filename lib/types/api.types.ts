// API Response Types for Category & Product Endpoints
import {
  PrimaryCatResData,
  SecondaryCatResData,
  ProdDataResDTO,
  PageResponse,
  ElasticsearchSearchRequest,
  ElasticsearchSearchResponse,
} from './dto.types';

export * from './dto.types';

export interface SubCategory {
  subCategoryId?: string | number;
  subCategoryName?: string;
  subCategoryDescription?: string;
  secondaryCategoryId?: string | number;
  secondaryCategoryName?: string;
  subCategory?: SubCategory[];
  products?: Product[];
}

export interface Product {
  prodId?: number | string;
  productId?: string | number;
  productName?: string;
  productDescription?: string;
  price?: number | null;
  stock?: number;
  sku?: string;
  brand?: string;
  // Actual API fields from category endpoint
  offering_name?: string;
  offering_type?: string;
  category?: string;
  sku_id?: string;
  pricing?: {
    selling_price?: number | null;
    cost_price?: number | null;
    cost?: number | null;
    discount?: number | null;
    gst_rate?: string | null;
    units?: string | null;
    margin_percentage?: number | null;
    desc?: string | null;
  } | null;
  inventory?: {
    sku_Id?: string;
    current_stock?: number;
    minimum_stock_level?: number;
    reorder_quantity?: number;
    sourcingLogistics?: {
      preferred_vendor?: string | null;
      lead_time?: number | null;
    };
  } | null;
  internal?: {
    visibility_status?: {
      publishing_status?: string;
      visibility?: boolean;
    };
  } | null;
  [key: string]: any;
}

// Primary Category API Response
export interface PrimaryCategory {
  primaryCategoryId: string | number;
  primaryCategoryName: string;
  primaryCategoryDescription?: string;
  subCategory?: SecondaryCategory[];
  products?: Product[];
}

export interface PrimaryCategoryResponse {
  data?: PrimaryCategory[];
  categories?: PrimaryCategory[];
  [key: string]: any;
}

// Secondary Category API Response
export interface SecondaryCategory {
  secondaryCategoryId: string | number;
  secondaryCategoryName: string;
  secondaryCategoryDescription?: string;
  subCategory?: SecondaryCategory[];
  products?: Product[];
}

export interface SecondaryCategoryResponse {
  data?: SecondaryCategory[];
  categories?: SecondaryCategory[];
  [key: string]: any;
}

// Category Type for dropdown
export type CategoryType = 'all' | 'primary' | 'secondary';

// API Error Response
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

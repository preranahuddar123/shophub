// ============================================================================
// REQUEST TYPES - UI → Backend
// Parameters constructed by UI / Redux and sent to Elasticsearch backend
// ============================================================================

import { PaginationRequest } from './pagination.types';

export type { PaginationRequest };

/**
 * Price range filter criteria
 */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Filter configuration for Elasticsearch search requests
 */
export interface FilterRequest {
  types?: string[];          // e.g. ['PRODUCT', 'SERVICE', 'BUNDLE']
  statuses?: string[];       // e.g. ['PUBLISHED', 'DRAFT', 'IN_REVIEW']
  vendors?: string[];        // e.g. ['VENDOR_A', 'IN_HOUSE']
  categories?: string[];     // e.g. ['FURNITURE', 'LIGHTING', 'DECOR']
  stocks?: string[];         // e.g. ['In Stock', 'Low Stock', 'Out of Stock']
  priceRange?: PriceRange;   // Min and max price limits
}

/**
 * Sort options for search requests
 */
export interface SortRequest {
  field: string;             // Field to sort by, e.g. 'offering_name', 'pricing.selling_price'
  order: 'asc' | 'desc';     // Sort direction
}

/**
 * Search request payload sent to Elasticsearch backend
 * POST /api/v1/search/offerings
 */
export interface OfferingSearchRequest {
  query: string;                 // Search keyword
  filters?: FilterRequest;       // Applied filter criteria
  pagination: PaginationRequest; // Pagination controls
  sort?: SortRequest;            // Optional sorting
}

/**
 * Request payload for fetching available filter options (if needed)
 */
export interface FilterOptionsRequest {
  category?: string;
}

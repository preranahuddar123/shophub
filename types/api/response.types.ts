// ============================================================================
// RESPONSE TYPES - Backend → UI
// Contracts for responses returned from Elasticsearch and supporting APIs
// ============================================================================

import { PaginationResponse } from './pagination.types';
import { OfferingResponse } from '../offerings/offering.types';

export type { PaginationResponse, OfferingResponse };

/**
 * Elasticsearch search query execution metadata
 */
export interface SearchMetadata {
  took: number;            // Query time in ms
  timed_out?: boolean;     // Query timeout status
  total?: number;          // Total matching records
  maxScore?: number;       // Relevance score
}

/**
 * Paginated search response returned from Elasticsearch backend
 * POST /api/v1/search/offerings
 */
export interface OfferingSearchResponse {
  data: OfferingResponse[];    // Document list
  meta: PaginationResponse;    // Pagination metadata
  took: number;                // Elasticsearch search latency in ms
  timed_out?: boolean;
  total?: number;
}

/**
 * Filter options response returned from backend
 * GET /api/v1/search/filter-options
 */
export interface FilterOptionsResponse {
  types: string[];             // e.g. ['PRODUCT', 'SERVICE', 'BUNDLE']
  statuses: string[];          // e.g. ['PUBLISHED', 'DRAFT', 'IN_REVIEW']
  categories: string[];        // e.g. ['FURNITURE', 'LIGHTING', 'DECOR']
  vendors: string[];           // e.g. ['VENDOR_A', 'VENDOR_B', 'IN_HOUSE']
  stocks: string[];            // e.g. ['In Stock', 'Low Stock', 'Out of Stock']
  priceRange?: {
    min: number;
    max: number;
  };
}

/**
 * Normalized API error response
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

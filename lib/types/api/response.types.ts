// ============================================================================
// RESPONSE TYPES - Backend → UI
// ============================================================================

import type { PaginationResponse } from './pagination.types';
import type { OfferingResponse } from '../offerings/offering.types';

// Re-export pagination types
export type { PaginationResponse } from './pagination.types';

// Re-export offering types
export type { OfferingResponse } from '../offerings/offering.types';

/**
 * Elasticsearch search response metadata
 */
export interface SearchMetadata {
  took: number;          // Time taken in milliseconds
  timed_out: boolean;    // Whether the search timed out
  total: number;         // Total matching documents
  maxScore?: number;     // Maximum relevance score
}

/**
 * Paginated search response from Elasticsearch backend
 */
export interface OfferingSearchResponse {
  data: OfferingResponse[]; // Results content
  meta: PaginationResponse;  // Pagination metadata
  took: number;              // Elasticsearch query time in ms
  timed_out?: boolean;       // Whether query timed out
  total?: number;            // Total matching documents
}

/**
 * Filter options response from backend
 */
export interface FilterOptionsResponse {
  types: string[];           // Available offering types: [PRODUCT, SERVICE]
  statuses: string[];        // Available statuses: [PUBLISHED, DRAFT]
  categories: string[];      // Available categories: [LIGHTING, ELECTRONICS]
  vendors: string[];         // Available vendors/offering names
  stocks: string[];          // Available stock levels: [In Stock, Low Stock, Pre-order, Unlimited]
  priceRange: {
    min: number;
    max: number;
  };
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

// ============================================================================
// REQUEST TYPES - UI → Backend
// ============================================================================

import type { PaginationRequest } from './pagination.types';

// Re-export pagination types
export type { PaginationRequest } from './pagination.types';

/**
 * Filter configuration for search requests
 */
export interface FilterRequest {
  types?: string[];          // Offering types: ['Product', 'Service']
  statuses?: string[];       // Statuses: ['Active', 'Draft', 'Published']
  vendors?: string[];        // Vendor/offering names
  categories?: string[];     // Product categories: ['LIGHTING', 'ELECTRONICS']
  stocks?: string[];         // Stock levels: ['In Stock', 'Low Stock', 'Pre-order', 'Unlimited']
  priceRange?: PriceRange;   // Price range filter
}

/**
 * Price range filter
 */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Search request body sent to Elasticsearch backend
 */
export interface OfferingSearchRequest {
  query: string;               // Search query text
  filters?: FilterRequest;     // Filter conditions
  pagination: PaginationRequest; // Pagination configuration
  sort?: SortRequest;          // Sorting options (optional)
}

/**
 * Sort configuration
 */
export interface SortRequest {
  field: string;       // Field to sort by (e.g., 'offering_name', 'pricing.selling_price')
  order: 'asc' | 'desc'; // Sort direction
}

/**
 * Filter options request (for fetching available filter values from backend)
 */
export interface FilterOptionsRequest {
  // Empty - backend determines available options from index
}

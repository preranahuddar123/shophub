// ============================================================================
// PAGINATION TYPES - Backend → UI
// ============================================================================

/**
 * Pagination metadata from backend
 */
export interface PaginationResponse {
  page: number;          // Current page number (1-indexed)
  size: number;          // Items per page
  total: number;         // Total items across all pages
  totalPages: number;    // Total number of pages
  hasNext: boolean;      // Whether there's a next page
  hasPrevious: boolean;  // Whether there's a previous page
}

/**
 * Pagination request configuration
 */
export interface PaginationRequest {
  page: number;      // 1-indexed page number (UI convention)
  size: number;      // Number of items per page
  offset?: number;   // Offset for pagination
}

/**
 * Convert PaginationResponse to PaginationRequest
 */
export function responseToRequest(
  response: PaginationResponse,
  size?: number
): PaginationRequest {
  return {
    page: response.page,
    size: size || response.size,
    offset: (response.page - 1) * (size || response.size),
  };
}
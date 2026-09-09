// ============================================================================
// PAGINATION TYPES - Contracts between UI and Backend
// ============================================================================

/**
 * Pagination metadata returned from backend responses
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
 * Pagination parameters sent in backend requests
 */
export interface PaginationRequest {
  page: number;          // 1-indexed page number
  size: number;          // Number of items per page
  offset?: number;       // Calculated offset for backend queries
}

/**
 * Helper to convert PaginationResponse to PaginationRequest
 */
export function responseToPaginationRequest(
  response: PaginationResponse,
  size?: number
): PaginationRequest {
  const pageSize = size || response.size;
  return {
    page: response.page,
    size: pageSize,
    offset: Math.max(0, (response.page - 1) * pageSize),
  };
}

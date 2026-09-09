// ============================================================================
// CONSOLIDATED TYPE EXPORTS
// All types are organized under lib/types/ directory
// ============================================================================

// API Types
export type {
  PaginationResponse,
  PaginationRequest,
} from './types/api/pagination.types';

export type {
  FilterRequest,
  PriceRange,
  OfferingSearchRequest,
  SortRequest,
  FilterOptionsRequest,
} from './types/api/request.types';

export type {
  OfferingResponse,
  OfferingSearchResponse,
  FilterOptionsResponse,
  ApiErrorResponse,
  SearchMetadata,
} from './types/api/response.types';

// Offering Types
export {
  getOfferingTypeBadgeClass,
  getStatusBadgeClass,
  getStockDisplay,
  formatOfferingDate,
} from './types/offerings/offering.types';

// DTO Types (legacy, for backwards compatibility)
export type {
  PaginationRequestDto,
  PaginationMetaDto,
  SearchRequestDto,
  SearchResponseDto,
  FilterRequestDto,
  OfferingResponseDto,
  FilterOptionsResponseDto,
  BulkFilterRequestDto,
  BulkFilterResponseDto,
  OfferingsPageStateDto,
  ApiErrorResponseDto,
  CategoryProductDto,
  PrimaryCategoryDto,
  SecondaryCategoryDto,
} from './types/dto.types';

// Category Types
export type { CategoryType } from './types/api.types';

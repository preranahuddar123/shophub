/**
 * Elasticsearch Service
 * Handles API communication with the Elasticsearch backend endpoints
 * 
 * Endpoints:
 * - POST /search/offerings -> search, filter, paginate offerings
 * - GET  /search/filter-options -> fetch dynamic filter options
 */

import apiClient from '@/lib/api/axios-instance';
import { OfferingSearchRequest } from '@/types/api/request.types';
import {
  OfferingSearchResponse,
  FilterOptionsResponse,
  ApiErrorResponse,
} from '@/types/api/response.types';

/**
 * Search offerings with full query, filters, sorting, and pagination
 * Calls POST /api/v1/search/offerings
 */
export const searchOfferings = async (
  request: OfferingSearchRequest
): Promise<OfferingSearchResponse> => {
  try {
    const response = await apiClient.post<OfferingSearchResponse>(
      '/search/offerings',
      request
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiErrorResponse = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to search offerings via Elasticsearch',
      code: error.response?.data?.code,
      details: error.response?.data,
      timestamp: new Date().toISOString(),
    };
    throw apiError;
  }
};

/**
 * Fetch dynamic filter options aggregation from Elasticsearch backend
 * Calls GET /api/v1/search/filter-options
 */
export const getFilterOptions = async (): Promise<FilterOptionsResponse> => {
  try {
    const response = await apiClient.get<FilterOptionsResponse>(
      '/search/filter-options'
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiErrorResponse = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch filter options from Elasticsearch',
      code: error.response?.data?.code,
      details: error.response?.data,
      timestamp: new Date().toISOString(),
    };
    throw apiError;
  }
};

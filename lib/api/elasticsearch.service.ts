/**
 * Elasticsearch Service
 * Handles API communication with Elasticsearch backend
 * 
 * Responsibilities:
 * - Construct/send backend requests
 * - Receive/backend responses
 * - Return typed responses
 * 
 * NOT responsible for:
 * - UI rendering logic
 * - Client-side filtering algorithms
 * - Pagination calculations
 */

import apiClient from './axios-instance';
import {
  OfferingSearchRequest,
  FilterRequest,
  PaginationRequest,
} from '../types/api/request.types';
import {
  OfferingSearchResponse,
  FilterOptionsResponse,
  ApiErrorResponse,
} from '../types/api/response.types';

/**
 * Search offerings using Elasticsearch
 * POST /api/v1/search/offerings
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
      message: error.response?.data?.message || error.message || 'Search failed',
      code: error.response?.data?.code,
      timestamp: new Date().toISOString(),
    };
    throw apiError;
  }
};

/**
 * Get available filter options from Elasticsearch
 * GET /api/v1/search/filter-options
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
      message: error.response?.data?.message || error.message || 'Failed to fetch filter options',
      code: error.response?.data?.code,
      timestamp: new Date().toISOString(),
    };
    throw apiError;
  }
};

/**
 * Advanced search with filters and pagination
 * Combines search query + filters + pagination in single request
 */
export const advancedSearch = async (
  query: string,
  filters: FilterRequest,
  page: number = 1,
  size: number = 10
): Promise<OfferingSearchResponse> => {
  const request: OfferingSearchRequest = {
    query,
    filters,
    pagination: {
      page,
      size,
      offset: (page - 1) * size,
    },
  };

  return searchOfferings(request);
};

/**
 * Get all offerings with pagination (no search query)
 */
export const getAllOfferings = async (
  page: number = 1,
  size: number = 10,
  filters?: FilterRequest
): Promise<OfferingSearchResponse> => {
  const request: OfferingSearchRequest = {
    query: '', // Empty query returns all
    filters,
    pagination: {
      page,
      size,
      offset: (page - 1) * size,
    },
  };

  return searchOfferings(request);
};

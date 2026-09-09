import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  searchOfferings,
  getFilterOptions,
} from '@/services/offerings/elasticsearch.service';
import {
  OfferingSearchRequest,
  FilterRequest,
  PaginationRequest,
} from '@/types/api/request.types';
import {
  OfferingSearchResponse,
  FilterOptionsResponse,
  ApiErrorResponse,
} from '@/types/api/response.types';
import {
  setSearchQuery,
  setFilters,
  setPagination,
  resetAll,
} from './offeringsSlice';

/**
 * Async thunk to execute Elasticsearch search request.
 * Constructs the backend request directly from current Redux state.
 */
export const executeSearchThunk = createAsyncThunk<
  OfferingSearchResponse,
  Partial<OfferingSearchRequest> | void,
  { rejectValue: ApiErrorResponse }
>('offerings/executeSearch', async (customParams, { getState, rejectWithValue }) => {
  try {
    const rootState = getState() as any;
    const offeringsState = rootState.offerings;

    const request: OfferingSearchRequest = {
      query:
        customParams?.query !== undefined
          ? customParams.query
          : offeringsState.searchQuery || '',
      filters:
        customParams?.filters !== undefined
          ? customParams.filters
          : offeringsState.filters || {},
      pagination: {
        page:
          customParams?.pagination?.page !== undefined
            ? customParams.pagination.page
            : offeringsState.pagination.page || 1,
        size:
          customParams?.pagination?.size !== undefined
            ? customParams.pagination.size
            : offeringsState.pagination.size || 10,
        offset: Math.max(
          0,
          ((customParams?.pagination?.page || offeringsState.pagination.page || 1) - 1) *
            (customParams?.pagination?.size || offeringsState.pagination.size || 10)
        ),
      },
      sort: customParams?.sort || offeringsState.sort,
    };

    const response = await searchOfferings(request);
    return response;
  } catch (error: any) {
    const apiError: ApiErrorResponse = {
      status: error.status || error.response?.status || 500,
      message: error.message || 'Elasticsearch search failed',
      code: error.code || error.response?.data?.code,
      details: error.details,
      timestamp: new Date().toISOString(),
    };
    return rejectWithValue(apiError);
  }
});

/**
 * Async thunk to fetch dynamic filter options from backend
 */
export const fetchFilterOptionsThunk = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: ApiErrorResponse }
>('offerings/fetchFilterOptions', async (_, { rejectWithValue }) => {
  try {
    const response = await getFilterOptions();
    return response;
  } catch (error: any) {
    const apiError: ApiErrorResponse = {
      status: error.status || error.response?.status || 500,
      message: error.message || 'Failed to retrieve filter options',
      code: error.code || error.response?.data?.code,
      details: error.details,
      timestamp: new Date().toISOString(),
    };
    return rejectWithValue(apiError);
  }
});

/**
 * Composite Thunk: Initiates search with a new search keyword
 * Updates Redux state, resets page to 1, and triggers Elasticsearch backend search
 */
export const handleSearchAction = (query: string) => async (dispatch: any) => {
  dispatch(setSearchQuery(query));
  return dispatch(executeSearchThunk({ query, pagination: { page: 1, size: 10 } }));
};

/**
 * Composite Thunk: Applies new filters
 * Updates Redux state, resets page to 1, and triggers Elasticsearch backend search
 */
export const handleFilterAction =
  (filters: Partial<FilterRequest>) => async (dispatch: any, getState: any) => {
    dispatch(setFilters(filters));
    const currentFilters = (getState() as any).offerings.filters;
    return dispatch(
      executeSearchThunk({
        filters: currentFilters,
        pagination: { page: 1, size: 10 },
      })
    );
  };

/**
 * Composite Thunk: Changes current page
 * Updates Redux state and requests the page from Elasticsearch backend
 */
export const handlePageAction =
  (page: number) => async (dispatch: any, getState: any) => {
    dispatch(setPagination({ page }));
    const pageSize = (getState() as any).offerings.pagination.size || 10;
    return dispatch(
      executeSearchThunk({
        pagination: { page, size: pageSize },
      })
    );
  };

/**
 * Composite Thunk: Clears all filters and resets search
 */
export const handleClearAllAction = () => async (dispatch: any) => {
  dispatch(resetAll());
  return dispatch(
    executeSearchThunk({
      query: '',
      filters: {},
      pagination: { page: 1, size: 10 },
    })
  );
};

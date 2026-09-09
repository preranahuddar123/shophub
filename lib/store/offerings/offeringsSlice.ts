import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { advancedSearch, getFilterOptions } from '../../api/elasticsearch.service';
import {
  OfferingSearchRequest,
  FilterRequest,
  PaginationRequest,
} from '../../types/api/request.types';
import {
  OfferingSearchResponse,
  FilterOptionsResponse,
  ApiErrorResponse,
} from '../../types/api/response.types';

// ============================================================================
// TYPES
// ============================================================================

export interface OfferingsState {
  // Search request state (what we're sending to backend)
  searchQuery: string;
  filterRequest: FilterRequest;
  paginationRequest: PaginationRequest;
  
  // Search response state (what we received from backend)
  searchResponse: OfferingSearchResponse | null;
  filterOptions: FilterOptionsResponse | null;
  
  // Loading/error state
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_PAGINATION: PaginationRequest = {
  page: 1,
  size: 10,
};

const INITIAL_FILTER_REQUEST: FilterRequest = {
  types: [],
  statuses: [],
  vendors: [],
  categories: [],
  stocks: [],
};

const initialState: OfferingsState = {
  searchQuery: '',
  filterRequest: INITIAL_FILTER_REQUEST,
  paginationRequest: INITIAL_PAGINATION,
  
  searchResponse: null,
  filterOptions: null,
  
  isLoading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Perform search with query, filters, and pagination
 */
export const performSearch = createAsyncThunk<
  OfferingSearchResponse,
  { query: string; filters: FilterRequest; pagination: PaginationRequest },
  { rejectValue: string }
>(
  'offerings/performSearch',
  async (
    { query, filters, pagination },
    { rejectWithValue }
  ) => {
    try {
      const response = await advancedSearch(
        query,
        filters,
        pagination.page,
        pagination.size
      );
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Search failed';
      console.error('Search error:', message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch filter options from backend
 */
export const fetchFilterOptions = createAsyncThunk<
  FilterOptionsResponse,
  void,
  { rejectValue: string }
>(
  'offerings/fetchFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const options = await getFilterOptions();
      return options;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to fetch filter options';
      console.error('Fetch filter options error:', message);
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// REDUCER
// ============================================================================

export const offeringsSlice = createSlice({
  name: 'offerings',
  initialState,
  reducers: {
    // Update search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    // Update filters (does not trigger search)
    setFilters: (state, action: PayloadAction<FilterRequest>) => {
      state.filterRequest = { ...state.filterRequest, ...action.payload };
    },
    
    // Update pagination
    setPagination: (state, action: PayloadAction<PaginationRequest>) => {
      state.paginationRequest = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset all offerings state
    resetOfferings: (state) => {
      state.searchQuery = '';
      state.filterRequest = INITIAL_FILTER_REQUEST;
      state.paginationRequest = INITIAL_PAGINATION;
      state.searchResponse = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // performSearch
    builder
      .addCase(performSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResponse = action.payload;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Search failed';
        // Keep previous data on error
        if (!state.searchResponse) {
          state.searchResponse = {
            data: [],
            meta: {
              page: 1,
              size: 10,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrevious: false,
            },
            took: 0,
          };
        }
      });
    
    // fetchFilterOptions
    builder
      .addCase(fetchFilterOptions.pending, (state) => {
        // Don't set isLoading to true here to avoid UI flickering
        // This is typically called once on mount
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        // Successfully fetched filter options from backend
        state.filterOptions = action.payload;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        // Silently handle filter options error - search still works
        // Use fallback/empty options, but don't block the UI
        console.warn('Failed to fetch filter options from backend:', action.error.message);
        state.filterOptions = {
          types: [],
          statuses: [],
          categories: [],
          vendors: [],
          stocks: [],
          priceRange: { min: 0, max: 0 },
        };
      });
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  setSearchQuery,
  setFilters,
  setPagination,
  clearError,
  resetOfferings,
} = offeringsSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

export const selectOfferings = (state: { offerings: OfferingsState }) =>
  state.offerings.searchResponse?.data ?? [];

export const selectFilterOptions = (state: { offerings: OfferingsState }) =>
  state.offerings.filterOptions;

export const selectSearchQuery = (state: { offerings: OfferingsState }) =>
  state.offerings.searchQuery;

export const selectFilters = (state: { offerings: OfferingsState }) =>
  state.offerings.filterRequest;

export const selectPagination = (state: { offerings: OfferingsState }) =>
  state.offerings.searchResponse?.meta ?? {
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };

export const selectIsLoading = (state: { offerings: OfferingsState }) =>
  state.offerings.isLoading;

export const selectError = (state: { offerings: OfferingsState }) =>
  state.offerings.error;

// ============================================================================
// EXPORT
// ============================================================================

export default offeringsSlice.reducer;

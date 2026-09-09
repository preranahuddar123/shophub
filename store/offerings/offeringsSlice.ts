import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FilterRequest,
  PaginationRequest,
  SortRequest,
} from '@/types/api/request.types';
import {
  PaginationResponse,
  FilterOptionsResponse,
} from '@/types/api/response.types';
import { Offering, OfferingResponse } from '@/types/offerings/offering.types';
import { mapOfferingResponsesToUI } from '@/utils/offerings/offerings.mapper';
import { executeSearchThunk, fetchFilterOptionsThunk } from './offeringsThunks';

export interface OfferingsState {
  // Search request parameters (UI → Backend)
  searchQuery: string;
  filters: FilterRequest;
  pagination: PaginationRequest;
  sort?: SortRequest;

  // Search response data (Backend → UI)
  offerings: Offering[];
  rawOfferings: OfferingResponse[];
  paginationMeta: PaginationResponse;
  filterOptions: FilterOptionsResponse | null;

  // Status flags
  isLoading: boolean;
  error: string | null;
}

const initialPaginationRequest: PaginationRequest = {
  page: 1,
  size: 10,
  offset: 0,
};

const initialPaginationMeta: PaginationResponse = {
  page: 1,
  size: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
};

const initialFilters: FilterRequest = {
  types: [],
  statuses: [],
  vendors: [],
  categories: [],
  stocks: [],
};

const initialState: OfferingsState = {
  searchQuery: '',
  filters: initialFilters,
  pagination: initialPaginationRequest,
  offerings: [],
  rawOfferings: [],
  paginationMeta: initialPaginationMeta,
  filterOptions: null,
  isLoading: false,
  error: null,
};

export const offeringsSlice = createSlice({
  name: 'offerings',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
      state.pagination.offset = 0;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterRequest>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.pagination.page = 1;
      state.pagination.offset = 0;
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationRequest>>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    setSort: (state, action: PayloadAction<SortRequest | undefined>) => {
      state.sort = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialFilters;
      state.pagination.page = 1;
      state.pagination.offset = 0;
    },
    resetAll: (state) => {
      state.searchQuery = '';
      state.filters = initialFilters;
      state.pagination = initialPaginationRequest;
      state.sort = undefined;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // executeSearchThunk
    builder
      .addCase(executeSearchThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(executeSearchThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.rawOfferings = action.payload.data || [];
        state.offerings = mapOfferingResponsesToUI(action.payload.data || []);
        state.paginationMeta = action.payload.meta || {
          page: state.pagination.page,
          size: state.pagination.size,
          total: action.payload.total ?? (action.payload.data?.length || 0),
          totalPages: Math.ceil(
            (action.payload.total ?? (action.payload.data?.length || 0)) /
              state.pagination.size
          ),
          hasNext: false,
          hasPrevious: state.pagination.page > 1,
        };
      })
      .addCase(executeSearchThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as any)?.message ||
          action.error.message ||
          'Failed to fetch offerings from Elasticsearch';
      });

    // fetchFilterOptionsThunk
    builder
      .addCase(fetchFilterOptionsThunk.pending, () => {
        // Background load filter options without setting full page loading
      })
      .addCase(fetchFilterOptionsThunk.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      .addCase(fetchFilterOptionsThunk.rejected, (state, action) => {
        console.error('Failed to load filter options from backend:', action.payload || action.error);
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  setPagination,
  setSort,
  clearFilters,
  resetAll,
  clearError,
} = offeringsSlice.actions;

export default offeringsSlice.reducer;

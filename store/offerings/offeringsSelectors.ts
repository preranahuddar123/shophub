import { OfferingsState } from './offeringsSlice';

interface StateWithOfferings {
  offerings: OfferingsState;
}

export const selectOfferings = (state: StateWithOfferings) =>
  state.offerings.offerings;

export const selectRawOfferings = (state: StateWithOfferings) =>
  state.offerings.rawOfferings;

export const selectFilterOptions = (state: StateWithOfferings) =>
  state.offerings.filterOptions;

export const selectSearchQuery = (state: StateWithOfferings) =>
  state.offerings.searchQuery;

export const selectFilters = (state: StateWithOfferings) =>
  state.offerings.filters;

export const selectPagination = (state: StateWithOfferings) =>
  state.offerings.paginationMeta;

export const selectPaginationRequest = (state: StateWithOfferings) =>
  state.offerings.pagination;

export const selectIsLoading = (state: StateWithOfferings) =>
  state.offerings.isLoading;

export const selectError = (state: StateWithOfferings) =>
  state.offerings.error;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryType, FilterState } from '../../types';

const initialState: FilterState = {
  category: 'all',
  offeringCategory: 'All',
  type: 'All',
  status: 'All',
  vendor: 'All',
  stock: 'Any Status',
  search: '',
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: <K extends keyof FilterState>(
      state: FilterState,
      action: PayloadAction<{ key: K; value: FilterState[K] }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
      // Reset dependent filters when category type changes
      if (key === 'category') {
        state.offeringCategory = 'All';
        state.vendor = 'All';
      }
    },
    resetFilters: (state) => {
      state.category = 'all';
      state.offeringCategory = 'All';
      state.type = 'All';
      state.status = 'All';
      state.vendor = 'All';
      state.stock = 'Any Status';
      state.search = '';
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { setFilter, resetFilters, setSearch } = filtersSlice.actions;

export default filtersSlice.reducer;

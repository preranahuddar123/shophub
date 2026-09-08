import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import offeringsReducer from './slices/offeringsSlice';
import filtersReducer from './slices/filtersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      categories: categoriesReducer,
      offerings: offeringsReducer,
      filters: filtersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

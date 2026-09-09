import { configureStore } from '@reduxjs/toolkit';
import offeringsReducer from './offerings/offeringsSlice';
import categoriesReducer from '@/lib/store/slices/categoriesSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      offerings: offeringsReducer,
      categories: categoriesReducer,
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

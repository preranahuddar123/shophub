import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
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

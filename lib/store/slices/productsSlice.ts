import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllProducts, getProductById } from '../../api/product.service';
import { Product } from '../../types/api.types';
import { ProdDataResDTO } from '../../types/dto.types';

export interface ProductsState {
  products: Product[];
  selectedProductId: string | null;
  selectedProduct: Product | null;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProductId: null,
  selectedProduct: null,
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  error: null,
};

export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProductsThunk',
  async ({ page = 0, size = 50, sort = 'prodId,asc' }: { page?: number; size?: number; sort?: string } = {}) => {
    const response = await getAllProducts(page, size, sort);
    return response.content as Product[];
  }
);

export const fetchProductByIdThunk = createAsyncThunk(
  'products/fetchProductByIdThunk',
  async (prodId: number | string) => {
    const product = await getProductById(prodId);
    return product as Product | null;
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setProductPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    clearSelectedProduct: (state) => {
      state.selectedProductId = null;
      state.selectedProduct = null;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load products';
      })

      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.selectedProduct = action.payload as Product;
          state.selectedProductId = String((action.payload as Product).prodId || (action.payload as Product).sku_id || '');
        } else {
          state.selectedProduct = null;
          state.selectedProductId = null;
        }
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load product details';
      });
  },
});

export const {
  setProductPage,
  setProductPageSize,
  clearSelectedProduct,
  clearProductError,
} = productsSlice.actions;

export const selectProducts = (state: { products: ProductsState }) => state.products.products;
export const selectProductLoading = (state: { products: ProductsState }) => state.products.isLoading;
export const selectProductError = (state: { products: ProductsState }) => state.products.error;
export const selectSelectedProduct = (state: { products: ProductsState }) => state.products.selectedProduct;
export const selectSelectedProductId = (state: { products: ProductsState }) => state.products.selectedProductId;
export const selectProductCurrentPage = (state: { products: ProductsState }) => state.products.currentPage || 1;
export const selectProductPageSize = (state: { products: ProductsState }) => state.products.pageSize || 10;

export default productsSlice.reducer;

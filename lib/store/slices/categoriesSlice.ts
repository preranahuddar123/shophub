import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryCategory, SecondaryCategory, Product } from '../../types/api.types';
import {
  getAllPrimaryCategories,
  getPrimaryCategoryById,
  getAllSecondaryCategories,
  getCategoriesByPrimary,
  getSecondaryCategoryById,
} from '../../api/category.service';

export interface SubOrProductItem {
  type: 'subcategory' | 'product';
  id: string;
  name: string;
  data: any;
}

export interface CategoriesState {
  categoryType: 'all' | 'primary' | 'secondary';
  mainCategories: Array<PrimaryCategory | SecondaryCategory>;
  selectedMainCategoryId: string | null;
  selectedMainCategory: PrimaryCategory | SecondaryCategory | null;

  subOrProductItems: SubOrProductItem[];
  selectedSubOrProductId: string | null;
  selectedSubOrProductItem: SubOrProductItem | null;

  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categoryType: 'all',
  mainCategories: [],
  selectedMainCategoryId: null,
  selectedMainCategory: null,

  subOrProductItems: [],
  selectedSubOrProductId: null,
  selectedSubOrProductItem: null,

  isLoading: false,
  error: null,
};

// Fetch Main Categories based on categoryType
export const fetchMainCategories = createAsyncThunk(
  'categories/fetchMainCategories',
  async (categoryType: 'primary' | 'secondary') => {
    if (categoryType === 'primary') {
      const cats = await getAllPrimaryCategories();
      return cats;
    } else {
      const cats = await getAllSecondaryCategories();
      return cats;
    }
  }
);

// Select Main Category and dynamically compute SUB CATEGORY / PRODUCT partition
export const selectMainCategoryThunk = createAsyncThunk(
  'categories/selectMainCategoryThunk',
  async ({
    categoryId,
    categoryType,
  }: {
    categoryId: string | number;
    categoryType: 'primary' | 'secondary';
  }) => {
    if (categoryType === 'primary') {
      const [detail, childSubs] = await Promise.all([
        getPrimaryCategoryById(categoryId),
        getCategoriesByPrimary(categoryId).catch(() => []),
      ]);

      const subCategories = (childSubs && childSubs.length > 0)
        ? childSubs
        : (detail?.subCategory && detail.subCategory.length > 0)
        ? detail.subCategory
        : [];

      const directProducts = detail?.products || [];

      // Determine partition: subcategories first if present, otherwise direct products
      const items: SubOrProductItem[] = [];
      if (subCategories.length > 0) {
        subCategories.forEach((sub) => {
          items.push({
            type: 'subcategory',
            id: String(sub.secondaryCategoryId),
            name: sub.secondaryCategoryName,
            data: sub,
          });
        });
      } else if (directProducts.length > 0) {
        directProducts.forEach((prod) => {
          items.push({
            type: 'product',
            id: String(prod.prodId || prod.sku_id),
            name: prod.offering_name || 'Unnamed Product',
            data: prod,
          });
        });
      }

      return {
        categoryId: String(categoryId),
        detail,
        items,
      };
    } else {
      // Secondary Category selected
      const detail = await getSecondaryCategoryById(categoryId);
      const subCategories = detail?.subCategory || [];
      const directProducts = detail?.products || [];

      const items: SubOrProductItem[] = [];
      if (subCategories.length > 0) {
        subCategories.forEach((sub) => {
          items.push({
            type: 'subcategory',
            id: String(sub.secondaryCategoryId),
            name: sub.secondaryCategoryName,
            data: sub,
          });
        });
      } else if (directProducts.length > 0) {
        directProducts.forEach((prod) => {
          items.push({
            type: 'product',
            id: String(prod.prodId || prod.sku_id),
            name: prod.offering_name || 'Unnamed Product',
            data: prod,
          });
        });
      }

      return {
        categoryId: String(categoryId),
        detail,
        items,
      };
    }
  }
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoryType: (state, action: PayloadAction<'all' | 'primary' | 'secondary'>) => {
      state.categoryType = action.payload;
      state.selectedMainCategoryId = null;
      state.selectedMainCategory = null;
      state.subOrProductItems = [];
      state.selectedSubOrProductId = null;
      state.selectedSubOrProductItem = null;
      state.error = null;
    },
    clearMainCategorySelection: (state) => {
      state.selectedMainCategoryId = null;
      state.selectedMainCategory = null;
      state.subOrProductItems = [];
      state.selectedSubOrProductId = null;
      state.selectedSubOrProductItem = null;
    },
    selectSubOrProduct: (state, action: PayloadAction<string | null>) => {
      state.selectedSubOrProductId = action.payload;
      if (!action.payload || action.payload === 'all') {
        state.selectedSubOrProductItem = null;
      } else {
        const found = state.subOrProductItems.find((item) => item.id === action.payload);
        state.selectedSubOrProductItem = found || null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMainCategories
      .addCase(fetchMainCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMainCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mainCategories = action.payload;
      })
      .addCase(fetchMainCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load categories';
      })
      // selectMainCategoryThunk
      .addCase(selectMainCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectMainCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMainCategoryId = action.payload.categoryId;
        state.selectedMainCategory = action.payload.detail;
        state.subOrProductItems = action.payload.items;
        state.selectedSubOrProductId = null;
        state.selectedSubOrProductItem = null;
      })
      .addCase(selectMainCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load category details';
      });
  },
});

export const {
  setCategoryType,
  clearMainCategorySelection,
  selectSubOrProduct,
  clearError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

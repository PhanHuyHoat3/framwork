import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { brandProductAPi, fetchCategoryByIdApi } from '../api/productApi';

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  image: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

interface ProductState {
  productsByCategory: { [key: number]: Product[] };
  categoryDescriptions: { [key: number]: string };
  categoryName: { [key: number]: string };
  loading: boolean;
}

const initialState: ProductState = {
  productsByCategory: {},
  categoryDescriptions: {},
  categoryName: {},
  loading: false,
};

// 🛠 Fetch sản phẩm + mô tả danh mục cùng lúc
export const fetchProductsWithCategory = createAsyncThunk(
  'brandProduct/fetchProductsWithCategory',
  async (categoryId: number) => {
    const [products, category] = await Promise.all([
      brandProductAPi(categoryId), // Lấy sản phẩm
      fetchCategoryByIdApi(categoryId), // Lấy danh mục
    ]);
    return {
      categoryId,
      products,
      categoryDescription: category?.description || 'Không có mô tả',
      categoryName: category?.name || 'Không có tên',
    };
  }
);


const productSlice = createSlice({
  name: 'brandProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsWithCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProductsWithCategory.fulfilled,
        (
          state,
          action: PayloadAction<{
            categoryId: number;
            products: Product[];
            categoryDescription: string;
            categoryName: string;
          }>
        ) => {
          state.loading = false;
          state.productsByCategory[action.payload.categoryId] =
            action.payload.products;
          state.categoryDescriptions[action.payload.categoryId] =
            action.payload.categoryDescription;
          state.categoryName[action.payload.categoryId] =
            action.payload.categoryName;
        }
    )
      .addCase(fetchProductsWithCategory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;

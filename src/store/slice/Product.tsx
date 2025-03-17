import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './nameProduct';
import { ProductsApi } from '../api/productApi';

// 📌 API URL giả định

// 📌 Định nghĩa kiểu dữ liệu sản phẩm

// 📌 Trạng thái ban đầu của Redux Store
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// 📌 Giá trị mặc định ban đầu
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// 🎯 Thunk lấy danh sách sản phẩm từ API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      return await ProductsApi();
    } catch (error) {
      console.error('❌ Lỗi API sản phẩm:', error);
    }
  }
);

// 🎯 Slice quản lý sản phẩm
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Cập nhật danh sách sản phẩm theo cách thủ công
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Xuất reducer & actions
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;

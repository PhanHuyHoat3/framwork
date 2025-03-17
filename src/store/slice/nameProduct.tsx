import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { brandProductAPi } from '../api/productApi';
import { fetchCategoryByIdApi } from '../api/categoryApi';

// 📌 Định nghĩa kiểu dữ liệu sản phẩm
export interface Product {
  id: number;
  name: string;
  brand: string;
  categoryId: number;
  price: number;
  sale: number;
  stock: number;
  image: string;
  description: string;
  new: boolean;
  outstanding: boolean;
  best: boolean;
  specs: {
    screen: string;
    processor: string;
    camera: string;
    battery: string;
    storage?: string[];
    colors: {
      name: string;
      image: string;
    }[];
  };
}

// 📌 Định nghĩa kiểu dữ liệu danh mục sản phẩm
export interface Category {
  id: number;
  name: string;
  description: string;
}

// 📌 Trạng thái ban đầu của Redux Store
interface ProductState {
  products: Product[]; // Danh sách tất cả sản phẩm
  productsByCategory: { [key: number]: Product[] }; // Sản phẩm theo danh mục
  categoryDescriptions: { [key: number]: string }; // Mô tả danh mục
  categoryName: { [key: number]: string }; // Tên danh mục
  loading: boolean;
  error: string | null; // Thêm trạng thái lưu lỗi
}

const initialState: ProductState = {
  products: [],
  productsByCategory: {},
  categoryDescriptions: {},
  categoryName: {},
  loading: false,
  error: null,
};

// 🛠 Fetch sản phẩm theo danh mục + mô tả danh mục cùng lúc
export const fetchProductsWithCategory = createAsyncThunk(
  'brandProduct/fetchProductsWithCategory',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const [products, category] = await Promise.all([
        brandProductAPi(categoryId), // Lấy danh sách sản phẩm theo danh mục
        fetchCategoryByIdApi(categoryId), // Lấy thông tin danh mục
      ]);

      if (!products) throw new Error('Không lấy được sản phẩm');
      if (!category) throw new Error('Không lấy được danh mục');

      return {
        categoryId,
        products,
        categoryDescription: category.description || 'Không có mô tả',
        categoryName: category.name || 'Không có tên',
      };
    } catch (error) {
      return rejectWithValue(error || 'Lỗi không xác định');
    }
  }
);

// 🎯 Slice quản lý sản phẩm
const productSlice = createSlice({
  name: 'brandProduct',
  initialState,
  reducers: {
    // 📌 Hành động cập nhật danh sách sản phẩm chung
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsWithCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
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
          state.products = [...state.products, ...action.payload.products]; // Cập nhật danh sách sản phẩm chung
        }
      )
      .addCase(fetchProductsWithCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Xuất reducer & actions
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;

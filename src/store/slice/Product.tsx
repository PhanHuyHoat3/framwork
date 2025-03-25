import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductsApi, updateProductStock } from '../api/productApi';
import { Product } from './nameProduct';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// 🎯 Thunk lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const data = await ProductsApi();
    if (!data) throw new Error('Không tìm thấy sản phẩm nào');
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Lỗi không xác định');
  }
});

// 🎯 Thunk cập nhật số lượng tồn kho sau khi đặt hàng
export const updateStock = createAsyncThunk<
  { productId: number; newStock: number },
  { productId: number; quantity: number },
  { rejectValue: string }
>(
  'products/updateStock',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      // 📌 Lấy thông tin sản phẩm hiện tại
      const product = await ProductsApi().then((products) =>
        products.find((p) => p.id === productId)
      );

      if (!product) throw new Error('Sản phẩm không tồn tại');

      const updatedStock = product.stock - quantity; // ✅ Giảm stock theo số lượng đặt hàng

      if (updatedStock < 0) throw new Error('Số lượng tồn kho không đủ!');

      // 📌 Cập nhật stock trong API
      const updatedProduct = await updateProductStock(productId, updatedStock);
      return { productId, newStock: updatedProduct.stock };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi cập nhật tồn kho');
    }
  }
);

// 🎯 Slice quản lý sản phẩm
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
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
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi tải sản phẩm';
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const { productId, newStock } = action.payload;
        const productIndex = state.products.findIndex(
          (p) => p.id === productId
        );
        if (productIndex !== -1) {
          state.products[productIndex].stock = newStock; // ✅ Cập nhật stock sau khi trừ số lượng đặt hàng
        }
      })

      .addCase(updateStock.rejected, (state, action) => {
        state.error = action.payload || 'Lỗi cập nhật kho hàng';
      });
  },
});

// ✅ Xuất reducer & actions
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;

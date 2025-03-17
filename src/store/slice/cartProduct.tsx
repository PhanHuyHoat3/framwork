import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchCartApi,
  addToCartApi,
  removeFromCartApi,
  updateQuantityApi,
} from '../api/cartApi';

export interface CartItem {
  productId: number;
  name: string;
  color: string;
  image: string;
  quantity: number;
  price: number;
}

export interface CartState {
  id: string | null;
  userId: number | null;
  items: CartItem[];
  totalItems: number; // 🔥 Cập nhật tổng số lượng sản phẩm trong giỏ hàng
  loading: boolean;
}

const initialState: CartState = {
  id: null,
  userId: null,
  items: [],
  totalItems: 0, // 🔥 Bắt đầu từ 0
  loading: false,
};

// 📌 Lấy giỏ hàng
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: number) => {
    return await fetchCartApi(userId);
  }
);

// 📌 Thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, product }: { userId: number; product: CartItem }) => {
    await addToCartApi(userId, product);
    return await fetchCartApi(userId); // 🔥 Gọi lại API để cập nhật giỏ hàng
  }
);

// 📌 Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }: { userId: number; productId: number }) => {
    await removeFromCartApi(userId, productId);
    return await fetchCartApi(userId); // 🔥 Gọi lại API để cập nhật giỏ hàng
  }
);

// 📌 Cập nhật số lượng sản phẩm
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({
    userId,
    productId,
    quantity,
  }: {
    userId: number;
    productId: number;
    quantity: number;
  }) => {
    await updateQuantityApi(userId, productId, quantity);
    return await fetchCartApi(userId); // 🔥 Gọi lại API để cập nhật giỏ hàng
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      });
  },
});

export default cartSlice.reducer;

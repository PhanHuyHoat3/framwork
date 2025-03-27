import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCartApi,
  addToCartApi,
  removeFromCartApi,
  updateQuantityApi,
  clearCartApi,
} from '../api/cartApi';

// 🛒 Định nghĩa kiểu dữ liệu của sản phẩm trong giỏ hàng
export interface CartItem {
  productId: number;
  name: string;
  color: string;
  image: string;
  quantity: number;
  price: number;
}

// 🛒 Định nghĩa kiểu dữ liệu của state giỏ hàng
export interface CartState {
  id: string | null;
  userId: number | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

// 🎯 Trạng thái khởi tạo của giỏ hàng
const initialState: CartState = {
  id: null,
  userId: null,
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

// 📌 Hàm tính tổng số lượng & tổng giá trị đơn hàng
const calculateCartTotals = (state: CartState) => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
};

// 📌 Lấy giỏ hàng từ API
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await fetchCartApi(userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 📌 Thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { userId, product }: { userId: number; product: CartItem },
    { rejectWithValue }
  ) => {
    try {
      const updatedCart = await addToCartApi(userId, product);
      return updatedCart; // Trả về toàn bộ giỏ hàng mới
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 📌 Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (
    { userId, productId }: { userId: number; productId: number },
    { rejectWithValue }
  ) => {
    try {
      const updatedCart = await removeFromCartApi(userId, productId);
      return updatedCart; // Trả về giỏ hàng sau khi cập nhật
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 📌 Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    {
      userId,
      productId,
      quantity,
    }: { userId: number; productId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const updatedCart = await updateQuantityApi(userId, productId, quantity);
      return updatedCart; // Trả về giỏ hàng sau khi cập nhật số lượng
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 📌 Xóa toàn bộ giỏ hàng sau khi đặt hàng
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId: number, { rejectWithValue }) => {
    try {
      await clearCartApi(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🎯 Tạo Slice quản lý giỏ hàng
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null; // ✅ Thêm action reset lỗi
    },
  },
  extraReducers: (builder) => {
    builder
      // 🛒 Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.id = action.payload.id;
        state.userId = action.payload.userId;
        calculateCartTotals(state);
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🛍️ Add To Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items; // ✅ Cập nhật toàn bộ giỏ hàng mới
        calculateCartTotals(state);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ❌ Remove From Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items; // ✅ Cập nhật lại giỏ hàng sau khi xóa sản phẩm
        calculateCartTotals(state);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // 🔄 Update Quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items; // ✅ Cập nhật lại giỏ hàng sau khi cập nhật số lượng
        calculateCartTotals(state);
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // 🚮 Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = cartSlice.actions; // ✅ Export action reset lỗi
export default cartSlice.reducer;

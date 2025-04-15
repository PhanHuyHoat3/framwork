import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchCartApi,
  addToCartApi,
  removeFromCartApi,
  updateQuantityApi,
  clearCartApi,
} from '../api/cartApi';

// 🛒 Cart Item interface
export interface CartItem {
  productId: number;
  originalProductId?: number;
  name: string;
  color: string;
  image: string;
  storage: string;
  quantity: number;
  price: number;
}

// 🛒 Cart State
export interface CartState {
  id: string | null;
  userId: number | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

// 🎯 Initial State
const initialState: CartState = {
  id: null,
  userId: null,
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

// 📌 Helper: Tính tổng số lượng & giá tiền
const calculateCartTotals = (state: CartState) => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
};

// =============================
// 🔄 ASYNC THUNK FUNCTIONS
// =============================

// 🛒 Lấy giỏ hàng từ server
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

// ➕ Thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { userId, product }: { userId: number; product: CartItem },
    { rejectWithValue }
  ) => {
    try {
      return await addToCartApi(userId, product);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ❌ Xoá sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (
    { userId, productId }: { userId: number; productId: number },
    { rejectWithValue }
  ) => {
    try {
      return await removeFromCartApi(userId, productId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔁 Cập nhật số lượng sản phẩm
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
      return await updateQuantityApi(userId, productId, quantity);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🧹 Xoá toàn bộ giỏ hàng
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

// =============================
// 🧩 SLICE DEFINITION
// =============================

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 👉 Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.userId = action.payload.userId;
        state.items = action.payload.items;
        calculateCartTotals(state);
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 👉 Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.items = action.payload.items;
        calculateCartTotals(state);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // 👉 Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        calculateCartTotals(state);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // 👉 Update Quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        calculateCartTotals(state);
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // 👉 Clear Cart
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

export const { resetError } = cartSlice.actions;
export default cartSlice.reducer;

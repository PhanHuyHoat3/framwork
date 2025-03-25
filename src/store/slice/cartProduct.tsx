import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchCartApi,
  addToCartApi,
  removeFromCartApi,
  updateQuantityApi,
  clearCartApi, // 🆕 API xóa giỏ hàng
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
  totalItems: number;
  totalPrice: number; // 🆕 Tổng giá trị giỏ hàng
  loading: boolean;
}

const initialState: CartState = {
  id: null,
  userId: null,
  items: [],
  totalItems: 0,
  totalPrice: 0, // 🔥 Mặc định tổng giá trị là 0
  loading: false,
};

// 📌 Hàm tính tổng số lượng & tổng giá trị đơn hàng
const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  return { totalItems, totalPrice };
};

// 📌 Lấy giỏ hàng từ API
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
    return { userId, product }; // 🔥 Cập nhật state ngay lập tức
  }
);

// 📌 Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }: { userId: number; productId: number }) => {
    await removeFromCartApi(userId, productId);
    return { userId, productId }; // 🔥 Không cần fetch lại toàn bộ giỏ hàng
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
    return { userId, productId, quantity };
  }
);

// 📌 Xóa toàn bộ giỏ hàng sau khi đặt hàng
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId: number) => {
    await clearCartApi(userId);
    return userId;
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
        state.id = action.payload.id;
        state.userId = action.payload.userId;
        const { totalItems, totalPrice } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { product } = action.payload;
        const existingItem = state.items.find(
          (item) => item.productId === product.productId
        );
        if (existingItem) {
          existingItem.quantity += product.quantity;
        } else {
          state.items.push(product);
        }
        const { totalItems, totalPrice } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload.productId
        );
        const { totalItems, totalPrice } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const item = state.items.find((item) => item.productId === productId);
        if (item) {
          item.quantity = quantity;
        }
        const { totalItems, totalPrice } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  },
});

export default cartSlice.reducer;

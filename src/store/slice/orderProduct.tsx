import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrderApi, getOrdersApi } from '../api/orderApi';
import { CartItem } from './cartProduct';
export interface Order {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  phone: number | string;
  address: string;
  province: string;
  district: string;
  ward: string;
  notes?: string;
  paymentMethod: 'Chuyen tien' | 'Tien mat';
  items: CartItem[];
  total: number;
  status: 'New';
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// 📌 Tạo đơn hàng (POST)
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: Order, { rejectWithValue }) => {
    try {
      return await createOrderApi(orderData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 📌 Lấy danh sách đơn hàng (GET)
export const fetchOrders = createAsyncThunk(
  'orders/getOrders',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await getOrdersApi(userId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Xử lý tạo đơn hàng
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Xử lý lấy danh sách đơn hàng
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;

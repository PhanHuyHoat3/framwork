import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product } from './nameProduct';
import { idProductApi } from '../api/productApi';

export interface ProductState {
  product: Product | null;
  loading: boolean;
}
const initialState: ProductState = {
  product: null,
  loading: false,
};
export const fetchidProduct = createAsyncThunk(
  'idProduct/fetchidProduct',
  async (id: number) => {
    return await idProductApi(id);
  }
);
export const idProductSlice = createSlice({
  name: 'idProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchidProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchidProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload || null; // ✅ Nếu không có dữ liệu, set null
      })
      .addCase(fetchidProduct.rejected, (state) => {
        state.loading = false;
        state.product = null;
      });
  },
});

export default idProductSlice.reducer;

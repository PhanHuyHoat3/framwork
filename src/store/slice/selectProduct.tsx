import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product } from './nameProduct';
import {
  bestProductApi,
  newProductApi,
  outstandingProductApi,
} from '../api/productApi';

export interface ProductSate {
  newProduct: Product[];
  outstandingProduct: Product[];
  bestProduct: Product[];
  loading: boolean;
}

const initialState: ProductSate = {
  newProduct: [],
  outstandingProduct: [],
  bestProduct: [],
  loading: false,
};
export const fetchnewProduct = createAsyncThunk(
  'newProduct/fetchProduct',
  async () => {
    return await newProductApi();
  }
);
export const fetchoutstandingProduct = createAsyncThunk(
  'outstandingProduct/fetchProduct',
  async () => {
    return await outstandingProductApi();
  }
);
export const fetchbestProduct = createAsyncThunk(
  'bestProduct/fetchProduct',
  async () => {
    return await bestProductApi();
  }
);

const selectProductSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchnewProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchnewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.newProduct = action.payload;
      })
      .addCase(fetchnewProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchoutstandingProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchoutstandingProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.outstandingProduct = action.payload;
      })
      .addCase(fetchoutstandingProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchbestProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchbestProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.bestProduct = action.payload;
      })
      .addCase(fetchbestProduct.rejected, (state) => {
        state.loading = false;
      });
  },
});
export default selectProductSlice.reducer;

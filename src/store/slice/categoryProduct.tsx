import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategory } from '../api/categoryApi';

export interface Category {
  id: number;
  name: string;
  description: string;
}
interface categorySate {
  categories: Category[];
  loading: boolean;
}
const initialState: categorySate = {
  categories: [],
  loading: false,
};
export const fetchCategory1 = createAsyncThunk(
  'category/fetchCategory',
  async () => {
    const response = await fetchCategory();
    return response;
  }
);
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory1.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategory1.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategory1.rejected, (state) => {
        state.loading = false;
      });
  },
});
export default categorySlice.reducer;

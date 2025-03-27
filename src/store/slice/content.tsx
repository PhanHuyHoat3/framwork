import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchReviewsByProduct, postReview } from '../api/conment';

interface Review {
  id?: number;
  phoneId: number;
  userId: number;
  rating: number;
  comment: string;
}

interface ReviewsState {
  list: Review[];
  loading: boolean;
}

const initialState: ReviewsState = {
  list: [],
  loading: false,
};

// 🔥 Lấy danh sách bình luận theo `phoneId`
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (phoneId: number) => {
    return await fetchReviewsByProduct(phoneId);
  }
);

// 🔥 Gửi bình luận mới lên server
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (review: Review, { rejectWithValue }) => {
    try {
      const newReview = await postReview(review);
      return newReview;
    } catch (error) {
      return rejectWithValue('Gửi bình luận thất bại');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🟢 Xử lý khi lấy bình luận
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.loading = false;
      })

      // 🟢 Xử lý khi thêm bình luận
      .addCase(addReview.fulfilled, (state, action) => {
        state.list.push(action.payload); // Cập nhật danh sách bình luận ngay lập tức
      });
  },
});

export default reviewsSlice.reducer;

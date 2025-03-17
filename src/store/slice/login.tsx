import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchLoginApi } from '../api/registerApi';

interface AuthState {
  user: { id: number; username: string; email: string; role: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async Thunk để gọi API đăng nhập
export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await fetchLoginApi(credentials);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user'); // Xóa dữ liệu khỏi LocalStorage khi logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload)); // Lưu user vào LocalStorage
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

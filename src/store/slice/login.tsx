import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

// 📌 Kiểm tra `localStorage` để lấy dữ liệu user đã đăng nhập trước đó
const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

interface AuthState {
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: initialUser, // 🔥 Khởi tạo từ `localStorage`
  loading: false,
  error: null,
};

// 📌 API đăng nhập
export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}?email=${email}&password=${password}`
      );

      if (response.data.length === 0) {
        return rejectWithValue('⚠️ Email hoặc mật khẩu không đúng!');
      }

      const user = response.data[0]; // Lấy user đầu tiên
      localStorage.setItem('user', JSON.stringify(user)); // Lưu vào localStorage
      return user;
    } catch (error) {
      return rejectWithValue('⚠️ Lỗi kết nối đến máy chủ!' + error);
    }
  }
);

// 📌 Slice quản lý trạng thái đăng nhập
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user'); // 🔥 Xóa `localStorage` khi đăng xuất
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLogin.fulfilled,
        (state, action: PayloadAction<AuthState['user']>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

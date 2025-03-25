import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

// 📌 Lấy user từ `sessionStorage`
const storedUser = sessionStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: initialUser, // 🔥 Lưu trong `sessionStorage`
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
      // 🛠 JSON Server không hỗ trợ `/login`, nên dùng `GET` với query params
      const response = await axios.get(
        `${API_URL}?email=${email}&password=${password}`
      );

      if (response.data.length === 0) {
        return rejectWithValue('⚠️ Email hoặc mật khẩu không đúng!');
      }

      const user = response.data[0]; // Lấy user đầu tiên
      sessionStorage.setItem('user', JSON.stringify(user)); // 🔥 Lưu vào `sessionStorage`
      return user;
    } catch (error) {
      return rejectWithValue(
        '⚠️ Lỗi kết nối đến máy chủ! Vui lòng thử lại.' + error
      );
    }
  }
);

// 📌 API cập nhật user (khi thay đổi role)
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        '⚠️ Lỗi khi cập nhật thông tin người dùng!' + error
      );
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
      sessionStorage.removeItem('user'); // 🔥 Xóa `sessionStorage` khi đăng xuất
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload; // 🚀 Cập nhật user nếu role thay đổi từ Admin
        sessionStorage.setItem('user', JSON.stringify(action.payload)); // 🔥 Cập nhật sessionStorage
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

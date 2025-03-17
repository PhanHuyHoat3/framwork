import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchRegisterApi } from '../api/registerApi';

export interface Register {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: string; // Role có thể không được nhập
}

interface RegisterState {
  user: Register | null;
  loading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  user: null,
  loading: false,
  error: null,
};

// Async Thunk để gọi API đăng ký
export const fetchRegister = createAsyncThunk(
  'register/fetchRegisterApi',
  async (userData: Register, { rejectWithValue }) => {
    try {
      return await fetchRegisterApi(userData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Redux Slice
const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegister: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { resetRegister } = registerSlice.actions;
export default registerSlice.reducer;

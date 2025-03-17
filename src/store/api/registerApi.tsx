import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

// 📌 API đăng ký user mới
export const fetchRegisterApi = async (userData: {
  username: string;
  email: string;
  password: string;
  role?: string;
}) => {
  try {
    const newUser = {
      ...userData,
      role: userData.role || 'user',
    };

    const response = await axios.post(API_URL, newUser);
    return response.data;
  } catch (error) {
    console.error('Lỗi API đăng ký:', error);
    throw error;
  }
};

// 📌 API đăng nhập user
export const fetchLoginApi = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await axios.get(API_URL, {
      params: { email: credentials.email, password: credentials.password },
    });

    if (data.length === 0) {
      throw new Error('⚠️ Email hoặc mật khẩu không đúng!');
    }

    return data[0]; // Trả về user tìm thấy
  } catch (error) {
    console.error('Lỗi API đăng nhập:', error);
    throw error;
  }
};

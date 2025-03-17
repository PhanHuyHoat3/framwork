import axios from 'axios';

const API_URL = 'http://localhost:3000/users'; // Kiểm tra đường dẫn API

export const fetchRegisterApi = async (userData: {
  username: string;
  email: string;
  password: string;
  role?: string; // Role mặc định là 'user'
}) => {
  try {
    const newUser = {
      ...userData,
      role: userData.role || 'user', // Nếu không có role, gán mặc định là 'user'
    };

    const response = await axios.post(API_URL, newUser);
    return response.data; // Server tự tạo ID dạng số
  } catch (error) {
    console.error('Lỗi API đăng ký:', error);
    throw error;
  }
};

//dang nhap
export const fetchLoginApi = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await axios.get(API_URL, {
      params: { email: credentials.email, password: credentials.password },
    });

    if (data.length === 0) {
      throw new Error('Email hoặc mật khẩu không đúng!');
    }

    return data[0]; // Trả về thông tin người dùng đầu tiên tìm thấy
  } catch (error) {
    console.error('Lỗi API đăng nhập:', error);
    throw error;
  }
};

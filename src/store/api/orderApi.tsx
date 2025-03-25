import axios from 'axios';
import { Order } from '../slice/orderProduct';

const API_URL = 'http://localhost:3000/orders';

// 📌 API lấy danh sách đơn hàng của user
export const getOrdersApi = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// 📌 API tạo đơn hàng mới
export const createOrderApi = async (orderData: Order) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Failed to create order');
  }
};

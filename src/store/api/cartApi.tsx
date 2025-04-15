import axios from 'axios';
import { Product } from '../slice/nameProduct';

const API_URL = 'http://localhost:3000/cart';

export interface CartItem {
  productId: number;
  name: string;
  color: string;
  image: string;
  storage: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string; // ID của giỏ hàng trong database
  userId: number;
  items: CartItem[];
}

// 📌 Lấy giỏ hàng theo `userId`
export const fetchCartApi = async (userId: number): Promise<Cart> => {
  try {
    const response = await axios.get<Cart[]>(`${API_URL}?userId=${userId}`);
    if (response.data.length > 0) {
      return response.data[0]; // ✅ Trả về giỏ hàng đầu tiên tìm được
    } else {
      // ✅ Nếu chưa có giỏ hàng, tạo mới trên server
      const newCart: Cart = { id: `${Date.now()}`, userId, items: [] };
      const createResponse = await axios.post<Cart>(API_URL, newCart);
      return createResponse.data;
    }
  } catch (error) {
    console.error('Lỗi lấy giỏ hàng:', error);
    throw error;
  }
};
export const addToCartApi = async (userId: number, product: CartItem) => {
  const cart = await fetchCartApi(userId);

  // 🔎 Lấy thông tin sản phẩm gốc từ API
  const productData = await axios.get<Product>(
    `http://localhost:3000/products/${product.productId}`
  );

  // 🔍 Tìm màu sắc tương ứng
  const selectedColor = productData.data.specs.colors.find(
    (c) => c.name === product.color
  );

  if (!selectedColor) {
    throw new Error('❌ Không tìm thấy màu sắc của sản phẩm!');
  }

  // 🎨 Cập nhật hình ảnh theo màu đã chọn
  const updatedProduct: CartItem = {
    ...product,
    image: selectedColor.image, // ✅ Cập nhật hình ảnh
  };

  // 🔍 Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
  const existingItem = cart.items.find(
    (item) =>
      item.productId === updatedProduct.productId &&
      item.color === updatedProduct.color
  );

  if (existingItem) {
    existingItem.quantity += updatedProduct.quantity;
  } else {
    cart.items.push(updatedProduct);
  }

  // ✅ Gửi dữ liệu mới lên server
  return axios.put(`${API_URL}/${cart.id}`, cart).then((res) => res.data);
};
export const removeFromCartApi = async (userId: number, productId: number) => {
  const cart = await fetchCartApi(userId);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  return axios.put(`${API_URL}/${cart.id}`, cart).then((res) => res.data);
};
export const updateQuantityApi = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  const cart = await fetchCartApi(userId);
  const item = cart.items.find((item) => item.productId === productId);
  if (item) {
    item.quantity = quantity; // ✅ Cập nhật số lượng
  }
  return axios.put(`${API_URL}/${cart.id}`, cart).then((res) => res.data);
};
export const clearCartApi = async (userId: number) => {
  try {
    // 🔥 Tìm giỏ hàng của user
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    if (response.data.length === 0) {
      throw new Error('Giỏ hàng không tồn tại');
    }

    const cartId = response.data[0].id; // 🔹 Lấy ID giỏ hàng
    await axios.put(`${API_URL}/${cartId}`, { userId, items: [] }); // 🔥 Xóa toàn bộ items

    return { message: 'Giỏ hàng đã được xóa' };
  } catch (error) {
    console.error('❌ Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};

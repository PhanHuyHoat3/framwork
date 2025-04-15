import axios from 'axios';
import { Product } from '../slice/nameProduct';

const API_URL = 'http://localhost:3000/cart';
const PRODUCT_API_URL = 'http://localhost:3000/products';

export interface CartItem {
  productId: number; // ID riêng biệt cho biến thể
  originalProductId?: number | string; // ID gốc của sản phẩm
  name: string;
  color: string;
  image: string;
  storage: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: number | string; // Hỗ trợ cả chuỗi và số
  items: CartItem[];
}

// 🔧 Tạo ID riêng biệt dựa trên productId + color
const generateVariantId = (
  productId: number | string,
  color: string
): number => {
  const hash = `${productId}_${color}`
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash;
};

// 📦 Lấy giỏ hàng theo userId (tạo mới nếu chưa có)
export const fetchCartApi = async (userId: number | string): Promise<Cart> => {
  try {
    const response = await axios.get<Cart[]>(`${API_URL}?userId=${userId}`);
    if (response.data.length > 0) {
      return response.data[0];
    } else {
      const newCart: Cart = { id: `${Date.now()}`, userId, items: [] };
      const createResponse = await axios.post<Cart>(API_URL, newCart);
      return createResponse.data;
    }
  } catch (error) {
    console.error('❌ Lỗi lấy giỏ hàng:', error);
    throw error;
  }
};

// ➕ Thêm sản phẩm vào giỏ hàng
export const addToCartApi = async (
  userId: number | string,
  product: CartItem
) => {
  const cart = await fetchCartApi(userId);

  // 📥 Lấy sản phẩm gốc từ API
  const productData = await axios.get<Product>(
    `${PRODUCT_API_URL}/${product.productId}`
  );

  const selectedColor = productData.data.specs.colors.find(
    (c) => c.name === product.color
  );

  if (!selectedColor) {
    throw new Error('❌ Không tìm thấy màu sắc của sản phẩm!');
  }

  const variantId = generateVariantId(product.productId, product.color);

  const updatedProduct: CartItem = {
    ...product,
    productId: variantId, // ID riêng biệt cho từng màu
    originalProductId: product.productId,
    image: selectedColor.image,
  };

  const existingItem = cart.items.find((item) => item.productId === variantId);

  if (existingItem) {
    existingItem.quantity += updatedProduct.quantity;
  } else {
    cart.items.push(updatedProduct);
  }

  // Gửi yêu cầu PUT để cập nhật giỏ hàng trên server
  const updatedCart = await axios.put<Cart>(`${API_URL}/${cart.id}`, cart);
  return updatedCart.data;
};

// ❌ Xoá sản phẩm khỏi giỏ hàng
export const removeFromCartApi = async (
  userId: number | string,
  productId: number
) => {
  const cart = await fetchCartApi(userId);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  const updatedCart = await axios.put<Cart>(`${API_URL}/${cart.id}`, cart);
  return updatedCart.data;
};

// 🔁 Cập nhật số lượng
export const updateQuantityApi = async (
  userId: number | string,
  productId: number,
  quantity: number
) => {
  const cart = await fetchCartApi(userId);
  const item = cart.items.find((item) => item.productId === productId);
  if (item) {
    item.quantity = quantity;
  }
  const updatedCart = await axios.put<Cart>(`${API_URL}/${cart.id}`, cart);
  return updatedCart.data;
};

// 🧹 Xoá toàn bộ giỏ hàng
export const clearCartApi = async (userId: number | string) => {
  try {
    const response = await axios.get<Cart[]>(`${API_URL}?userId=${userId}`);
    if (response.data.length === 0) {
      throw new Error('❌ Giỏ hàng không tồn tại');
    }

    const cartId = response.data[0].id;
    await axios.put(`${API_URL}/${cartId}`, { userId, items: [] });
    return { message: '✅ Giỏ hàng đã được xóa' };
  } catch (error) {
    console.error('❌ Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};

import axios from 'axios';

const API_URL = 'http://localhost:3000/products';

// 🛠 Gọi API lấy sản phẩm theo danh mục
export const brandProductAPi = async (categoryId: number) => {
  try {
    const response = await axios.get(`${API_URL}?categoryId=${categoryId}`);
    // console.log(`Dữ liệu sản phẩm (categoryId=${categoryId}):`, response.data); // Debug dữ liệu
    return response.data;
  } catch (error) {
    console.error('Lỗi gọi API sản phẩm:', error);
    return [];
  }
};

export const newProductApi = async () => {
  try {
    const response = await axios.get(`${API_URL}?new=true`);
    // console.log('Fetched new products:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi gọi API sản phẩm mới:', error);
    return [];
  }
};
export const outstandingProductApi = async () => {
  try {
    const response = await axios.get(`${API_URL}?outstanding=true`);
    // console.log('Fetched outstanding products:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi gọi API sản phẩm nổi bật:', error);
    return [];
  }
};
export const bestProductApi = async () => {
  try {
    const response = await axios.get(`${API_URL}?best=true`);
    // console.log('Fetched best products:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi gọi API sản phẩm bán chạy:', error);
    return [];
  }
};
export const idProductApi = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}?id=${id}`);
    return response.data.length > 0 ? response.data[0] : null; // ✅ Lấy sản phẩm đầu tiên
  } catch (error) {
    console.error('Lỗi gọi API sản phẩm theo ID:', error);
    return null;
  }
};

export const ProductsApi = async () => {
  try {
    const response = await axios.get(API_URL);
    // console.log('Fetched products:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi gọi API sản phẩm:', error);
    return [];
  }
};
export const updateProductStock = async (
  productId: number,
  quantity: number
) => {
  try {
    const response = await axios.patch(`${API_URL}/${productId}`, {
      stock: quantity,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi cập nhật tồn kho:', error);
    throw error;
  }
};

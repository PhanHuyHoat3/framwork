    import axios from 'axios';

    const API_URL = 'http://localhost:3000/categories';



    // 🛠 Gọi API lấy thông tin danh mục theo ID
    export const fetchCategoryByIdApi = async (categoryId: number) => {
    // try {
    const response = await axios.get(`${API_URL}/${categoryId}`);
    // console.log(`Dữ liệu danh mục (categoryId=${categoryId}):`, response.data); // Debug dữ liệu
    return response.data;
    // } catch (error) {
    //   console.error('Lỗi gọi API danh mục:', error);
    //   return null;
    // }
    };

    export const fetchCategory = async () => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
    };

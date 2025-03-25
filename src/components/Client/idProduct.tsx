import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchidProduct } from '../../store/slice/idProduct';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { product, loading } = useSelector(
    (state: RootState) => state.idProduct
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchidProduct(id));  // Truyền ID dưới dạng chuỗi
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      if (product.specs.colors && product.specs.colors.length > 0) {
        setSelectedColor(product.specs.colors[0].image);
      }
      if (product.specs.storage && product.specs.storage.length > 0) {
        setSelectedStorage(product.specs.storage[0]);
      }
    }
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 🔗 Breadcrumb */}
      <div className="text-gray-600 text-sm flex items-center mb-4">
        <a href="/">
          <p className="hover:text-blue-500 cursor-pointer">Trang chủ</p>
        </a>
        <span className="mx-2">›</span>
        <p className="font-semibold">{product.name}</p>
      </div>

      {/* 🖼 Layout Chi tiết sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* 📷 Hình ảnh sản phẩm */}
        <div className="border p-4 rounded-lg w-[400px] mx-auto">
          <img
            className="w-full h-[400px] object-cover rounded"
            src={selectedColor || product.image}
            alt={product.name}
          />

          {/* 🎨 Chọn màu sắc */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Chọn màu sắc:</h3>
            <div className="flex gap-3">
              {product.specs.colors && product.specs.colors.length > 0 ? (
                product.specs.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 border rounded-lg p-1 transition ${
                      selectedColor === color.image
                        ? 'border-blue-500'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedColor(color.image)}
                  >
                    <img
                      className="w-full h-full object-cover rounded"
                      src={color.image}
                      alt={color.name}
                    />
                  </button>
                ))
              ) : (
                <p>Không có màu sắc lựa chọn.</p>
              )}
            </div>
          </div>
        </div>

        {/* 📋 Thông tin sản phẩm */}
        <div className="w-[500px] mx-auto">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.brand}</p>

          {/* 💰 Giá tiền */}
          <div className="flex items-center gap-4 mt-3">
            <span className="text-red-500 text-2xl font-bold">
              {product.price.toLocaleString()} đ
            </span>
            <span className="text-gray-500 line-through">
              {product.sale.toLocaleString()} đ
            </span>
          </div>

          {/* 📦 Tình trạng hàng */}
          <p
            className={`mt-2 font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
          </p>

          {/* 🛠 Chọn dung lượng */}
          {product.specs.storage && product.specs.storage.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Chọn dung lượng:</h3>
              <div className="flex gap-3 mt-2">
                {product.specs.storage.map((storage, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedStorage === storage
                        ? 'border-blue-500 text-blue-500'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedStorage(storage)}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          
          {/* 🛠 Thông số kỹ thuật */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Thông số kỹ thuật:</h3>
            <ul className="list-disc ml-5 text-gray-700 mt-2">
              <li>Màn hình: {product.specs.screen}</li>
              <li>Vi xử lý: {product.specs.processor}</li>
              <li>Camera: {product.specs.camera}</li>
              <li>Dung lượng pin: {product.specs.battery}</li>
            </ul>
          </div>

          {/* 🛒 Nút Thêm vào giỏ hàng & Mua ngay */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
              onClick={() => {
                if (!selectedColor) {
                  alert('Vui lòng chọn màu sắc!');
                  return;
                }
                if (
                  product.specs.storage &&
                  product.specs.storage.length > 0 &&
                  !selectedStorage
                ) {
                  alert('Vui lòng chọn dung lượng!');
                  return;
                }
              }}
            >
              Thêm vào giỏ hàng
            </button>
            <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsWithCategory } from '../../store/slice/nameProduct';

const ListProduct = ({ categoryId }: { categoryId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productsByCategory, loading } = useSelector(
    (state: RootState) => state.brandProduct
  );

  const [startIndex, setStartIndex] = useState(0);
  const products = productsByCategory[categoryId] || [];
  const totalProducts = products.length;

  useEffect(() => {
    dispatch(fetchProductsWithCategory(categoryId));
  }, [dispatch, categoryId]);

  const nextSlide = () => {
    if (startIndex + 4 < totalProducts) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative flex items-center justify-center w-[900px] mx-auto">
      {/* 🔥 Nút "⬅" để quay lại */}
      <button
        onClick={prevSlide}
        className={`absolute left-0 z-10 bg-gray-200 p-2 rounded-full shadow-md ${
          startIndex === 0 ? 'hidden' : ''
        }`}
      >
        ⬅
      </button>

      {/* 🚀 Danh sách sản phẩm */}
      <div className="overflow-hidden w-[900px] relative">
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * 230}px)`,
            width: `${totalProducts * 230}px`,
          }}
        >
          {products.map((item) => (
            <div key={item.id} className="w-[220px]">
              <div className="max-w-[220px] max-h-[400px] shadow-sm shadow-gray-300 rounded-md border-2 p-4 bg-white">
                <div className="overflow-hidden">
                  <img
                    className="w-full hover:translate-y-[-10px] transition duration-300"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div>
                  <h3 className="line-clamp-2 max-w-[200px] h-[50px] hover:text-yellow-400">
                    {item.name}
                  </h3>
                  <p className="text-red-600">{item.price} đ</p>
                  <p className="line-through text-gray-400">{item.sale} đ</p>
                  <div>
                    <button className="bg-red-400 w-full text-white p-2 rounded-[10px]">
                      Giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 Nút "➡" để chuyển tiếp */}
      <button
        onClick={nextSlide}
        className={`absolute right-0 z-10 bg-gray-200 p-2 rounded-full shadow-md ${
          startIndex + 4 >= totalProducts ? 'hidden' : ''
        }`}
      >
        ➡
      </button>
    </div>
  );
};

export default ListProduct;

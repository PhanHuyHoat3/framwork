import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsWithCategory } from '../../store/slice/nameProduct';

const ListProduct = ({ categoryId }: { categoryId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productsByCategory, categoryName, loading } = useSelector(
    (state: RootState) => state.brandProduct
  );

  const [startIndex, setStartIndex] = useState(0);
  const products = productsByCategory[categoryId] || [];
  const categoryNames = categoryName[categoryId] || 'Chưa có tên';
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
    <div className=" bg-white h-full py-4 rounded-[5px]">
      <div className=" ml-4">
        <h1 className="uppercase text-3xl font-semibold ">{categoryNames}</h1>
      </div>
      <div className="relative flex items-center justify-center w-[950px] mx-auto my-5 ">
        {/* 🔥 Nút "⬅" để quay lại */}
        <div
          onClick={prevSlide}
          className={`group absolute left-[17px] top-1/2 -translate-y-1/2 
              w-8 h-16 bg-[#f2f2f2] rounded-r-full shadow-md 
              flex flex-col justify-center items-center cursor-pointer 
              hover:bg-[#000f8f] transition-all duration-300 z-20
              ${
                startIndex === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-100'
              }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="blue"
            className="w-6 h-6 group-hover:stroke-white m-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>

        {/* 🚀 Danh sách sản phẩm */}
        <div className="overflow-hidden w-[920px] relative">
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
        <div
          onClick={nextSlide}
          className={`group absolute right-[20px] top-1/2 -translate-y-1/2 
              w-8 h-16 bg-[#f2f2f2] rounded-l-full shadow-md 
              flex flex-col justify-center items-center cursor-pointer 
              hover:bg-[#000f8f] transition-all duration-300 z-20
              ${
                startIndex + 4 >= totalProducts
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-100'
              }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="blue"
            className="w-6 h-6 group-hover:stroke-white m-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </div>
      <div className="flex justify-center items-center my-4   ">
        <div className="cursor-pointer px-5 py-1 rounded-[5px] text-[#000f8f] hover:bg-[#000f8f] hover:text-white border-2 border-[#000f8f]">
          <p> Xem toàn bộ sản phẩm </p>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;

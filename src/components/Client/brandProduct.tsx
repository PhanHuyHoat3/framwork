import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsWithCategory } from '../../store/slice/nameProduct';

const BrandProduct = ({ categoryId }: { categoryId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productsByCategory, categoryDescriptions, categoryName, loading } =
    useSelector((state: RootState) => state.brandProduct);

  useEffect(() => {
    dispatch(fetchProductsWithCategory(categoryId));
  }, [dispatch, categoryId]);

  const products = productsByCategory[categoryId] || [];
  const categoryDescription =
    categoryDescriptions[categoryId] || 'Chưa có mô tả';
  const categoryNames = categoryName[categoryId] || 'Chưa có tên';

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="shadow-sm shadow-gray-300 rounded-md border-2 p-4 w-[280px] h-full flex flex-col justify-between bg-white hover:shadow-lg transition-shadow duration-300">
      {/* Hình ảnh sản phẩm */}
      <div className="flex justify-center items-center gap-2 relative">
        {products.length > 0 ? (
          <>
            {/* Sản phẩm chính (trái) */}
            <div className="w-[120px] h-[120px] overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-md scale-100 hover:transition-all hover:scale-110 transition-transform duration-[400ms] hover:ease-in-out "
                src={products[0]?.image || 'https://placehold.co/200'}
                alt={products[0]?.name || 'Product'}
              />
            </div>

            {/* Sản phẩm thứ hai (làm mờ + số lượng còn lại) */}
            {products.length > 1 && (
              <div className="relative w-[120px] h-[120px] overflow-hidden group">
                <img
                  className="w-full h-full object-cover rounded-md opacity-50 scale-100  group-hover:opacity-100 group-hover:transition-all group-hover:scale-110 group-hover:ease-in-out "
                  src={products[1]?.image || 'https://placehold.co/200'}
                  alt={products[1]?.name || 'Product'}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-md">
                  <span className="text-white text-lg font-bold group-hover:text-yellow-500">
                    +{products.length}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">Không có sản phẩm.</p>
        )}
      </div>

      {/* Tiêu đề danh mục */}
      <h2 className=" w-3  text-lg font-semibold mt-3 hover:text-yellow-500  ">
        {categoryNames}
      </h2>
      <p className="text-gray-600">{categoryDescription}</p>
    </div>
  );
};
export default BrandProduct;


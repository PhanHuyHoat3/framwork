import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { setProducts } from '../../store/slice/Product';
import { addToCart } from '../../store/slice/cartProduct';
import { Product } from '../../store/slice/nameProduct';
import { useNavigate } from 'react-router-dom';

function Search() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { products, filteredProducts, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // ✅ Nếu không có tìm kiếm, dùng toàn bộ danh sách `products`
  const displayedProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  // 🔄 Reset về danh sách gốc
  const handleReset = () => {
    dispatch(setProducts(products)); // Gán lại danh sách gốc
  };
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('❌ Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    try {
      // 🔥 Lấy màu từ danh sách `colors` nếu ảnh trùng hoặc lấy màu đầu tiên
      const selectedColor =
        product.specs.colors.find(
          (color: { image: string; name: string }) =>
            color.image === product.image
        )?.name || product.specs.colors[0]?.name;

      await dispatch(
        addToCart({
          userId: user.id,
          product: {
            productId: product.id,
            name: product.name,
            color: selectedColor,
            image: product.image,
            price: product.price,
            quantity: 1,
          },
        })
      ).unwrap();

      alert(`✅ Đã thêm "${product.name}" (${selectedColor}) vào giỏ hàng!`);
    } catch (error) {
      console.error('❌ Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      alert('❌ Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-xl font-semibold mb-4">🔍 Kết Quả Tìm Kiếm</h2>

      {/* 🔄 Nút Reset */}
      <button
        onClick={handleReset}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        🔄 Hiển thị tất cả sản phẩm
      </button>

      {/* 📜 Hiển thị danh sách sản phẩm */}
      <div className="mt-4">
        {loading && <p>Đang tải sản phẩm...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {displayedProducts.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((item) => (
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
                      <button
                        className="bg-red-400 w-full text-white p-2 rounded-[10px]"
                        onClick={() => handleAddToCart(item)}
                      >
                        Giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Không tìm thấy sản phẩm nào!</p>
        )}
      </div>
    </div>
  );
}

export default Search;

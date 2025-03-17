import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import {
  fetchbestProduct,
  fetchnewProduct,
  fetchoutstandingProduct,
} from '../../store/slice/selectProduct';
import { addToCart, updateQuantity } from '../../store/slice/cartProduct';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../store/slice/nameProduct';

const SelectProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    newProduct = [],
    outstandingProduct = [],
    bestProduct = [],
    loading,
  } = useSelector((state: RootState) => state.select);
  const user = useSelector((state: RootState) => state.auth.user);
  const cart = useSelector((state: RootState) => state.cart.items);

  const [activeTab, setActiveTab] = useState<'new' | 'outstanding' | 'best'>(
    'new'
  );

  useEffect(() => {
    dispatch(fetchnewProduct());
    dispatch(fetchoutstandingProduct());
    dispatch(fetchbestProduct());
  }, [dispatch]);

  // 🛠 Hàm lấy danh sách sản phẩm theo tab
  const getProducts = () => {
    if (activeTab === 'new') return newProduct || [];
    if (activeTab === 'outstanding') return outstandingProduct || [];
    if (activeTab === 'best') return bestProduct || [];
    return [];
  };
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('❌ Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    try {
      const selectedColor =
        product.specs.colors.find(
          (color: { image: string; name: string }) =>
            color.image === product.image
        )?.name || product.specs.colors[0]?.name;

      const existingItem = cart.find((item) => item.productId === product.id);

      if (existingItem) {
        // 🔥 Nếu sản phẩm đã có trong giỏ hàng -> Cập nhật số lượng
        await dispatch(
          updateQuantity({
            userId: user.id,
            productId: product.id,
            quantity: existingItem.quantity + 1,
          })
        ).unwrap();
      } else {
        // 🔥 Nếu sản phẩm chưa có -> Thêm mới vào giỏ hàng
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
      }

      alert(`✅ Đã thêm "${product.name}" (${selectedColor}) vào giỏ hàng!`);
    } catch (error) {
      console.error('❌ Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      alert('❌ Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };
  if (loading)
    return <p className="text-center text-gray-500 p-2">Loading...</p>;

  const products = getProducts();

  return (
    <div>
      <div className="border-2 shadow-white rounded-[5px] w-full bg-white">
        <div className="flex flex-row items-center m-3">
          <div
            className={`flex flex-row items-center px-6 py-3 bg-[#000f8f hover:bg-[#000f8f]  hover:text-white rounded-[5px] border-[#000f8f]   border-[1px] mx-2 max-w-[300px]
          ${
            activeTab === 'new'
              ? 'bg-[#000f8f] text-white'
              : 'bg-white text-black'
          }`}
            onClick={() => setActiveTab('new')}
          >
            <img
              className="w-[30px] mx-1"
              src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/title_image_1_allpro1.png?1719764721426"
              alt=""
            />
            <span
              className="
          text-[16px] font-semibold"
            >
              Sản phẩm mới
            </span>
          </div>
          <div
            className={`flex flex-row items-center px-6 py-3 bg-[#000f8f hover:bg-[#000f8f] hover:text-white rounded-[5px] border-[#000f8f]   border-[1px] mx-2 max-w-[300px]
          ${
            activeTab === 'outstanding'
              ? 'bg-[#000f8f] text-white'
              : 'bg-white  text-black'
          }`}
            onClick={() => setActiveTab('outstanding')}
          >
            <img
              className="w-[30px] mx-1"
              src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/title_image_2_allpro1.png?1719764721426"
              alt=""
            />
            <button type="button">Sản phẩm nổi bật</button>
          </div>
          <div
            className={`flex flex-row items-center px-6 py-3 bg-[#000f8f hover:bg-[#000f8f]  hover:text-white rounded-[5px] border-[#000f8f]   border-[1px] mx-2 max-w-[300px]
          ${
            activeTab === 'best' ? 'bg-[#000f8f] text-white' : 'bg-white'
          }  text-black`}
            onClick={() => setActiveTab('best')}
          >
            <img
              className="w-[30px] mx-1"
              src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/title_image_3_allpro1.png?1719764721426"
              alt=""
            />
            <button type="button">Sản phẩm bán chạy</button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-5 p-2">
          {products.slice(0, 10).map((item) => (
            <div
              className="max-w-[220px] max-h-[400px] shadow-sm shadow-gray-300 rounded-md border-2 p-4  bg-white transition-shadow duration-300"
              key={item.id}
            >
              <div
                className="overflow-hidden"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  className="w-full hover:translate-y-[-10px] hover:transition hover:duration-300"
                  src={item.image}
                  alt=""
                />
              </div>
              <div>
                <h3
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="line-clamp-2 max-w-[200px] h-[50px] hover:text-yellow-400"
                >
                  {item.name}
                </h3>
                <p className="text-red-600">{item.price} đ</p>
                <p className="line-through text-gray-400">{item.sale} đ</p>
                <div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-red-400 w-full text-white p-2 rounded-[10px] relative z-30"
                  >
                    Giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center my-3   ">
          <div className="cursor-pointer px-5 py-1 rounded-[5px] text-[#000f8f] hover:bg-[#000f8f] hover:text-white border-2 border-[#000f8f]">
            <p> Xem toàn bộ sản phẩm </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProduct;

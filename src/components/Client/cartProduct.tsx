import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchCart,
  removeFromCart,
  updateQuantity,
} from '../../store/slice/cartProduct';
import { fetchProducts } from '../../store/slice/Product';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC<{ userId: number }> = ({ userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 📌 Lấy dữ liệu từ Redux Store
  const { items, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart
  );
  const { products, loading: productsLoading } = useSelector(
    (state: RootState) => state.products
  );

  // 📌 Trạng thái lỗi
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🚀 Gọi API để lấy dữ liệu khi component được render
  useEffect(() => {
    dispatch(fetchCart(userId));
    dispatch(fetchProducts());
  }, [dispatch, userId]);

  /** 📌 Xóa sản phẩm khỏi giỏ hàng */
  const handleRemove = async (productId: number) => {
    try {
      await dispatch(removeFromCart({ userId, productId })).unwrap();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      setErrorMessage('❌ Không thể xóa sản phẩm khỏi giỏ hàng!');
    }
  };

  /** 📌 Cập nhật số lượng sản phẩm */
  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return; // Không cho giảm xuống 0
    try {
      await dispatch(
        updateQuantity({ userId, productId, quantity: newQuantity })
      ).unwrap();
      setErrorMessage(null);
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error);
      setErrorMessage('❌ Lỗi khi cập nhật số lượng sản phẩm!');
    }
  };

  /** 📌 Xử lý thanh toán */
  const handleCheckout = () => {
    if (!products || products.length === 0) {
      setErrorMessage('⚠️ Dữ liệu sản phẩm chưa sẵn sàng. Vui lòng thử lại!');
      return;
    }

    // 📝 Tạo danh sách sản phẩm kèm thông tin
    const cartItems = items.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }));

    // 🔎 Kiểm tra sản phẩm không hợp lệ
    const invalidItems = cartItems.filter(({ product, quantity }) => {
      return !product || quantity > product.stock || product.stock === 0;
    });

    if (invalidItems.length > 0) {
      setErrorMessage(
        invalidItems
          .map(({ product, quantity }) => {
            if (!product) return `⚠️ Sản phẩm không tồn tại trong hệ thống.đ`;
            if (product.stock === 0)
              return `⚠️ Sản phẩm "${product.name}" đã hết hàng!`;
            return `⚠️ Sản phẩm "${product.name}" chỉ còn ${product.stock} cái, nhưng bạn đã chọn ${quantity}.`;
          })
          .join('\n')
      );
      return;
    }
  
    // ✅ Nếu hợp lệ, tiến hành thanh toán
    navigate('/checkout');
    setErrorMessage(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="p-6 bg-white shadow-lg rounded-md w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
          🛒 Giỏ hàng của bạn
        </h2>

        {/* 🔥 Hiển thị lỗi nếu có */}
        {errorMessage && (
          <p className="text-red-500 text-center font-semibold bg-red-100 p-3 rounded-md mb-4">
            {errorMessage}
          </p>
        )}

        {cartLoading || productsLoading ? (
          <p className="text-gray-500">Đang tải giỏ hàng...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center">
            Giỏ hàng của bạn đang trống.
          </p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-200 text-gray-700 font-semibold">
                  <th className="py-3 px-4 text-left w-[400px]">
                    Thông tin sản phẩm
                  </th>
                  <th className="py-3 px-4 text-center w-[150px]">Đơn giá</th>
                  <th className="py-3 px-4 text-center w-[150px]">Số lượng</th>
                  <th className="py-3 px-4 text-center w-[150px]">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  return (
                    <tr
                      key={item.productId}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="py-4 px-4 flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <div>
                          <p className="line-clamp-2 text-lg font-semibold text-gray-700">
                            {item.name}
                          </p>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-lg font-semibold text-blue-600">
                        {item.price.toLocaleString()}₫
                      </td>
                      <td className=" text-center">
                        <div className="flex justify-center items-center border rounded-md shadow-sm w-fit ml-6">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-6 w-16 text-lg font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-lg font-semibold text-gray-800">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-8 border-t pt-5">
              <p className="text-xl font-semibold text-gray-700">
                Tổng tiền:{' '}
                <span className="text-red-600">
                  {items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toLocaleString()}
                  ₫
                </span>
              </p>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white py-3 px-8 rounded-md text-lg hover:bg-blue-700 transition shadow-md"
              >
                Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Cart;

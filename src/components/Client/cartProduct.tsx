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

const Cart: React.FC<{ userId: string }> = ({ userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 📌 Lấy dữ liệu từ Redux Store
  const {
    items,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state: RootState) => state.cart);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.products);

  // 📌 Trạng thái lỗi
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🚀 Gọi API để lấy dữ liệu khi component render
  useEffect(() => {
    dispatch(fetchCart(userId));
    dispatch(fetchProducts());
  }, [dispatch, userId]);

  // 📌 Kiểm tra lỗi: gộp tổng số lượng theo originalProductId và so sánh với stock
  const checkCartErrors = () => {
    // Gộp số lượng theo originalProductId
    const groupedByOriginalProductId: {
      [key: string]: {
        name: string;
        totalQuantity: number;
        productIds: number[];
      };
    } = {};

    items.forEach((item) => {
      if (!groupedByOriginalProductId[item.originalProductId]) {
        groupedByOriginalProductId[item.originalProductId] = {
          name: item.name,
          totalQuantity: 0,
          productIds: [],
        };
      }
      groupedByOriginalProductId[item.originalProductId].totalQuantity +=
        item.quantity;
      if (
        !groupedByOriginalProductId[item.originalProductId].productIds.includes(
          item.productId
        )
      ) {
        groupedByOriginalProductId[item.originalProductId].productIds.push(
          item.productId
        );
      }
    });

    // Kiểm tra tổng số lượng vượt stock
    const overStockErrors: string[] = [];
    Object.entries(groupedByOriginalProductId).forEach(
      ([originalProductId, { name, totalQuantity, productIds }]) => {
        const product = products.find((p) => p.id === originalProductId);
        if (product && totalQuantity > product.stock) {
          overStockErrors.push(
            `⚠️ Sản phẩm "${name}" (ID: ${productIds.join(
              ', '
            )}) có tổng số lượng ${totalQuantity}, vượt quá tồn kho (${
              product.stock
            }).`
          );
        }
      }
    );

    // Tạo thông báo lỗi
    if (overStockErrors.length > 0) {
      setErrorMessage(overStockErrors.join('\n'));
      return false; // Có lỗi
    } else {
      setErrorMessage(null);
      return true; // Không có lỗi
    }
  };

  // 📌 Danh sách cartItems (không gộp nếu trùng productId để hiển thị)
  const cartItems = items;

  /** 📌 Xóa sản phẩm khỏi giỏ hàng */
  const handleRemove = async (productId: number) => {
    try {
      await dispatch(removeFromCart({ userId, productId })).unwrap();
      setErrorMessage(null);
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

    // Kiểm tra lỗi trước khi thanh toán
    if (!checkCartErrors()) {
      return; // Dừng lại nếu có lỗi
    }

    // ✅ Nếu hợp lệ, tiến hành thanh toán
    navigate('/checkout');
    setErrorMessage(null);
  };

  // Kiểm tra lỗi mỗi khi items hoặc products thay đổi
  useEffect(() => {
    if (products.length > 0) {
      checkCartErrors();
    }
  }, [items, products]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="p-6 bg-white shadow-lg rounded-md w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
          🛒 Giỏ hàng của bạn
        </h2>

        {/* 🔥 Hiển thị lỗi nếu có */}
        {(cartError || productsError || errorMessage) && (
          <p className="text-red-500 text-center font-semibold bg-red-100 p-3 rounded-md mb-4">
            {cartError || productsError || errorMessage}
          </p>
        )}

        {cartLoading || productsLoading ? (
          <p className="text-gray-500">Đang tải giỏ hàng...</p>
        ) : cartItems.length === 0 ? (
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
                {cartItems.map((item: any) => (
                  <tr
                    key={`${item.productId}-${item.color}`} // Thêm color vào key để tránh trùng lặp trong React
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
                          {item.name} ({item.color})
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
                    <td className="text-center">
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
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-8 border-t pt-5">
              <p className="text-xl font-semibold text-gray-700">
                Tổng tiền:{' '}
                <span className="text-red-600">
                  {cartItems
                    .reduce(
                      (total: number, item: any) =>
                        total + item.price * item.quantity,
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

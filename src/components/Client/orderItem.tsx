import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrders } from '../../store/slice/orderProduct';

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(fetchOrders(userId)); // 🔥 Lấy đơn hàng của userId = 2
  }, [dispatch, userId]);

  return (
    <div className="order-history">
      <h1>📜 Lịch sử đơn hàng</h1>

      {loading && <p>🔄 Đang tải đơn hàng...</p>}
      {error && <p>❌ Lỗi: {error}</p>}

      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <h3>📦 Đơn hàng #{order.id}</h3>
              <p>
                <strong>Khách hàng:</strong> {order.fullName} ({order.email})
              </p>
              <p>
                <strong>Số điện thoại:</strong> {order.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.address}, {order.ward},{' '}
                {order.district}, {order.province}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Tổng tiền:</strong> {order.total.toLocaleString()} VND
              </p>
              <p>
                <strong>Trạng thái:</strong>
                <span className={`status-${order.status.toLowerCase()}`}>
                  {' '}
                  {order.status}
                </span>
              </p>

              <h4>🛒 Sản phẩm:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    📱 Sản phẩm ID: {item.phoneId} - Số lượng: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>⚠️ Bạn chưa có đơn hàng nào!</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrders } from '../../store/slice/orderProduct';

const orderStatuses = [
  { id: '1', status: 'New', description: 'Đơn hàng đã tạo, chưa được xử lý.' },
  { id: '2', status: 'Processing', description: 'Đơn hàng đang được chuẩn bị.' },
  { id: '3', status: 'Shipped', description: 'Đơn hàng đã được giao hoặc đang trên đường.' },
  { id: '4', status: 'Completed', description: 'Đơn hàng đã được giao và hoàn tất.' },
  { id: '5', status: 'Cancelled', description: 'Đơn hàng đã bị hủy.' },
];

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    dispatch(fetchOrders(userId));
  }, [dispatch, userId]);

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter((order) => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-yellow-500';
      case 'Processing':
        return 'bg-blue-500';
      case 'Shipped':
        return 'bg-purple-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto my-8 p-8 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">📜 Lịch sử đơn hàng</h1>

      {loading && <p className="text-blue-500">🔄 Đang tải đơn hàng...</p>}
      {error && <p className="text-red-500">❌ Lỗi: {error}</p>}

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-medium">Lọc theo trạng thái:</label>
        <select
          id="filter"
          className="p-2 border rounded-md bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">Tất cả</option>
          {orderStatuses.map((status) => (
            <option key={status.id} value={status.status}>
              {status.status}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-6 border-b">Mã đơn</th>
                <th className="py-3 px-6 border-b">Khách hàng</th>
                <th className="py-3 px-6 border-b">Số điện thoại</th>
                <th className="py-3 px-6 border-b">Địa chỉ</th>
                <th className="py-3 px-6 border-b">Thanh toán</th>
                <th className="py-3 px-6 border-b">Tổng tiền</th>
                <th className="py-3 px-6 border-b">Trạng thái</th>
                <th className="py-3 px-6 border-b">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="py-3 px-6 border-b text-center font-medium">{order.id}</td>
                  <td className="py-3 px-6 border-b">
                    {order.fullName} <br />
                    <span className="text-sm text-gray-600">({order.email})</span>
                  </td>
                  <td className="py-3 px-6 border-b text-center">{order.phone}</td>
                  <td className="py-3 px-6 border-b">
                    {order.address}, {order.ward}, {order.district}, {order.province}
                  </td>
                  <td className="py-3 px-6 border-b text-center">{order.paymentMethod}</td>
                  <td className="py-3 px-6 border-b text-center">
                    {order.total.toLocaleString()} VND
                  </td>
                  <td className="py-3 px-6 border-b text-center">
                    <span
                      className={`py-1 px-3 rounded-full text-white text-sm ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 border-b text-center">
                 <Link to={`/history/${order.id}`}>
                 <button
                      className="py-1 px-3 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      
                    >
                      Chi tiết
                    </button>
                 </Link>   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">⚠️ Không có đơn hàng nào!</p>
      )}
    </div>
  );
};

export default OrderHistory;

import React from 'react';
import { Table, Tag, Select, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function OrderList() {
  const queryClient = useQueryClient();

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    const { data } = await axios.get('http://localhost:3000/orders');
    return data;
  };

  // Lấy danh sách trạng thái đơn hàng từ API
  const fetchOrderStatuses = async () => {
    const { data } = await axios.get('http://localhost:3000/OrderStatus');
    return data;
  };

  // Lấy danh sách sản phẩm từ bảng products
  const fetchProducts = async () => {
    const { data } = await axios.get('http://localhost:3000/products');
    return data;
  };

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    const { data } = await axios.get('http://localhost:3000/users');
    return data;
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const { data: orderStatuses } = useQuery({
    queryKey: ['order-statuses'],
    queryFn: fetchOrderStatuses,
  });

  // Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async ({
    orderId,
    newStatus,
  }: {
    orderId: string;
    newStatus: string;
  }) => {
    console.log(newStatus, orderId);
    await axios.patch(`http://localhost:3000/orders/${orderId}`, {
      status: newStatus,
    });
    console.log(newStatus);
  };

  const { mutate } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      alert('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries(['orders']); // Làm mới danh sách đơn hàng
    },
    onError: () => {
      alert('Cập nhật thất bại!');
    },
  });

  // Ánh xạ ID -> tên sản phẩm từ bảng `products`
  const getProductName = (productId: string) => {
    return (
      products?.find((product: any) => product.id === productId)?.name ||
      'Unknown'
    );
  };

  // Ánh xạ ID -> tên khách hàng từ bảng `users`
  const getUserName = (userId: string) => {
    return (
      users?.find((user: any) => user.id === userId)?.username || 'Unknown'
    );
  };

  // Cấu trúc bảng
  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => getUserName(userId),
    },
    {
      title: 'Sản Phẩm',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              📦 {getProductName(item.phoneId)} - SL: {item.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Tổng Tiền (VND)',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => total.toLocaleString() + ' VND',
    },
    {
      title: 'Trạng thái',
      render: (order: any) => (
        <Space>
          <Select
            value={order.status}
            style={{ width: 150 }}
            disabled={(() => {
              const currentStatus = orderStatuses?.find(
                (s: any) => s.status === order.status
              );
              return currentStatus?.id >= 4;
            })()}
            onChange={(newStatus: string) => {
              const currentStatus = orderStatuses?.find(
                (s: any) => s.status === order.status
              );
              const newStatusObj = orderStatuses?.find(
                (s: any) => s.status === newStatus
              );

              if (!currentStatus || !newStatusObj) return;

              // Không cho phép cập nhật trạng thái có id nhỏ hơn trạng thái hiện tại
              if (newStatusObj.id < currentStatus.id) {
                alert('Không thể quay lại trạng thái trước đó!');
                return;
              }

              mutate({ orderId: order.id, newStatus });
            }}
          >
            {orderStatuses?.map((status: any) => (
              <Select.Option
                key={status.id}
                value={status.status}
                disabled={(() => {
                  const currentStatus = orderStatuses?.find(
                    (s: any) => s.status === order.status
                  );
                  return status.id < currentStatus?.id; // Vô hiệu hóa trạng thái nhỏ hơn trạng thái hiện tại
                })()}
              >
                {status.status}
              </Select.Option>
            ))}
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      loading={isLoading}
      rowKey="id"
      scroll={{ y: 'calc(100vh - 250px)' }}
    />
  );
}

export default OrderList;

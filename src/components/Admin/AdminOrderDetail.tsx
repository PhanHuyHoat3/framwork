import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Descriptions, Spin, Button } from 'antd';

function AdminOrderDetail() {
  // Lấy ID từ URL
  const { id } = useParams();

  // Hàm gọi API để lấy chi tiết đơn hàng
  const fetchOrderDetail = async () => {
    const response = await axios.get(`http://localhost:3000/orders/${id}`);
    return response.data;
  };

  // Sử dụng useQuery để gọi API
  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order-detail', id],
    queryFn: fetchOrderDetail,
  });

  // Hiển thị khi đang tải
  if (isLoading) return <Spin size="large" />;

  // Giao diện chi tiết đơn hàng
  return (
    <div style={{ padding: 20 }}>
      <h2>Chi Tiết Đơn Hàng (Admin): {id}</h2>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã Đơn Hàng">{order?.id}</Descriptions.Item>
        <Descriptions.Item label="Khách Hàng">{order?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Sản Phẩm">
          {order?.items?.map((item: any, index: number) => (
            <p key={index}>
              Tên: {item.phoneId} - SL: {item.quantity}
            </p>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng Tiền">
          {order?.total?.toLocaleString()} VND
        </Descriptions.Item>
        <Descriptions.Item label="Trạng Thái">{order?.status}</Descriptions.Item>
      </Descriptions>
      {/* Nút hành động */}
      <div style={{ marginTop: 20 }}>
        <Button type="primary" style={{ marginRight: 8 }}>Sửa Đơn Hàng</Button>
        <Button type="danger">Xóa Đơn Hàng</Button>
      </div>
    </div>
  );
}

export default AdminOrderDetail;

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Descriptions, Spin, Alert, Button } from 'antd';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hàm lấy chi tiết đơn hàng từ API
  const fetchOrderDetail = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/orders/${id}`);
      console.log("Order Detail:", data);  // In dữ liệu để kiểm tra
      return data;
    } catch (error) {
      throw new Error('Không thể lấy chi tiết đơn hàng');
    }
  };

  // React Query để gọi API
  const { data: order, isLoading  } = useQuery({
    queryKey: ['order-detail', id],
    queryFn: fetchOrderDetail,
  });

  // Xử lý khi đang tải
  if (isLoading) return <Spin size="large" />;


  
  return (
    <div style={{ padding: 20 }}>
    <Button type="primary" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
      Quay lại
    </Button>
    <h2>Chi Tiết Đơn Hàng: {id}</h2>
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Mã Đơn Hàng">{order?.id || ''}</Descriptions.Item>
      <Descriptions.Item label="Khách Hàng">{order?.fullName || ''}</Descriptions.Item>
      <Descriptions.Item label="Số Điện Thoại">{order?.phone || ''}</Descriptions.Item>
      <Descriptions.Item label="Email">{order?.email || ''}</Descriptions.Item>
      <Descriptions.Item label="Địa Chỉ">
        {order?.address
          ? `${order.address}, ${order.ward}, ${order.district}, ${order.province}`
          : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Phương Thức Thanh Toán">{order?.paymentMethod || ''}</Descriptions.Item>
      <Descriptions.Item label="Ghi Chú">{order?.notes || ''}</Descriptions.Item>
      <Descriptions.Item label="Sản Phẩm">
        {order?.items?.map((item: any, index: number) => (
          <p key={index}>
            📦 {item.phoneId} - SL: {item.quantity}
          </p>
        )) || ''}
      </Descriptions.Item>
      <Descriptions.Item label="Tổng Tiền">
        {order?.total?.toLocaleString() || ''} VND
      </Descriptions.Item>
      <Descriptions.Item label="Trạng Thái">{order?.status || ''}</Descriptions.Item>
    </Descriptions>
  </div>
  
  );
}

export default OrderDetail;

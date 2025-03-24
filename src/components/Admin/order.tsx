import React from "react";
import { Table, Button, Tag } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function OrderList() {
  const queryClient = useQueryClient();

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    const { data } = await axios.get("http://localhost:3000/orders");
    return data;
  };

  // Lấy danh sách sản phẩm từ bảng products
  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:3000/products");
    return data;
  };

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:3000/users");
    return data;
  };

  const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });
  const { data: products } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  // Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (order: any) => {
    const newStatus = order.status === "pending" ? "completed" : "pending";
    await axios.patch(`http://localhost:3000/orders/${order.id}`, { status: newStatus });
  };

  const { mutate } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      alert("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries(["orders"]); // Làm mới danh sách đơn hàng
    },
    onError: () => {
      alert("Cập nhật thất bại!");
    },
  });

  // Ánh xạ ID -> tên sản phẩm từ bảng `products`
  const getProductName = (productId: number) => {
    return products?.find((product: any) => product.id === productId)?.name || "Unknown";
  };

  // Ánh xạ ID -> tên khách hàng từ bảng `users`
  const getUserName = (userId: number) => {
    return users?.find((user: any) => user.id === userId)?.username || "Unknown";
  };

  // Cấu trúc bảng
  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách Hàng",
      dataIndex: "userId",
      key: "userId",
      render: (userId: number) => getUserName(userId),
    },
    {
      title: "Sản Phẩm",
      dataIndex: "items",
      key: "items",
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
      title: "Tổng Tiền (VND)",
      dataIndex: "total",
      key: "total",
      render: (total: number) => total.toLocaleString() + " VND",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Địa Chỉ Giao Hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Thanh Toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Actions",
      render: (order: any) => (
        <>
          <Button type="primary" onClick={() => mutate(order)} style={{ marginRight: 8 }}>
            {order.status === "pending" ? "Hoàn Thành" : "Chờ Duyệt"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      loading={isLoading}
      rowKey="id"
      scroll={{ y: "calc(100vh - 250px)" }}
    />
  );
}

export default OrderList;
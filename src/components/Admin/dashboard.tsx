import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import dayjs from "dayjs";

// Kiểu dữ liệu đơn hàng
interface OrderItem {
  phoneId: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phone: number;
  address: string;
  province: string;
  district: string;
  ward: string;
  notes: string;
  paymentMethod: string;
  total: number;
  items: OrderItem[];
  status: "New" | "Processing" | "Shipped" | "Completed" | "Cancelled";
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
}

const statusColors: Record<string, string> = {
  New: "#00bcd4",
  Processing: "#ff9800",
  Shipped: "#3f51b5",
  Completed: "#4caf50",
  Cancelled: "#f44336",
};

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  useEffect(() => {
    // Lấy đơn hàng
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));

    // Lấy sản phẩm
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // 🔍 Lọc theo từ khóa + ngày
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const orderDate = dayjs(order.createdAt);
    const inRange =
      (!dateRange.from || orderDate.isAfter(dayjs(dateRange.from).subtract(1, "day"))) &&
      (!dateRange.to || orderDate.isBefore(dayjs(dateRange.to).add(1, "day")));

    return matchesSearch && inRange;
  });

  const completedOrders = filteredOrders.filter((order) => order.status === "Completed");

  const productStats = completedOrders.reduce<Record<string, number>>((acc, order) => {
    order.items.forEach((item) => {
      acc[item.phoneId] = (acc[item.phoneId] || 0) + item.quantity;
    });
    return acc;
  }, {});

  const statusStats = filteredOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="p-6 space-y-10 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold">📊 Dashboard Quản lý Đơn hàng</h1>

        {/* 🔎 Tìm kiếm & lọc ngày */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-md shadow"
          />
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="border px-4 py-2 rounded-md shadow"
          />
          <span>-</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="border px-4 py-2 rounded-md shadow"
          />
        </div>

        {/* 📦 Bảng thống kê sản phẩm đã bán */}
        <div className="bg-white rounded-2xl shadow p-4 border max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">📦 Thống kê sản phẩm đã bán</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Sản phẩm</th>
                <th className="p-2 border">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(productStats).map(([phoneId, quantity], index) => {
                const productName = products.find((p) => p.id === phoneId)?.name || "Không rõ";
                return (
                  <tr key={phoneId}>
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border text-center">{productName}</td>
                    <td className="p-2 border text-center">{quantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 📈 Biểu đồ trạng thái + doanh thu cùng hàng */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Biểu đồ trạng thái */}
          <div className="bg-white rounded-2xl shadow p-4 border w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">📈 Biểu đồ trạng thái đơn hàng</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(statusStats).map(([status, count]) => ({
                    name: status,
                    value: count,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {Object.keys(statusStats).map((status, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[status] || "#ccc"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Biểu đồ doanh thu */}
          <div className="bg-white rounded-2xl shadow p-4 border w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">📊 Doanh thu</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Doanh thu", revenue: totalRevenue }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="revenue" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📋 Danh sách đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
          {Object.keys(statusColors).map((status) => {
            const ordersByStatus = filteredOrders.filter((o) => o.status === status);
            return (
              <div key={status} className="bg-white rounded-2xl shadow p-4 border">
                <h2 className="text-lg font-semibold">{status}</h2>
                <p className="text-sm text-gray-500 mb-2">Tổng đơn: {ordersByStatus.length}</p>
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {ordersByStatus.map((order) => (
                    <li key={order.id} className="border p-3 rounded-xl hover:bg-gray-50">
                      <p><strong>Khách:</strong> {order.fullName}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Tổng tiền:</strong> {order.total.toLocaleString()} VND</p>
                      <p><strong>Ngày:</strong> {dayjs(order.createdAt).format("DD/MM/YYYY")}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createOrder, Order } from '../../store/slice/orderProduct';
import { CartItem } from '../../store/api/cartApi';
import { clearCart } from '../../store/slice/cartProduct';
import { updateStock } from '../../store/slice/Product';
import { useNavigate } from 'react-router-dom';

// 🏗 Danh sách tỉnh/quận/xã mẫu
const provinces = [
  {
    id: 1,
    name: 'Hà Nội',
    districts: [
      {
        id: 11,
        name: 'Quận Hoàn Kiếm',
        wards: ['Phường Hàng Bạc', 'Phường Hàng Gai'],
      },
      {
        id: 12,
        name: 'Quận Ba Đình',
        wards: ['Phường Điện Biên', 'Phường Kim Mã'],
      },
    ],
  },
  {
    id: 2,
    name: 'TP Hồ Chí Minh',
    districts: [
      {
        id: 21,
        name: 'Quận 1',
        wards: ['Phường Bến Nghé', 'Phường Bến Thành'],
      },
      { id: 22, name: 'Quận 3', wards: ['Phường Võ Thị Sáu', 'Phường 6'] },
    ],
  },
];
export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 🔹 Lấy dữ liệu từ Redux
  const cartState = useSelector((state: RootState) => state.cart);
  const authState = useSelector((state: RootState) => state.auth);
  const orderState = useSelector((state: RootState) => state.order);

  const userCart = cartState.items.length > 0 ? cartState : null;
  const totalAmount = userCart
    ? userCart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    : 0;

  // 📝 State Form (Thêm `notes`)
  const [form, setForm] = useState<Omit<Order, 'id' | 'items' | 'status'>>({
    userId: authState.user?.id || 0,
    email: authState.user?.email || '',
    fullName: authState.user?.username || '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    notes: '', // 📌 Thêm trường ghi chú
    paymentMethod: 'Chuyen tien',
    total: totalAmount,
  });
  // 🏗 State lưu danh sách quận & xã theo tỉnh đã chọn
  const [districts, setDistricts] = useState<
    { id: number; name: string; wards: string[] }[]
  >([]);
  const [wards, setWards] = useState<string[]>([]);

  // Cập nhật form khi nhập dữ liệu
  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi chọn tỉnh
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = provinces.find((p) => p.name === e.target.value);
    setDistricts(selectedProvince ? selectedProvince.districts : []);
    setWards([]);
    setForm((prev) => ({
      ...prev,
      province: e.target.value,
      district: '',
      ward: '',
    }));
  };

  // Xử lý khi chọn quận
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = districts.find((d) => d.name === e.target.value);
    setWards(selectedDistrict ? selectedDistrict.wards : []);
    setForm((prev) => ({ ...prev, district: e.target.value, ward: '' }));
  };

  // ✅ Kiểm tra form trước khi gửi
  const validateForm = () => {
    if (
      !form.email ||
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.province
    ) {
      alert('❗ Vui lòng nhập đầy đủ thông tin!');
      return false;
    }
    if (!/^\d{10,11}$/.test(form.phone.toLocaleString())) {
      alert('⚠️ Số điện thoại không hợp lệ! Vui lòng nhập 10-11 số.');
      return false;
    }
    if (!userCart) {
      alert('⚠️ Giỏ hàng của bạn đang trống!');
      return false;
    }
    return true;
  };

  // 🛠 Xử lý đặt hàng
  const handleCheckout = async () => {
    if (!validateForm()) return;

    const formattedItems = userCart.items.map((item: CartItem) => ({
      phoneId: item.productId,
      quantity: item.quantity,
    }));

    const newOrder: Order = {
      ...form,
      phone: Number(form.phone),
      items: formattedItems,
      status: 'pending',
    };

    try {
      await dispatch(createOrder(newOrder)).unwrap();
      await Promise.all(
        formattedItems.map((item) =>
          dispatch(
            updateStock({ productId: item.phoneId, quantity: item.quantity })
          )
        )
      );

      alert('✅ Đặt hàng thành công!');
      dispatch(clearCart(authState.user?.id || 0));
      navigate(' ');

      setForm({
        userId: authState.user?.id || 0,
        email: authState.user?.email || '',
        fullName: authState.user?.username || '',
        phone: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        notes: '', // ✅ Reset ghi chú sau khi đặt hàng
        paymentMethod: 'Chuyen tien',
        total: 0,
      });
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      alert('❌ Có lỗi xảy ra: ' + (error || 'Lỗi không xác định'));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Thông tin nhận hàng</h2>

      {/* 🔹 Form nhập thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded-md"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded-md"
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded-md"
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded-md"
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          required
        />
        <select
          className="border p-2 rounded-md"
          name="province"
          value={form.province}
          onChange={handleProvinceChange}
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>

        {/* 🔹 Chọn quận */}
        <select
          className={`border p-2 rounded-md  ${
            !form.province ? 'bg-gray-500' : ''
          }   `}
          name="district"
          value={form.district}
          onChange={handleDistrictChange}
          disabled={!form.province}
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.id} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>

        {/* 🔹 Chọn xã */}
        <select
          className={`border p-2 rounded-md ${
            !form.district ? 'bg-gray-500' : ''
          }`}
          name="ward"
          value={form.ward}
          onChange={handleChange}
          disabled={!form.district}
        >
          <option
            value=""
            className={` ${
              !form.ward ? 'bg-brown-300 bg-red-800' : 'bg-white' // 🔥 Nếu chưa chọn → màu nâu, đã chọn → màu trắng
            }`}
          >
            Chọn Phường/Xã
          </option>
          {wards.map((ward, index) => (
            <option key={index} value={ward}>
              {ward}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Thêm ô ghi chú */}
      <textarea
        className="border p-2 rounded-md w-full mt-4"
        name="notes"
        placeholder="Ghi chú đơn hàng"
        value={form.notes}
        onChange={handleChange}
      />

      <h3 className="text-lg font-semibold mt-6">Sản phẩm trong đơn hàng</h3>
      {userCart ? (
        <ul className="flex flex-wrap gap-4 mt-2">
          {userCart.items.map((item: CartItem) => (
            <li
              key={item.productId}
              className="flex items-center gap-3 border p-2 rounded-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md"
              />
              <div className="w-[300px]">
                <strong className="line-clamp-1">{item.name}</strong> -{' '}
                <span className="text-gray-500">Màu: {item.color}</span>
                <p>
                  {item.quantity} x {item.price.toLocaleString()}₫
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-red-500">⚠️ Giỏ hàng của bạn đang trống.</p>
      )}
      <h3 className="text-lg font-semibold mt-6">Phương thức thanh toán</h3>
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="Chuyen tien"
            checked={form.paymentMethod === 'Chuyen tien'}
            onChange={handleChange}
          />
          Chuyển khoản
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="Tien mat"
            checked={form.paymentMethod === 'Tien mat'}
            onChange={handleChange}
          />
          Tiền mặt khi nhận hàng
        </label>
      </div>

      <h3 className="text-lg font-semibold mt-4">
        🛒 Tổng tiền: {totalAmount.toLocaleString()}₫
      </h3>

      <button
        className={`mt-4 px-4 py-2 rounded  -md text-white ${
          orderState.loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={handleCheckout}
        disabled={orderState.loading}
      >
        {orderState.loading ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
      </button>
    </div>
  );
}

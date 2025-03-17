import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import Cart from '../../components/Client/cartProduct';

function CartProduct() {
  // Lấy thông tin user từ Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Khi Redux khởi tạo xong, đánh dấu đã kiểm tra auth
  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  // Chỉ điều hướng nếu `isAuthChecked` đã hoàn tất và `user` không tồn tại
  useEffect(() => {
    if (isAuthChecked && !user) {
      navigate('/login');
    }
  }, [user, navigate, isAuthChecked]);

  return (
    <div>
      {/* Kiểm tra `isAuthChecked` để tránh lỗi khi Redux đang load */}
      {isAuthChecked && user ? <Cart userId={user.id} /> : <p>Loading...</p>}
    </div>
  );
}

export default CartProduct;

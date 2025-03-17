import { useState, useEffect } from 'react';
import { IoMenuSharp, IoLocationSharp } from 'react-icons/io5';
import { IoIosSearch } from 'react-icons/io';
import {
  FaPhoneAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaShoppingCart,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchCart } from '../../store/slice/cartProduct';
import { logout } from '../../store/slice/login';
import CategoryProduct from '../../components/Client/categoryProduct';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    window.addEventListener('scroll', () => setIsScrolled(window.scrollY > 50));
    return () =>
      window.removeEventListener('scroll', () => setIsScrolled(false));
  }, []);

  useEffect(() => {
    if (user && user.id) dispatch(fetchCart(user.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => setShowUser(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowUser(false);
    }
  }, [user]);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 w-full h-16 bg-[#000f8f] px-6 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-lg shadow-md' : ''
      }`}
    >
      {/* 🏠 Logo */}
      <a href="/">
        <img
          className="w-auto max-h-[45px]"
          src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/logo.png?1719764721426"
          alt="Logo"
        />
      </a>

      {/* 🔍 Danh mục + Tìm kiếm */}
      <div className="flex items-center gap-x-4 flex-grow max-w-3xl">
        {/* 📂 Danh mục */}
        <div className="relative group">
          <button className="flex items-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition">
            <IoMenuSharp className="text-white text-xl mr-2" />
            <span className="text-white">Danh mục</span>
          </button>
          {/* 🛒 Dropdown Danh mục */}
          <div className="absolute left-0 top-full mt-2 w-48 bg-white text-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
            <CategoryProduct />
          </div>
        </div>

        {/* 🔎 Ô tìm kiếm */}
        <div className="relative flex-grow">
          <input
            className="w-full p-2 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none"
            type="text"
            placeholder="Bạn cần tìm gì..."
          />
          <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
        </div>
      </div>

      {/* 🎯 Các nút bên phải */}
      <div className="flex items-center gap-x-6 text-white">
        {/* 📞 Hotline */}
        <div className="flex items-center gap-x-2">
          <FaPhoneAlt size={18} />
          <div>
            <p className="text-sm">Hotline</p>
            <p className="text-sm font-semibold">1800 6601</p>
          </div>
        </div>

        {/* 📍 Hệ thống cửa hàng */}
        <div className="flex items-center gap-x-2">
          <IoLocationSharp size={18} />
          <p className="text-sm w-[100px]">Hệ Thống Cửa hàng</p>
        </div>

        {/* 🛒 Giỏ hàng */}
        <a href="/cart" className="relative flex items-center gap-x-2">
          <FaShoppingCart size={20} />
          <p className="text-sm">Giỏ hàng</p>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </a>

        {/* 👤 User Info */}
        {user && showUser ? (
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-semibold">{user.username}</p>
            <FaSignOutAlt
              className="cursor-pointer"
              onClick={() => dispatch(logout())}
            />
          </div>
        ) : (
          <div className="relative group flex flex-col items-center">
            <FaUserCircle size={20} />
            <p className="cursor-pointer text-sm">Thông tin</p>
            {/* 🏷 Dropdown User */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded-lg shadow-lg w-28 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <a
                href="/login"
                className="block px-2 py-1 hover:bg-gray-200 rounded"
              >
                Đăng nhập
              </a>
              <a
                href="/register"
                className="block px-2 py-1 hover:bg-gray-200 rounded"
              >
                Đăng ký
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

import { useState, useEffect } from 'react';
import { IoMenuSharp } from 'react-icons/io5';
import { IoIosSearch } from 'react-icons/io';
import { FaPhoneAlt, FaUserCircle } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { FaShoppingCart } from 'react-icons/fa';
import CategoryProduct from '../../components/Client/categoryProduct';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 right-0 w-full z-50 flex justify-between items-center bg-[#000f8f] p-2 px-6 h-16 
      transition-all duration-300 ease-in-out ${
        isScrolled ? 'backdrop-blur-lg shadow-md' : ''
      }`}
    >
      {/* Logo */}
      <div className="p-2">
        <img
          className="w-auto max-h-[45px] transition-all duration-300 ease-in-out"
          src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/logo.png?1719764721426"
          alt="Logo"
        />
      </div>

      {/* Danh mục và Tìm kiếm */}
      <div className="flex items-center gap-x-4 flex-grow max-w-3xl">
        {/* Nút Danh mục */}
        <div className="relative group">
          <div className="flex items-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-all duration-200 cursor-pointer">
            <IoMenuSharp className="text-white text-xl mr-2" />
            <h4 className="text-white">Danh mục</h4>
          </div>

          {/* Danh mục hiển thị khi hover */}
          <div className="absolute left-0 top-full mt-1 w-48 bg-white text-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <CategoryProduct />
          </div>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative flex-grow">
          <input
            className="w-full p-2 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none"
            type="text"
            placeholder="Bạn cần tìm gì..."
          />
          <IoIosSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        </div>
      </div>

      {/* Các nút bên phải */}
      <div className="flex items-center gap-x-4 text-white">
        {/* Hotline */}
        <div className="flex items-center gap-x-2">
          <FaPhoneAlt size={20} />
          <div className="flex flex-col">
            <p>Hotline</p>
            <p>1800 6601</p>
          </div>
        </div>

        {/* Hệ thống cửa hàng */}
        <div className="flex items-center gap-x-2">
          <IoLocationSharp size={20} />
          <p className="w-[100px]">Hệ Thống Cửa hàng</p>
        </div>

        {/* Giỏ hàng */}
        <div className="relative flex items-center gap-x-2">
          <FaShoppingCart size={20} />
          <p>Giỏ hàng</p>
          <span className="absolute -top-2 -right-3 bg-white text-black text-[10px] rounded-full w-[18px] h-[18px] flex justify-center items-center">
            0
          </span>
        </div>

        {/* Thông tin user */}
        <div className="relative group flex flex-col items-center ml-3">
          <FaUserCircle size={20} />
          <p className="cursor-pointer">Thông tin</p>
          {/* Dropdown Thông tin */}
          <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto absolute top-8 left-1/2 -translate-x-1/2 bg-white text-black p-2 rounded-lg shadow-lg w-28 transition-all duration-200">
            <a href="#" className="block px-2 py-1 hover:bg-gray-200 rounded">
              Đăng nhập
            </a>
            <a href="#" className="block px-2 py-1 hover:bg-gray-200 rounded">
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

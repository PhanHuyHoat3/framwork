    import React from 'react';

    const Footer: React.FC = () => {
    const policyItems = [
        { href: '/chinh-sach-thanh-vien', title: 'Chính sách thành viên' },
        { href: '/chinh-sach-thanh-toan', title: 'Chính sách thanh toán' },
        {
        href: '/chinh-sach-bao-hanh-va-bao-tri',
        title: 'Chính sách bảo hành và bảo trì',
        },
        {
        href: '/chinh-sach-van-chuyen-vao-giao-nhan',
        title: 'Chính sách vận chuyển vào giao nhận',
        },
        { href: '/bao-mat-thong-tin-ca-nhan', title: 'Bảo mật thông tin cá nhân' },
    ];

    const supportItems = [
        { href: '/huong-dan-mua-hang', title: 'Hướng dẫn mua hàng' },
        { href: '/huong-dan-thanh-toan', title: 'Hướng dẫn thanh toán' },
        { href: '/huong-dan-giao-nhan', title: 'Hướng dẫn giao nhận' },
        { href: '/dieu-khoan-dich-vu', title: 'Điều khoản dịch vụ' },
        { href: '/cau-hoi-thuong-gap', title: 'Câu hỏi thường gặp' },
    ];

    const additionalSupportItems = [
        { href: '/san-pham-yeu-thich', title: 'Sản phẩm yêu thích' },
        { href: '/so-sanh-san-pham', title: 'So sánh sản phẩm' },
        { href: '/he-thong-cua-hang', title: 'Hệ thống cửa hàng' },
        { href: '/tra-cuu-bao-hanh', title: 'Tra cứu bảo hành' },
        { href: '/account/login', title: 'Đăng nhập tài khoản' },
        { href: '/lien-he', title: 'Liên hệ' },
    ];

    const categoryItems = [
        { href: '/iphone', title: 'iPhone' },
        { href: '/ipad', title: 'iPad' },
        { href: '/watch', title: 'Watch' },
        { href: '/mac', title: 'Mac' },
        { href: '/airpods', title: 'AirPods' },
        { href: '/am-thanh', title: 'Âm thanh' },
        { href: '/phu-kien', title: 'Phụ kiện' },
    ];

    return (
        <footer className="bg-gray-900 text-white p-6">
        {/* Top Footer */}
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0 w-full md:w-auto">
            <form className="flex w-full">
                <input
                type="email"
                placeholder="Nhập email nhận tin khuyến mãi"
                className="p-2 rounded-l-lg border-none flex-1 w-full md:w-auto"
                required
                />
                <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
                >
                ĐĂNG KÝ
                </button>
            </form>
            </div>
            <div className="flex space-x-4">
            <span>Kết nối với chúng tôi:</span>
            <a href="#" className="hover:text-gray-300">
                <img
                src="https://via.placeholder.com/32"
                alt="Zalo"
                className="w-8 h-8"
                />
            </a>
            <a href="#" className="hover:text-gray-300">
                <img
                src="https://via.placeholder.com/32"
                alt="Facebook"
                className="w-8 h-8"
                />
            </a>
            <a href="#" className="hover:text-gray-300">
                <img
                src="https://via.placeholder.com/32"
                alt="Youtube"
                className="w-8 h-8"
                />
            </a>
            <a href="#" className="hover:text-gray-300">
                <img
                src="https://via.placeholder.com/32"
                alt="Google"
                className="w-8 h-8"
                />
            </a>
            </div>
        </div>

        {/* Middle Footer */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
            <h4 className="text-lg font-bold mb-2">Chính sách</h4>
            <ul className="space-y-1">
                {policyItems.map((item, index) => (
                <li key={index}>
                    <a href={item.href} className="text-blue-300 hover:underline">
                    {item.title}
                    </a>
                </li>
                ))}
            </ul>
            </div>
            <div>
            <h4 className="text-lg font-bold mb-2">Hỗ trợ</h4>
            <ul className="space-y-1">
                {supportItems.map((item, index) => (
                <li key={index}>
                    <a href={item.href} className="text-blue-300 hover:underline">
                    {item.title}
                    </a>
                </li>
                ))}
            </ul>
            </div>
            <div>
            <h4 className="text-lg font-bold mb-2">Hỗ trợ</h4>
            <ul className="space-y-1">
                {additionalSupportItems.map((item, index) => (
                <li key={index}>
                    <a href={item.href} className="text-blue-300 hover:underline">
                    {item.title}
                    </a>
                </li>
                ))}
            </ul>
            </div>
            <div>
            <h4 className="text-lg font-bold mb-2">Danh mục nổi bật</h4>
            <ul className="space-y-1">
                {categoryItems.map((item, index) => (
                <li key={index}>
                    <a href={item.href} className="text-blue-300 hover:underline">
                    {item.title}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        </div>

        {/* Bottom Footer */}
        <div className="container mx-auto mt-6 text-center text-gray-400">
            <p>
            Bản quyền thuộc về <b>Dola theme</b>. Cung cấp bởi{' '}
            <a
                href="https://www.sapo.vn"
                className="text-blue-300 hover:underline"
            >
                Sapo
            </a>
            </p>
        </div>
        </footer>
    );
    };

    export default Footer;

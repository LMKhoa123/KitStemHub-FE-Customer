import {
  CopyrightOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="logo flex flex-col items-center md:items-start font-medium text-pretty">
          <p className="text-2xl mb-4">KitStemhub</p>
        </div>

        <div className="support text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Hỗ trợ</h2>
          <p>111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p>exclusive@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        <div className="account text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Tài khoản</h2>
          <Link
            to="/profile/profileinfo"
            className="block hover:text-pretty mb-1 kt-footer-item "
          >
            Tài khoản của tôi
          </Link>

          <a
            href="#cart"
            className="block hover:text-pretty mb-1 kt-footer-item"
          >
            Giỏ hàng
          </a>
          <a
            href="#wishlist"
            className="block hover:text-pretty mb-1 kt-footer-item"
          >
            Danh sách yêu thích
          </a>
          <Link
            to="/home/user"
            className="block hover:text-pretty mb-1 kt-footer-item"
          >
            Cửa hàng
          </Link>
        </div>

        <div className="quickLink text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Liên kết nhanh</h2>
          <a
            href="#privacy-policy"
            className="block hover:text-pretty mb-1 kt-footer-item"
          >
            Chính sách bảo mật
          </a>
          <a
            href="#terms-of-use"
            className="block hover:text-pretty mb-1 kt-footer-item"
          >
            Điều khoản sử dụng
          </a>
          <a
            href="#faq"
            className="block hover:text-pretty mb-1 kt-footer-item"
          >
            Câu hỏi thường gặp
          </a>
          <a href="#contact" className="block hover:text-pretty mb-4">
            Liên hệ
          </a>

          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-pretty kt-footer-item"
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-pretty kt-footer-item"
            >
              <TwitterOutlined />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-pretty kt-footer-item"
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-pretty kt-footer-item"
            >
              <LinkedinOutlined />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t-2  border-gray-700 mt-8 flex justify-center items-center space-x-2 py-1 text-gray-600">
        <span>
          <CopyrightOutlined />
        </span>
        <span>Copyright KitStemHub. All rights reserved</span>
      </div>
    </footer>
  );
}

export default Footer;

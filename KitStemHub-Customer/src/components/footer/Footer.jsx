import {
  CopyrightOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  HomeOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div className="logo flex flex-col items-center md:items-start">
          <p className="text-2xl font-bold mb-4">KitStemhub</p>
          <p className="text-gray-300 text-sm text-center md:text-left">
            Nền tảng về KIT STEM hàng đầu dành cho học sinh, sinh viên Việt Nam
          </p>
        </div>

        <div className="support text-center md:text-left">
          <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <HomeOutlined className="text-gray-400" />
              <p className="text-gray-300">Nhà Văn hóa Sinh viên TP.HCM</p>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <EnvironmentOutlined className="text-gray-400" />
              <p className="text-gray-300">Lưu Hữu Phước, Dĩ An, Bình Dương</p>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <MailOutlined className="text-gray-400" />
              <p className="text-gray-300">kitstemhub@gmail.com</p>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <PhoneOutlined className="text-gray-400" />
              <p className="text-gray-300">028 7300 5588</p>
            </div>
          </div>
        </div>

        <div className="useful-links text-center md:text-left">
          <h2 className="text-lg font-semibold mb-4">Liên kết hữu ích</h2>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link
                to="/aboutUs"
                className="hover:text-white transition-colors"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Các Sản Phẩm
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        <div className="social text-center md:text-left">
          <h2 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h2>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-blue-500 transition-colors"
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-blue-400 transition-colors"
            >
              <TwitterOutlined />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-pink-500 transition-colors"
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-blue-600 transition-colors"
            >
              <LinkedinOutlined />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4">
        <div className="container mx-auto flex justify-center items-center space-x-2 text-gray-400">
          <CopyrightOutlined />
          <span>2024 KitStemHub. All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

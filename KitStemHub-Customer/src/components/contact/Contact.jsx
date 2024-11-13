import {
  PhoneTwoTone,
  WechatOutlined,
  EnvironmentTwoTone,
} from "@ant-design/icons";

function Contact() {
  return (
    <section
      className="font-sans min-h-screen flex flex-col items-center justify-center bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/product-page.png')",
      }}
    >
      {/* Header Section */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between text-white py-16 px-8 lg:px-16 bg-opacity-85 bg-blue-900">
        {/* Left Side: Title and Description */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-5xl font-bold leading-tight">
            Hãy liên lạc với <br />
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              chúng tôi
            </span>
          </h2>
          <p className="mt-4 text-xl">
            Chúng tôi rất muốn nghe ý kiến ​​từ bạn.
            <br />
            Đây là cách bạn có thể liên hệ với chúng tôi.
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center items-center">
          <img
            src="contact-image.png"
            alt="Contact Us"
            className="w-full max-w-lg h-auto rounded-xl shadow-xl transform hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>
      </div>

      {/* Contact Boxes Section */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 px-4 lg:px-0 max-w-6xl">
        {/* Left Box: Talk to Sales */}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 flex flex-col items-center text-center space-y-10 transform hover:scale-105 transition duration-500 ease-in-out">
          <PhoneTwoTone twoToneColor="#1d4ed8" className="text-5xl" />
          <h3 className="text-2xl font-semibold">Talk to Sales</h3>
          <p className="text-gray-600">
            Quan tâm đến sản phẩm của chúng tôi? Chỉ cần nhấc điện thoại để trò
            chuyện với đội ngũ bán hàng của chúng tôi.
          </p>
          <a
            href="tel:+842873005588"
            className="text-blue-600 text-lg font-bold hover:underline"
          >
            +84 28 7300 1866
          </a>
        </div>

        {/* Right Box: Customer Support */}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 flex flex-col items-center text-center space-y-10 transform hover:scale-105 transition duration-500 ease-in-out">
          <WechatOutlined className="text-5xl text-blue-700" />
          <h3 className="text-2xl font-semibold">Liên hệ qua Zalo</h3>
          <p className="text-gray-600">
            Cần hỗ trợ? Kết nối với chúng tôi qua Zalo để được hỗ trợ ngay.
          </p>
          <a
            href="https://zalo.me/0388319705"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 transition"
          >
            Liên hệ qua Zalo
          </a>
        </div>
      </div>

      {/* Address Section */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-1 px-4 lg:px-0 max-w-6xl">
        <div className="bg-white bg-opacity-90 py-8 w-full mt-12 text-center mb-10 rounded-lg shadow-lg transform hover:scale-105 transition duration-500 ease-in-out">
          <div className="flex items-center justify-center space-x-3">
            <EnvironmentTwoTone twoToneColor="#1d4ed8" className="text-3xl" />
            <span className="text-gray-700">
              <strong>Địa chỉ:</strong> Lưu Hữu Phước, Tân Lập, Đông Hoà, Dĩ An,
              Bình Dương
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

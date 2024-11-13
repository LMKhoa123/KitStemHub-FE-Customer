import { Card, Typography, Divider } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div
      className="min-h-screen py-10"
      style={{
        background: `
         
          url('/product-page.png')
        `,
        backgroundColor: "#ffffff",
      }}
    >
      <div className="container mx-auto px-4">
        <Card className="shadow-lg rounded-lg">
          {/* Hero section với ảnh */}
          <div className="mb-8">
            <img
              src="/page1.jpeg"
              alt="STEM Kit Collection"
              className="w-full h-[300px] object-cover rounded-lg mb-6"
            />

            <Paragraph className="text-lg text-gray-600 text-center">
              <strong> KitStemHub</strong> là nền tảng giáo dục tiên phong giúp
              học sinh và giáo viên tiếp cận dễ dàng hơn với giáo dục STEM thông
              qua các bộ kit và tài liệu hỗ trợ chi tiết. Chúng tôi hướng đến
              việc mang đến một trải nghiệm học tập trực quan và thú vị, giúp
              người học dễ dàng khám phá và áp dụng các kiến thức khoa học và
              công nghệ vào thực tế.
            </Paragraph>
          </div>

          <Divider />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Nhiệm vụ và Tầm nhìn */}
            <div>
              <Title level={3} className="text-gray-700">
                <RocketOutlined className="mr-2" /> Nhiệm Vụ và Tầm Nhìn
              </Title>
              <Paragraph className="text-gray-600 text-lg">
                KitStemHub cung cấp các sản phẩm và dịch vụ hướng tới giáo dục
                STEM chất lượng cao. Sứ mệnh của chúng tôi là xây dựng nền tảng
                học tập với công cụ và tài liệu hữu ích, phù hợp cho cả người
                học mới và những người muốn nâng cao. Chúng tôi tin rằng, với bộ
                kit và dịch vụ hỗ trợ chuyên nghiệp, mọi học sinh có thể phát
                triển kỹ năng cần thiết để bước vào tương lai số.
              </Paragraph>
            </div>

            <div>
              <img
                src="https://cdn.shopify.com/s/files/1/0552/3269/2430/articles/stem-for-middle-schoolers-guide-for-teaching-stem.webp?v=1707997434" // Đảm bảo thay đường dẫn ảnh phù hợp
                alt="STEM Kit Details"
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>
          </div>

          <Divider />

          {/* Giải pháp */}
          <div className="mb-8">
            <Title level={3} className="text-gray-700 text-center mb-8">
              Giải Pháp Của Chúng Tôi
            </Title>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-3 text-center text-gray-800">
                  Hướng Dẫn Chi Tiết
                </h4>
                <p className="text-gray-600 text-center">
                  Mỗi bộ kit đi kèm với hướng dẫn sử dụng chi tiết từng bước,
                  đảm bảo người dùng có thể tự tin thực hành và đạt được kết quả
                  mong muốn.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-full mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-3 text-center text-gray-800">
                  Hỗ Trợ Chuyên Nghiệp
                </h4>
                <p className="text-gray-600 text-center">
                  Đội ngũ chuyên gia STEM giàu kinh nghiệm của KitStemHub sẵn
                  sàng tư vấn và hỗ trợ người dùng khi cần.
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-rose-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-3 text-center text-gray-800">
                  Tài Liệu Đa Dạng
                </h4>
                <p className="text-gray-600 text-center">
                  Kho tài liệu phong phú của KitStemHub bao gồm các tài liệu từ
                  cơ bản đến nâng cao, đáp ứng mọi nhu cầu học tập.
                </p>
              </div>
            </div>
          </div>
          {/* <Divider /> */}

          {/* Phần kết và cảm ơn */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8 rounded-xl shadow-md border border-gray-100">
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 mx-auto shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>

                <Title level={3} className="text-gray-800 mb-4">
                  Cảm Ơn Bạn Đã Đồng Hành
                </Title>

                <Paragraph className="text-gray-600 text-lg mb-6">
                  KitStemHub tự hào được đồng hành cùng bạn trên hành trình khám
                  phá và học tập STEM. Chúng tôi cam kết không ngừng cải tiến để
                  mang đến những trải nghiệm học tập tốt nhất cho cộng đồng.
                </Paragraph>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;

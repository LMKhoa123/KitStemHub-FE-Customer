import {
  MailTwoTone,
  PhoneTwoTone,
  GlobalOutlined,
  EnvironmentTwoTone,
} from "@ant-design/icons";

function Contact() {
  return (
    <section className="bg-gradient-to-br from-blue-100 via-white to-blue-50 font-sans h-screen flex justify-center items-center">
      <div className="container mx-auto px-4 lg:px-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="">
          {/* Header */}
          <div className=" bg-blue-700 text-white py-4 rounded-t-xl -mx-4 lg:-mx-8">
            <h2 className="text-2xl font-bold text-center">
              Liên hệ với chúng tôi
            </h2>
          </div>

          {/* Contact Information */}
          <div className="px-3 py-6 space-y-8 text-gray-700 font-medium">
            {/* Phone */}
            <div className="flex items-center space-x-3">
              <PhoneTwoTone twoToneColor="#1d4ed8" className="text-2xl" />
              <span>028 7300 5588</span>
            </div>

            {/* Website */}
            <div className="flex items-center space-x-3">
              <GlobalOutlined className="text-2xl text-blue-700" />
              <a
                href="https://kit-stem-hub-fe-customer.vercel.app/"
                className="hover:underline"
              >
                https://kit-stem-hub-fe-customer.vercel.app
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <MailTwoTone twoToneColor="#1d4ed8" className="text-2xl" />
              <a href="mailto:kitstemhub@gmail.com" className="hover:underline">
                kitstemhub@gmail.com
              </a>
            </div>

            {/* Address */}
            <div className="flex items-center space-x-3">
              <EnvironmentTwoTone twoToneColor="#1d4ed8" className="text-2xl" />
              <span>Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

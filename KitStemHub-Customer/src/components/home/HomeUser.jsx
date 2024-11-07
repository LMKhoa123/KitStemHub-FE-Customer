import { useState } from "react";
import Search from "antd/es/input/Search";
import HomeCarousel from "./homeCarousel/HomeCarousel";
import HomeProductCarousel from "./homeProductCarousel/HomeProductCarousel";

function HomeUser() {
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái từ khóa tìm kiếm

  // Hàm xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm liên tục khi nhập
  };

  return (
    <>
      <HomeCarousel />

      {/* nav home page */}
      {/* <div className="flex mt-16"> */}
      {/* side bar */}

      {/* our product */}
      <div className="flex flex-col mt-16">
        <div className="container mx-auto px-4">
          <div className="flex mb-5 items-center">
            <div className="w-3 bg-rose-600 mr-3 rounded-lg h-8"></div>
            <h3 className="text-rose-600 font-medium flex items-center">
              Sản phẩm của chúng tôi
            </h3>
          </div>
          <h1 className="font-semibold text-3xl mb-10">
            Khám phá sản phẩm của chúng tôi
          </h1>
        </div>

        {/* carousel product */}
        <div className="flex-grow mb-16">
          <HomeProductCarousel searchTerm={searchTerm} />{" "}
          {/* Truyền searchTerm vào */}
        </div>
      </div>
      {/* </div> */}

      {/* service section */}
      <div className="flex justify-around py-16">
        {/* Free and Fast Delivery */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gray-200 rounded-full p-4">
              <div className="bg-black rounded-full p-2">
                <svg
                  className="h-8 w-8 text-white"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <circle cx={7} cy={17} r={2} />
                  <circle cx={17} cy={17} r={2} />
                  <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                </svg>
              </div>
            </div>
          </div>
          <h3 className="font-bold text-lg">
            GIAO HÀNG MIỄN PHÍ VÀ NHANH CHÓNG
          </h3>
          <p className="text-gray-500">
            Miễn phí giao hàng cho tất cả đơn hàng trên 3.000.000đ
          </p>
        </div>

        {/* 24/7 Customer Service */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gray-200 rounded-full p-4">
              <div className="bg-black rounded-full p-2">
                <svg
                  className="h-8 w-8 text-white"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <rect x={4} y={13} rx={2} width={4} height={6} />
                  <rect x={16} y={13} rx={2} width={4} height={6} />
                  <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
                  <path d="M18 19a6 3 0 0 1 -6 3" />
                </svg>
              </div>
            </div>
          </div>
          <h3 className="font-bold text-lg">DỊCH VỤ KHÁCH HÀNG 24/7</h3>
          <p className="text-gray-500">Hỗ trợ khách hàng thân thiện 24/7</p>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gray-200 rounded-full p-4">
              <div className="bg-black rounded-full p-2">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <h3 className="font-bold text-lg">ĐẢM BẢO HOÀN TIỀN</h3>
          <p className="text-gray-500">
            Chúng tôi hoàn tiền trong vòng 30 ngày
          </p>
        </div>
      </div>
    </>
  );
}

export default HomeUser;

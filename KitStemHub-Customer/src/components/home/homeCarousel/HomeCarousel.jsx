import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";

function HomeCarousel() {
  return (
    <Swiper
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Pagination, Autoplay]}
      className="carousel h-4/5 w-full"
    >
      <SwiperSlide>
        <div className="relative h-full w-full">
          <img
            loading="lazy"
            src="public/page1.jpeg"
            alt=""
            className="h-full w-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-medium font-sans">
            <span>Khám phá thế giới STEM</span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative h-full w-full">
          <img
            loading="lazy"
            src="public/page2.jpeg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-medium font-sans">
            <span>Đổi mới và truyền cảm hứng</span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative h-full w-full">
          <img
            loading="lazy"
            src="public/page5.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-medium font-sans">
            <span>Trao cho thế hệ tương lai</span>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

export default HomeCarousel;

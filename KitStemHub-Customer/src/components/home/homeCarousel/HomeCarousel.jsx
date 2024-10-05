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
      className="carousel h-4/5 w-full" // Điều chỉnh chiều cao nếu cần
    >
      <SwiperSlide>
        <img
          loading="lazy"
          src="https://nshopvn.com/fs/banners/6b2cff9c75b64254a59f0120dcd6e826.gif"
          alt=""
          className="h-full w-full object-cover" // Đảm bảo hình ảnh chiếm đầy chiều cao
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          loading="lazy"
          src="https://nshopvn.com/fs/banners/515b284519126a448b6525c59a86071d.gif"
          alt=""
          className="h-full w-full object-cover" // Đảm bảo hình ảnh chiếm đầy chiều cao
        />
      </SwiperSlide>
    </Swiper>
  );
}

export default HomeCarousel;

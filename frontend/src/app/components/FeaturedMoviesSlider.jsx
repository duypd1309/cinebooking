"use client";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateUtils";

const FeaturedMoviesSlider = () => {
  const [movies, setMovies] = useState([]);

  const router = useRouter();

  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/featured`
        );
        const result = await res.json();
        if (result.success) {
          setMovies(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải phim nổi bật:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={3}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      speed={500}
      coverflowEffect={{
        rotate: 30,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[EffectCoverflow, Pagination, Autoplay]}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
    >
      {movies.map((movie, index) => (
        <SwiperSlide key={movie.id}>
          <div
            className="py-12 text-center"
            onClick={() => {
              const swiper = swiperRef.current;
              if (!swiper) return;

              if (swiper.activeIndex === index) {
                // Slide đang active → chuyển tới trang chi tiết
                router.push(`/movies/${movie.id}`);
              } else {
                // Slide chưa active → chuyển nó vào giữa
                swiper.slideTo(index);
              }
            }}
          >
            <img
              src={movie.anh_phim}
              alt={movie.ten_phim}
              className=" max-w-[90%] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[260px]
    aspect-[2/3] object-cover mx-auto rounded-2xl shadow-xl
    transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
            />
            <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mt-4 drop-shadow hover:cursor-pointer hover:underline">
              {movie.ten_phim}
            </h3>
            <p className="text-md text-gray-500">
              Khởi chiếu: {formatDate(movie.ngay_khoi_chieu, "dd-MM-yyyy")}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedMoviesSlider;

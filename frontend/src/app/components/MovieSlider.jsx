"use client";

import { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import MovieItem from "./movies/MovieItem";
import LoadingSpinner from "./LoadingSpinner";

export default function MovieSlider({ nowShowing }) {
  const [movies, setMovies] = useState([]); // State để lưu danh sách phim
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading

  // Hàm fetch dữ liệu phim khi component mount
  useEffect(() => {
    const fetchMovies = async () => {
      const moviesState = nowShowing ? "now-showing" : "coming-soon";
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/${moviesState}`
        );
        const { data } = await res.json();
        setMovies(data); // Lưu dữ liệu vào state movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false); // Sau khi fetch xong thì thay đổi trạng thái loading
      }
    };

    fetchMovies();
  }, []); // useEffect chỉ chạy 1 lần khi component mount

  if (loading) {
    return (
      <div className="bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mt-2">
          {nowShowing ? "Phim đang chiếu" : "Phim sắp chiếu"}
        </h1>
      </div>

      {/* Swiper Slider */}
      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          grabCursor={true}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          modules={[Navigation, Pagination]}
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="pb-14">
              <MovieItem movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRef } from "react";

import MovieDetail from "@/app/components/movies/MovieDetail";
import TicketBooking from "@/app/components/movies/TicketBooking";

const DetailPage = () => {
  const { id } = useParams(); // Lấy ID từ URL thông qua useParams

  // Trạng thái để lưu thông tin phim
  const [movie, setMovie] = useState(null);

  // Trạng thái để lưu lịch chiếu của phim
  const [schedules, setSchedules] = useState([]);

  // Ref cho phần đặt vé
  const bookingRef = useRef(null);

  // Lấy thông tin phim
  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMovie(data.data);
        // Fetch lịch chiếu cho phim
        return fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/${id}/schedule`
        );
      })
      .then((res) => res.json())
      .then((data) => {
        setSchedules(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // Hàm scroll tới phần đặt vé
  const handleScroll = () => {
    if (bookingRef.current)
      bookingRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!movie) {
    return (
      <div className="text-center text-2xl">Đang lấy thông tin phim...</div>
    ); // Hiển thị thông báo khi dữ liệu chưa được load
  }

  return (
    <>
      <MovieDetail movie={movie} onScrollToBooking={handleScroll} />

      <TicketBooking schedules={schedules} ref={bookingRef} />
    </>
  );
};

export default DetailPage;

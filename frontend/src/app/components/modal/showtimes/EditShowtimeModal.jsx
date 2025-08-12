"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/utils/dateUtils";

export default function EditShowtimeModal({ showtimeId }) {
  const [form, setForm] = useState({
    movieId: "",
    theaterId: "",
    date: "",
    time: "",
    formatId: "",
  });

  const originalShowtime = useRef(null);

  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [formats, setFormats] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Lấy thông tin suất chiếu
        const resShowtime = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/showtimes/${showtimeId}`
        );
        const { data } = await resShowtime.json();
        const extractedData = {
          movieId: data.id_phim,
          theaterId: data.id_rap,
          date: formatDate(data.ngay_chieu, "yyyy-MM-dd"),
          time: data.gio_chieu?.slice(0, 5) || "", // Chỉ lấy giờ và phút
          formatId: data.id_dinh_dang,
        };
        setForm({ ...extractedData });
        originalShowtime.current = { ...extractedData };

        // Lấy danh sách phim
        const resMovies = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/all?limit=1000`
        );
        const moviesData = await resMovies.json();
        setMovies(moviesData.data || []);

        // Lấy danh sách rạp
        const restheaters = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/theaters/all?limit=1000`
        );
        const theatersData = await restheaters.json();
        setTheaters(theatersData.data || []);

        // Lấy danh sách định dạng
        const resFormats = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/formats/all?limit=1000`
        );
        const formatsData = await resFormats.json();
        setFormats(formatsData.data || []);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditShowtime = async (e) => {
    e.preventDefault();

    if (JSON.stringify(form) === JSON.stringify(originalShowtime.current)) {
      router.back();
      toast.info("Không có giá trị cần chỉnh sửa.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/showtimes/${showtimeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        router.replace(
          `/admin/showtimes?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
        toast.success("Cập nhật suất chiếu thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request cập nhật suất chiếu:", error);
    }
  };

  return (
    <Modal title="Chỉnh sửa suất chiếu">
      <form onSubmit={handleEditShowtime} className="space-y-4">
        {/* Chọn phim */}
        <select
          name="movieId"
          value={form.movieId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Chọn phim</option>
          {movies.map((m) => (
            <option key={m.id} value={m.id}>
              {m.ten_phim}
            </option>
          ))}
        </select>

        {/* Chọn rạp */}
        <select
          name="theaterId"
          value={form.theaterId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Chọn rạp</option>
          {theaters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.ten_rap}
            </option>
          ))}
        </select>

        {/* Ngày chiếu */}
        <input
          type="date"
          name="date"
          value={formatDate(form.date, "yyyy-MM-dd")}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Giờ chiếu */}
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Định dạng */}
        <select
          name="formatId"
          value={form.formatId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Chọn định dạng</option>
          {formats.map((f) => (
            <option key={f.id} value={f.id}>
              {f.ten_dinh_dang}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Lưu thông tin
        </button>
      </form>
    </Modal>
  );
}

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddShowtimeForm = ({ onAddShowtime }) => {
  const [form, setForm] = useState({
    movieId: "",
    theaterId: "",
    date: "",
    time: "",
    formatId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [formats, setFormats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, theaterRes, formatRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/all?limit=1000`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/theaters/all?limit=1000`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/formats/all?limit=1000`
          ),
        ]);

        const [movieData, theaterData, formatData] = await Promise.all([
          movieRes.json(),
          theaterRes.json(),
          formatRes.json(),
        ]);

        setMovies(movieData.data || []);
        setTheaters(theaterData.data || []);
        setFormats(formatData.data || []);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu!");
        console.error("Lỗi khi fetch:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.movieId) newErrors.movieId = "Vui lòng chọn phim!";
    if (!form.theaterId) newErrors.theaterId = "Vui lòng chọn rạp!";
    if (!form.date) newErrors.date = "Vui lòng chọn ngày chiếu!";
    if (!form.time) newErrors.time = "Vui lòng chọn giờ chiếu!";
    if (!form.formatId) newErrors.formatId = "Vui lòng chọn định dạng!";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // Tạo lịch chiếu nếu chưa có
      const scheduleRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_phim: form.movieId,
            id_rap: form.theaterId,
            ngay_chieu: form.date,
          }),
        }
      );

      const scheduleData = await scheduleRes.json();
      if (!scheduleRes.ok) throw new Error(scheduleData.message);

      const id_lich_chieu = scheduleData.id;

      // Tạo suất chiếu
      const showtimeRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/showtimes`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_lich_chieu,
            gio_chieu: form.time,
            id_dinh_dang: form.formatId,
          }),
        }
      );

      const showtimeData = await showtimeRes.json();
      if (!showtimeRes.ok) throw new Error(showtimeData.message);

      toast.success("Thêm suất chiếu thành công!");
      setForm({ movieId: "", theaterId: "", date: "", time: "", formatId: "" });
      setErrors({});
      onAddShowtime?.();
    } catch (error) {
      toast.error(error.message || "Thêm suất chiếu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-lg rounded-lg mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">Thêm suất chiếu mới</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Phim */}
        <div>
          <select
            name="movieId"
            value={form.movieId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Chọn phim --</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.ten_phim}
              </option>
            ))}
          </select>
          {errors.movieId && (
            <p className="text-red-500 text-sm mt-2">{errors.movieId}</p>
          )}
        </div>

        {/* Rạp */}
        <div>
          <select
            name="theaterId"
            value={form.theaterId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Chọn rạp --</option>
            {theaters.map((rap) => (
              <option key={rap.id} value={rap.id}>
                {rap.ten_rap} - {rap.ten_dia_diem}
              </option>
            ))}
          </select>
          {errors.theaterId && (
            <p className="text-red-500 text-sm mt-2">{errors.theaterId}</p>
          )}
        </div>

        {/* Ngày chiếu */}
        <div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-2">{errors.date}</p>
          )}
        </div>

        {/* Giờ chiếu */}
        <div>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-2">{errors.time}</p>
          )}
        </div>

        {/* Định dạng */}
        <div>
          <select
            name="formatId"
            value={form.formatId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Chọn định dạng --</option>
            {formats.map((format) => (
              <option key={format.id} value={format.id}>
                {format.ten_dinh_dang}
              </option>
            ))}
          </select>
          {errors.formatId && (
            <p className="text-red-500 text-sm mt-2">{errors.formatId}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Đang thêm..." : "Thêm suất chiếu"}
      </button>
    </form>
  );
};

export default AddShowtimeForm;

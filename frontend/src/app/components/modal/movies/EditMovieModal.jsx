"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../Modal";

import { movieGenres, movieCountries } from "@/utils/movieData";
import { formatDate } from "@/utils/dateUtils";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditMovieModal({ movieId }) {
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    description: "",
    genres: [],
    country: "",
    releaseDate: "",
  });

  const originalMovie = useRef(null);

  const [errors, setErrors] = useState({}); // Lưu lỗi của từng trường

  const router = useRouter();

  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/${movieId}`
        );
        const { data } = await res.json();
        const extractedData = {
          title: data.ten_phim,
          imageUrl: data.anh_phim,
          description: data.mo_ta,
          genres: data.the_loai.split(","),
          country: data.quoc_gia,
          releaseDate: formatDate(data.ngay_khoi_chieu, "yyyy-MM-dd"),
        };
        setForm({ ...extractedData });
        originalMovie.current = { ...extractedData };
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (genre) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleEditMovie = async (e) => {
    e.preventDefault();

    if (JSON.stringify(form) === JSON.stringify(originalMovie.current)) {
      router.back();
      toast.info("Không có giá trị cần chỉnh sửa.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/${movieId}`,
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
          `/admin/movies?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
        toast.success("Cập nhật thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request cập nhật phim:", error);
    }
  };

  return (
    <Modal title="Chỉnh sửa thông tin phim">
      <form onSubmit={handleEditMovie} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Tên phim"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="URL ảnh phim"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <div>
          <p className="mb-2 font-bold">Thể loại:</p>
          <div className="flex flex-wrap gap-2">
            {movieGenres.map((genre) => (
              <label key={genre} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.genres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-bold">Quốc gia:</p>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn quốc gia</option>
            {movieCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <input
          type="date"
          name="releaseDate"
          value={form.releaseDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
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

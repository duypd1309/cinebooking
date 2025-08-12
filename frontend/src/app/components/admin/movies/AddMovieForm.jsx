"use client";

import { useState } from "react";

import { movieGenres, movieCountries } from "@/utils/movieData";

import { toast } from "react-toastify";

const AddMovieForm = ({ onAddMovie }) => {
  const [newMovie, setNewMovie] = useState({
    title: "",
    imageUrl: "",
    description: "",
    genres: [],
    country: "",
    releaseDate: "",
  });

  const [errors, setErrors] = useState({}); // Lưu lỗi của từng trường

  const handleAddMovie = async () => {
    let newErrors = {};

    // Kiểm tra dữ liệu nhập vào
    if (!newMovie.title.trim()) newErrors.title = "Vui lòng nhập tên phim!";
    if (!newMovie.imageUrl.trim())
      newErrors.imageUrl = "Vui lòng nhập URL ảnh phim!";
    if (!newMovie.description.trim())
      newErrors.description = "Vui lòng nhập mô tả phim!";
    if (!newMovie.genres.length)
      newErrors.genres = "Vui lòng chọn ít nhất một thể loại!";
    if (!newMovie.country.trim()) newErrors.country = "Vui lòng nhập quốc gia!";
    if (!newMovie.releaseDate)
      newErrors.releaseDate = "Vui lòng chọn ngày khởi chiếu!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Cập nhật lỗi vào state
      return;
    }

    // Nếu không có lỗi, tiến hành gửi request
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMovie),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Thêm phim thành công!");
        onAddMovie?.();
        setNewMovie({
          title: "",
          imageUrl: "",
          description: "",
          genres: [],
          country: "",
          releaseDate: "",
        }); // Reset form
        setErrors({}); // Reset lỗi
      } else {
        toast.error(result.message || "Lỗi khi thêm phim!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">Thêm phim mới</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Tên phim */}
        <div>
          <input
            type="text"
            placeholder="Nhập tên phim"
            className="w-full p-2 border border-gray-300 rounded"
            value={newMovie.title}
            onChange={(e) => {
              setNewMovie({ ...newMovie, title: e.target.value });
              setErrors({ ...errors, title: "" }); // Xóa lỗi khi nhập lại
            }}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-2">{errors.title}</p>
          )}
        </div>

        {/* Ảnh phim */}
        <div>
          <input
            type="text"
            placeholder="Nhập URL ảnh phim"
            className="w-full p-2 border border-gray-300 rounded"
            value={newMovie.imageUrl}
            onChange={(e) => {
              setNewMovie({ ...newMovie, imageUrl: e.target.value });
              setErrors({ ...errors, imageUrl: "" });
            }}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm mt-2">{errors.imageUrl}</p>
          )}
        </div>

        {/* Mô tả phim */}
        <div className="col-span-2">
          <textarea
            placeholder="Nhập mô tả phim"
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            value={newMovie.description}
            onChange={(e) => {
              setNewMovie({ ...newMovie, description: e.target.value });
              setErrors({ ...errors, description: "" });
            }}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-2">{errors.description}</p>
          )}
        </div>

        {/* Thể loại */}
        <div>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            multiple
            value={newMovie.genres}
            onChange={(e) => {
              setNewMovie({
                ...newMovie,
                genres: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              });
              setErrors({ ...errors, genres: "" });
            }}
          >
            <option value="" disabled>
              Chọn thể loại
            </option>
            {movieGenres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.genres && (
            <p className="text-red-500 text-sm mt-2">{errors.genres}</p>
          )}
        </div>

        {/* Quốc gia */}
        <div>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={newMovie.country}
            onChange={(e) => {
              setNewMovie({ ...newMovie, country: e.target.value });
              setErrors({ ...errors, country: "" });
            }}
          >
            <option value="" disabled>
              Chọn quốc gia
            </option>
            {movieCountries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors && (
            <p className="text-red-500 text-sm mt-2">{errors.country}</p>
          )}
        </div>

        {/* Ngày khởi chiếu */}
        <div>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={newMovie.releaseDate}
            onChange={(e) => {
              setNewMovie({ ...newMovie, releaseDate: e.target.value });
              setErrors({ ...errors, releaseDate: "" });
            }}
          />
          {errors && (
            <p className="text-red-500 text-sm mt-2">{errors.releaseDate}</p>
          )}
        </div>
      </div>
      <button
        onClick={handleAddMovie}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Thêm phim
      </button>
    </div>
  );
};

export default AddMovieForm;

"use client";

import Link from "next/link";

import { formatDate } from "@/utils/dateUtils";

import Pagination from "../../Pagination";

const MovieList = ({
  movies,
  currentPage,
  onPageChange,
  totalPages,
  search,
  onSearchChange,
}) => {
  const getMovieStatus = (date) => {
    const today = new Date(); // Lấy ngày hiện tại
    const releaseDate = new Date(date); // Chuyển đổi ngày khởi chiếu
    return releaseDate <= today ? "Đang chiếu" : "Sắp chiếu";
  };

  return (
    <>
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Danh sách phim</h3>
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            className="border border-gray-400 px-3 py-1 rounded-md w-64"
            defaultValue={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border border-gray-300">Hình ảnh</th>
              <th className="py-2 px-4 border border-gray-300">Tên phim</th>
              <th className="py-2 px-4 border border-gray-300">Mô tả</th>
              <th className="py-2 px-4 border border-gray-300">Thể loại</th>
              <th className="py-2 px-4 border border-gray-300">Quốc gia</th>
              <th className="py-2 px-4 border border-gray-300">
                Ngày khởi chiếu
              </th>
              <th className="py-2 px-4 border border-gray-300">Trạng thái</th>
              <th className="py-2 px-4 border border-gray-300">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td className="py-2 px-4 border border-gray-300">
                  <img
                    src={movie.anh_phim}
                    alt={movie.ten_phim}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center">
                  {movie.ten_phim}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {movie.mo_ta && movie.mo_ta.length > 30
                    ? movie.mo_ta.slice(0, 30) + "..."
                    : movie.mo_ta}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center">
                  {movie.the_loai.split(",").join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center whitespace-nowrap">
                  {movie.quoc_gia}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center whitespace-nowrap">
                  {formatDate(movie.ngay_khoi_chieu)}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center whitespace-nowrap">
                  {getMovieStatus(movie.ngay_khoi_chieu)}
                </td>
                <td className=" px-4 py-2 border border-gray-300">
                  <div className="flex gap-4 justify-center items-center">
                    <Link
                      href={`/admin/movies/edit/${movie.id}?page=${currentPage}`}
                      scroll={false}
                      className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-md"
                    >
                      Chỉnh sửa
                    </Link>
                    <Link
                      href={`/admin/movies/delete/${movie.id}?page=${currentPage}`}
                      scroll={false}
                      className="inline-block bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Xóa
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default MovieList;

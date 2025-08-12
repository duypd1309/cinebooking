import { formatDate } from "@/utils/dateUtils";
import Pagination from "../../Pagination";
import Link from "next/link";

const ShowtimeList = ({
  showtimes,
  currentPage,
  onPageChange,
  totalPages,
  search,
  onSearchChange,
}) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Danh sách suất chiếu</h3>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên phim hoặc giờ chiếu..."
          className="border border-gray-400 px-3 py-1 rounded-md w-80"
          defaultValue={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      {showtimes.map((item) => (
        <div key={item.id} className="border mb-4 p-4 rounded shadow">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={item.anh_phim}
              alt={item.ten_phim}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h4 className="text-lg font-bold">{item.ten_phim}</h4>
              <p className="text-sm text-gray-600">
                Ngày chiếu: {formatDate(item.ngay_chieu)}
              </p>
              <p className="text-sm text-gray-600">
                Rạp: {item.ten_rap} - {item.ten_dia_diem}
              </p>
            </div>
          </div>
          <div className="pl-28">
            <p className="text-sm text-gray-700">
              Giờ chiếu: <strong>{item.gio_chieu}</strong> | Định dạng:{" "}
              <strong>{item.ten_dinh_dang}</strong> | Giá vé:{" "}
              <strong>{item.gia_ve.toLocaleString()}đ</strong>
            </p>
            <div className="mt-2">
              <Link
                href={`/admin/showtimes/edit/${item.id}?page=${currentPage}`}
                scroll={false}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              >
                Chỉnh sửa
              </Link>
              <Link
                href={`/admin/showtimes/delete/${item.id}?page=${currentPage}`}
                scroll={false}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Xóa
              </Link>
            </div>
          </div>
        </div>
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ShowtimeList;

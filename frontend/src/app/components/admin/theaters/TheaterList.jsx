import Pagination from "../../Pagination";
import Link from "next/link";

const TheaterList = ({
  theaters,
  currentPage,
  onPageChange,
  totalPages,
  search,
  onSearchChange,
}) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Danh sách rạp chiếu</h3>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên rạp..."
          className="border border-gray-400 px-3 py-1 rounded-md w-80"
          defaultValue={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      {theaters.map((theater) => (
        <div key={theater.id} className="border mb-4 p-4 rounded shadow">
          <p className="text-lg font-bold">{theater.ten_rap}</p>
          <p className="text-gray-600 text-sm">
            Địa điểm: {theater.ten_dia_diem}
          </p>
          <div className="mt-2">
            <Link
              href={`/admin/theaters/edit/${theater.id}?page=${currentPage}`}
              scroll={false}
              className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
            >
              Chỉnh sửa
            </Link>
            <Link
              href={`/admin/theaters/delete/${theater.id}?page=${currentPage}`}
              scroll={false}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Xóa
            </Link>
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

export default TheaterList;

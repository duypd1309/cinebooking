import Link from "next/link";

import Pagination from "../../Pagination";

const UserList = ({
  users,
  currentPage,
  onPageChange,
  totalPages,
  search,
  onSearchChange,
}) => {
  return (
    <>
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Danh sách người dùng</h3>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="border border-gray-400 px-3 py-1 rounded-md w-64"
            defaultValue={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <table className="w-full border border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border border-gray-300">ID</th>
              <th className="py-2 px-4 border border-gray-300">Tên</th>
              <th className="py-2 px-4 border border-gray-300">Email</th>
              <th className="py-2 px-4 border border-gray-300">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border border-gray-300 text-center">
                  {user.id}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center">
                  {user.name}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center">
                  {user.email}
                </td>
                <td className=" px-4 py-2 border border-gray-300">
                  <div className="flex gap-4 justify-center items-center">
                    <Link
                      href={`/admin/users/edit/${user.id}?page=${currentPage}`}
                      scroll={false}
                      className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-md whitespace-nowrap"
                    >
                      Chỉnh sửa
                    </Link>

                    <Link
                      href={`/admin/users/delete/${user.id}?page=${currentPage}`}
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

      {/* Phân Trang */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default UserList;

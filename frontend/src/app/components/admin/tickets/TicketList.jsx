"use client";

import { useRouter } from "next/navigation";
import Pagination from "../../Pagination";
import TicketItem from "../../tickets/TicketItem";

const TicketList = ({
  tickets,
  currentPage,
  onPageChange,
  totalPages,
  search,
  onSearchChange,
}) => {
  const router = useRouter();

  const handleDelete = (ticketId) => {
    router.push(`/admin/tickets/delete/${ticketId}?page=${currentPage}`);
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Danh sách vé đã đặt</h3>
        <input
          type="text"
          placeholder="Tìm kiếm theo email hoặc tên phim..."
          className="border border-gray-400 px-3 py-1 rounded-md w-80"
          defaultValue={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {tickets.length === 0 ? (
        <p>Không có vé nào.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id}>
              {/* Thông tin user */}
              <div className="mb-2 text-sm bg-gray-400 text-gray-900 px-2 py-1 rounded-md">
                <span className="font-semibold">Người đặt: </span>
                <span className="font-medium ">
                  {ticket.userName || "Không tên"}
                </span>{" "}
                ({ticket.userEmail}) -
                {ticket.userRole === 0 ? " Admin" : " User"}
              </div>
              <TicketItem ticket={ticket} onCancel={handleDelete} />
            </div>
          ))}
        </div>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default TicketList;

"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Pagination from "@/app/components/Pagination";
import TicketItem from "@/app/components/tickets/TicketItem";
import { toast } from "react-toastify";

const BookedTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  const fetchTickets = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets?page=${page}&limit=${limit}`,
        { credentials: "include" }
      );
      const result = await res.json();
      if (result.success) {
        setTickets(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchParams.get("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    fetchTickets(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCancel = async (id) => {
    if (!confirm("Bạn có chắc muốn hủy vé này?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();
      if (result.success) {
        toast.success("Đã hủy vé.");
        fetchTickets(currentPage); // Refresh danh sách
      } else {
        alert(result.message || "Không thể hủy vé.");
      }
    } catch (err) {
      console.error("Lỗi khi hủy vé:", err);
      toast.error("Có lỗi xảy ra.");
    }
  };

  return (
    <div className="mt-[92px] max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Vé đã đặt</h1>
      {loading ? (
        <LoadingSpinner />
      ) : tickets.length === 0 ? (
        <p>Không có vé nào.</p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <TicketItem
              key={ticket.id}
              ticket={ticket}
              onCancel={handleCancel}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BookedTicketsPage;

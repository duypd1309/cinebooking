"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import TicketList from "@/app/components/admin/tickets/TicketList";

export default function TicketManagementPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  const searchTerm = useMemo(
    () => searchParams.get("search") || "",
    [searchParams]
  );

  const refreshKey = useMemo(
    () => searchParams.get("refresh") || "",
    [searchParams]
  );

  const fetchTickets = async (page = 1, search = "") => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/tickets/all?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        { credentials: "include" }
      );
      const result = await res.json();
      if (result.success) {
        setTickets(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  // Redirect nếu thiếu ?page
  useEffect(() => {
    if (!searchParams.get("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  // Fetch khi page/search/refresh thay đổi
  useEffect(() => {
    fetchTickets(currentPage, searchTerm);
  }, [currentPage, searchTerm, refreshKey]);

  // Chuyển trang
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Tìm kiếm
  const handleSearchChange = useDebouncedCallback((value) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 500);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Quản lý đặt vé</h2>
      <p className="mb-6">Xem và xóa các đơn đặt vé.</p>
      <TicketList
        tickets={tickets}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        search={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}

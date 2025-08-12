"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import ShowtimeList from "@/app/components/admin/showtimes/ShowtimeList";
import AddShowtimeForm from "@/app/components/admin/showtimes/AddShowtimeForm";

export default function ShowtimeManagementPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showtimes, setShowtimes] = useState([]);
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

  const fetchShowtimes = async (page = 1, search = "") => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/showtimes/all?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`
      );
      const result = await res.json();
      if (result.success) {
        setShowtimes(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };

  // useEffect 1: Redirect nếu thiếu ?page
  useEffect(() => {
    if (!searchParams.get("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  // useEffect 2: Fetch showtimes khi page hoặc search thay đổi
  useEffect(() => {
    fetchShowtimes(currentPage, searchTerm);
  }, [currentPage, searchTerm, refreshKey]);

  // Thay đổi trang qua URL
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Thay đổi ô tìm kiếm
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

  const handleAddShowtime = () => {
    fetchShowtimes(1);
    handlePageChange(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Quản lý suất chiếu</h2>
      <p className="mb-6">
        Hiển thị tất cả các suất chiếu theo từng phim, rạp, ngày chiếu.
      </p>
      <AddShowtimeForm onAddShowtime={handleAddShowtime} />
      <ShowtimeList
        showtimes={showtimes}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        search={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}

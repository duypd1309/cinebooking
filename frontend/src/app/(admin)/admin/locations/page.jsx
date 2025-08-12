"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import LocationList from "@/app/components/admin/locations/LocationList";
import AddLocationForm from "@/app/components/admin/locations/AddLocationForm";

export default function LocationManagementPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [locations, setLocations] = useState([]);
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

  const fetchLocations = async (page = 1, search = "") => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/locations/all?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`
      );
      const result = await res.json();
      if (result.success) {
        setLocations(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
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
    fetchLocations(currentPage, searchTerm);
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

  const handleAddLocation = () => {
    fetchLocations(1);
    handlePageChange(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Quản lý địa điểm</h2>
      <p className="mb-6">Thêm, sửa, xóa các địa điểm chiếu phim.</p>
      <AddLocationForm onAddLocation={handleAddLocation} />
      <LocationList
        locations={locations}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        search={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}

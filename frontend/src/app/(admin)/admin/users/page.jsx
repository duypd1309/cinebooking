"use client";

import { useState, useEffect, useMemo } from "react";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { useDebouncedCallback } from "use-debounce";

import AddUserForm from "@/app/components/admin/users/AddUserForm";
import UserList from "@/app/components/admin/users/UserList";

export default function UserManagementPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 3; // Số user mỗi trang

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

  const fetchUsers = async (page = 1, search = "") => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/users?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Lỗi khi lấy danh sách người dùng");

      const data = await res.json();
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi fetch người dùng:", error);
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

  // useEffect 2: Fetch users khi page hoặc search thay đổi
  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
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
    params.set("page", "1"); // reset về trang 1 khi search
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 500);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4">Quản lý Người Dùng</h2>
      <p className="mb-6">
        Tại đây, bạn có thể quản lý người dùng trên nền tảng.
      </p>
      <AddUserForm fetchUsers={fetchUsers} onPageChange={handlePageChange} />
      <UserList
        users={users}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        search={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}

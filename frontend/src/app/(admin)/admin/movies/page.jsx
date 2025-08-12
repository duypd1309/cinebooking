"use client";

import { useState, useEffect, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebouncedCallback } from "use-debounce";

import AddMovieForm from "@/app/components/admin/movies/AddMovieForm";
import AdminMovieList from "@/app/components/admin/movies/MovieList";

export default function MovieManagementPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movies, setMovies] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 5; // Số movie mỗi trang

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

  const fetchMovies = async (page = 1, search = "") => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/movies/all?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`
      );
      const result = await res.json();
      if (result.success) {
        setMovies(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
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

  // useEffect 2: Fetch movies khi page hoặc search thay đổi
  useEffect(() => {
    fetchMovies(currentPage, searchTerm);
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

  const handleAddMovie = () => {
    fetchMovies(1);
    handlePageChange(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Quản lý phim</h2>
      <p className="mb-6">Tại đây, bạn có thể quản lý phim trên nền tảng.</p>
      <AddMovieForm onAddMovie={handleAddMovie} />
      <AdminMovieList
        movies={movies}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        search={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}

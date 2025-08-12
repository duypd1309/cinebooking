"use client";

import { useState, useEffect, useMemo } from "react";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { useDebouncedCallback } from "use-debounce";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import UserMovieList from "@/app/components/movies/MovieList";

const MovieListPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Số movie mỗi trang

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  const searchTerm = useMemo(
    () => searchParams.get("search") || "",
    [searchParams]
  );

  const fetchMovies = async (page = 1, search = "") => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
  }, [currentPage, searchTerm]);

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
    <div className="mt-[92px] max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Danh sách phim</h1>
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          className="bg-gray-900 text-white placeholder-gray-400 border border-gray-600 px-3 py-1 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          defaultValue={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <UserMovieList
          movies={movies}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default MovieListPage;

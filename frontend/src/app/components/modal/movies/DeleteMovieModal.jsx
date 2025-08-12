"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import Modal from "../Modal";

export default function DeleteMovieModal({ movieId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movies/${movieId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        router.replace(
          `/admin/movies?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
        toast.success(result.message || "Xóa phim thành công!");
      } else {
        toast.error(result.message || "Xóa phim thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      toast.error("Lỗi server khi xóa phim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Xác nhận xóa phim">
      <p>Bạn có chắc muốn xóa phim không?</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => router.back()}
          className="mr-2 px-4 py-2 bg-gray-300 rounded"
        >
          Hủy
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </Modal>
  );
}

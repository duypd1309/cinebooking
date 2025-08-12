"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Modal from "../Modal";

export default function DeleteTheaterModal({ theaterId }) {
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/theaters/${theaterId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        router.replace(
          `/admin/theaters?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
        toast.success("Xóa rạp chiếu thành công!");
      } else {
        // Ưu tiên hiển thị message từ backend (ví dụ: rạp có lịch chiếu nên không thể xóa)
        toast.error(result.message || "Xóa rạp chiếu thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa rạp chiếu:", error);
      toast.error("Lỗi server khi xóa rạp chiếu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Xác nhận xóa rạp chiếu">
      <p>Bạn có chắc muốn xóa rạp chiếu này không?</p>
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

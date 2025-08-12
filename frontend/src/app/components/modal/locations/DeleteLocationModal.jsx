"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import Modal from "../Modal";

export default function DeleteLocationModal({ locationId }) {
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/${locationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        router.replace(
          `/admin/locations?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
        toast.success("Xóa địa điểm thành công!");
      } else {
        toast.error(result.message || "Xóa địa điểm thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa địa điểm:", error);
      toast.error("Lỗi server khi xóa địa điểm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Xác nhận xóa địa điểm">
      <p>Bạn có chắc muốn xóa địa điểm này không?</p>
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

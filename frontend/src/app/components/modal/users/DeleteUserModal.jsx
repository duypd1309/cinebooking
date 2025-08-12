"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import Modal from "../Modal";

export default function DeleteUserModal({ userId }) {
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Xóa người dùng thành công!");
        router.replace(
          `/admin/users?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
      } else {
        toast.error(data.message || "Xóa người dùng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      toast.error("Đã xảy ra lỗi khi xóa người dùng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Xác nhận xóa người dùng">
      <p>Bạn có chắc muốn xóa người dùng này không?</p>
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

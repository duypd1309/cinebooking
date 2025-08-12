"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditLocationModal({ locationId }) {
  const [form, setForm] = useState({
    name: "",
  });

  const originalLocation = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/${locationId}`
        );
        const result = await res.json();

        if (!res.ok || !result.success) {
          toast.error(result.message || "Không thể tải dữ liệu địa điểm.");
          router.back();
          return;
        }

        const extractedData = {
          name: result.data.ten_dia_diem || "",
        };
        setForm({ ...extractedData });
        originalLocation.current = { ...extractedData };
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu địa điểm:", error);
        toast.error("Lỗi server khi tải dữ liệu địa điểm.");
        router.back();
      }
    };

    fetchLocation();
  }, [locationId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLocation = async (e) => {
    e.preventDefault();

    if (JSON.stringify(form) === JSON.stringify(originalLocation.current)) {
      router.back();
      toast.info("Không có giá trị cần chỉnh sửa.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/${locationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ten_dia_diem: form.name,
          }),
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        router.replace(
          `/admin/locations?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
        toast.success("Cập nhật địa điểm thành công!");
      } else {
        toast.error(result.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request cập nhật địa điểm:", error);
      toast.error("Lỗi server khi cập nhật địa điểm.");
    }
  };

  return (
    <Modal title="Chỉnh sửa địa điểm">
      <form onSubmit={handleEditLocation} className="space-y-4">
        {/* Tên địa điểm */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nhập tên địa điểm"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Lưu thông tin
        </button>
      </form>
    </Modal>
  );
}

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditTheaterModal({ theaterId }) {
  const [form, setForm] = useState({
    name: "",
    locationId: "",
  });

  const [locations, setLocations] = useState([]);
  const originalTheater = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  // Fetch theater data
  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/theaters/${theaterId}`
        );
        const result = await res.json();

        if (!res.ok || !result.success) {
          toast.error(result.message || "Không thể tải dữ liệu rạp chiếu.");
          router.back();
          return;
        }

        const extractedData = {
          name: result.data.ten_rap || "",
          locationId: result.data.id_dia_diem || "",
        };
        setForm({ ...extractedData });
        originalTheater.current = { ...extractedData };
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu rạp chiếu:", error);
        toast.error("Lỗi server khi tải dữ liệu rạp chiếu.");
        router.back();
      }
    };

    fetchTheater();
  }, [theaterId, router]);

  // Fetch list of locations for dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/all?limit=1000`
        );
        const result = await res.json();
        if (res.ok && result.success) {
          setLocations(result.data || []);
        } else {
          toast.error(result.message || "Không thể tải danh sách địa điểm.");
        }
      } catch (error) {
        console.error("Lỗi khi fetch địa điểm:", error);
        toast.error("Lỗi server khi tải danh sách địa điểm.");
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTheater = async (e) => {
    e.preventDefault();

    if (JSON.stringify(form) === JSON.stringify(originalTheater.current)) {
      router.back();
      toast.info("Không có giá trị cần chỉnh sửa.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/theaters/${theaterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ten_rap: form.name,
            id_dia_diem: form.locationId,
          }),
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        router.replace(
          `/admin/theaters?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
        toast.success("Cập nhật rạp chiếu thành công!");
      } else {
        toast.error(result.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request cập nhật rạp chiếu:", error);
      toast.error("Lỗi server khi cập nhật rạp chiếu.");
    }
  };

  return (
    <Modal title="Chỉnh sửa rạp chiếu">
      <form onSubmit={handleEditTheater} className="space-y-4">
        {/* Tên rạp */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nhập tên rạp chiếu"
          className="w-full p-2 border rounded"
          required
        />

        {/* Chọn địa điểm */}
        <select
          name="locationId"
          value={form.locationId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Chọn địa điểm --</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.ten_dia_diem}
            </option>
          ))}
        </select>

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

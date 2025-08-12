"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "../Modal";

export default function EditUserModal({ userId }) {
  const [form, setForm] = useState({
    email: "",
    ho_va_ten: "",
    role: 1, // 1: user
  });

  const originalUser = useRef(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams]
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`,
          {
            credentials: "include",
          }
        );
        const { data } = await res.json();
        const extracted = {
          email: data.email,
          ho_va_ten: data.ho_va_ten || "",
          role: data.role,
        };
        setForm(extracted);
        originalUser.current = extracted;
      } catch (err) {
        console.error("Lỗi lấy dữ liệu người dùng:", err);
        toast.error("Không thể tải dữ liệu người dùng.");
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "role" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (JSON.stringify(form) === JSON.stringify(originalUser.current)) {
      toast.info("Không có thay đổi nào.");
      router.back();
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Cập nhật thành công!");
        router.replace(
          `/admin/users?page=${currentPage}&refresh=${Date.now()}`,
          { scroll: false }
        );
      } else {
        toast.error(data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Lỗi gửi request:", err);
      toast.error("Lỗi khi cập nhật người dùng.");
    }
  };

  return (
    <Modal title="Chỉnh sửa thông tin người dùng">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="ho_va_ten"
          placeholder="Họ và tên"
          value={form.ho_va_ten}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <div>
          <label className="block mb-2 font-bold">Vai trò:</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value={1}>Người dùng</option>
            <option value={0}>Quản trị viên</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Lưu thay đổi
        </button>
      </form>
    </Modal>
  );
}

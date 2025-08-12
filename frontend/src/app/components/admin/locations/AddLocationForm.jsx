"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const AddLocationForm = ({ onAddLocation }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Vui lòng nhập tên địa điểm!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ten_dia_diem: name }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Thêm địa điểm thành công!");
      setName("");
      setError("");
      onAddLocation?.();
    } catch (error) {
      toast.error(error.message || "Thêm địa điểm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow-md rounded-md mb-6"
    >
      <h3 className="text-lg font-semibold mb-3">Thêm địa điểm mới</h3>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Nhập tên địa điểm..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Đang thêm..." : "Thêm"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default AddLocationForm;

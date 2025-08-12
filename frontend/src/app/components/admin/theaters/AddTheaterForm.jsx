"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddTheaterForm = ({ onAddTheater }) => {
  const [name, setName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy danh sách địa điểm để chọn
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/all?page=1&limit=100`
        );
        const data = await res.json();
        if (data.success) {
          setLocations(data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!locationId) {
      setError("Vui lòng chọn địa điểm!");
      return;
    }
    if (!name.trim()) {
      setError("Vui lòng nhập tên rạp!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/theaters`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ten_rap: name,
            id_dia_diem: locationId,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Thêm rạp thành công!");
      setName("");
      setLocationId("");
      setError("");
      onAddTheater?.();
    } catch (error) {
      toast.error(error.message || "Thêm rạp thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow-md rounded-md mb-6"
    >
      <h3 className="text-lg font-semibold mb-3">Thêm rạp mới</h3>
      <div className="flex gap-3 mb-3">
        <select
          value={locationId}
          onChange={(e) => {
            setLocationId(e.target.value);
            setError("");
          }}
          className="p-2 border border-gray-300 rounded flex-1"
        >
          <option value="">-- Chọn địa điểm --</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.ten_dia_diem}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nhập tên rạp..."
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

export default AddTheaterForm;

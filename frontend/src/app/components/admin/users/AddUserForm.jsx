"use client";

import { useState } from "react";

import { toast } from "react-toastify";

const AddUserForm = ({ fetchUsers, onPageChange }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: 1,
  });

  // Hàm thêm người dùng
  const handleAddUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Thêm người dùng thất bại!");
        return;
      }

      setNewUser({ name: "", email: "", password: "", role: 1 }); // reset form
      onPageChange(1);
      fetchUsers(1);
      toast.success("Thêm người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      toast.error("Đã xảy ra lỗi khi thêm người dùng!");
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">Thêm Người Dùng Mới</h3>

      <div className="flex flex-col space-y-4 mb-4">
        <input
          type="text"
          placeholder="Nhập tên"
          className="p-2 border border-gray-300 rounded"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Nhập email"
          className="p-2 border border-gray-300 rounded"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="p-2 border border-gray-300 rounded"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          className="p-2 border border-gray-300 rounded"
          value={newUser.role}
          onChange={(e) =>
            setNewUser({ ...newUser, role: parseInt(e.target.value) })
          }
        >
          <option value={1}>Người dùng</option>
          <option value={0}>Quản trị viên</option>
        </select>
      </div>

      <button
        onClick={handleAddUser}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Thêm Người Dùng
      </button>
    </div>
  );
};

export default AddUserForm;

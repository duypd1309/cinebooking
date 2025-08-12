"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    ho_va_ten: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    // Lấy thông tin user hiện tại
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi lấy thông tin người dùng");
        }
        return res.json();
      })
      .then((data) => {
        setProfile({
          ho_va_ten: data.ho_va_ten || "",
          email: data.email || "",
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChangeProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(profile),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi cập nhật hồ sơ");

      toast.success("Cập nhật hồ sơ thành công!");
      setProfileMessage(null); // xóa message cũ
    } catch (err) {
      setProfileMessage({ type: "error", text: err.message });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMessage({
        type: "error",
        text: "Mật khẩu xác nhận không khớp!",
      });
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi đổi mật khẩu");

      toast.success("Đổi mật khẩu thành công!");
      setPasswordMessage(null);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="mt-[92px] max-w-xl mx-auto p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Hồ sơ cá nhân</h2>

      {profileMessage && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {profileMessage.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Họ và tên</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-orange-500"
            value={profile.ho_va_ten}
            onChange={(e) =>
              setProfile({ ...profile, ho_va_ten: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-orange-500"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <button
          onClick={handleChangeProfile}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Lưu thay đổi
        </button>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Đổi mật khẩu</h3>

      {passwordMessage && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {passwordMessage.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-orange-500"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, oldPassword: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block font-medium">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-orange-500"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block font-medium">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-orange-500"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Để cookie JWT được gửi
          body: JSON.stringify({ email, password, fullName }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Đăng ký thành công!");
        router.push("/login"); // Chuyển hướng đến trang đăng nhập
      } else {
        toast.error(data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background hiệu ứng */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-red-500 to-transparent blur-[150px] opacity-30"></div>
          <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-gradient-radial from-blue-500 to-transparent blur-[200px] opacity-30"></div>
        </div>

        {/* Nội dung chính */}
        <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-80 rounded-lg shadow-xl border border-gray-700 p-8 text-white">
          <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400 hover:text-red-500 transition duration-300">
            🎬 Đăng ký tài khoản
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Khám phá thế giới phim ảnh đầy kỳ diệu!
          </p>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition duration-300 shadow-lg transform hover:-translate-y-1 hover:scale-105"
            >
              Đăng ký
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Bạn đã có tài khoản?{" "}
              <a href="/login" className="text-yellow-400 hover:underline">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>

        {/* Hiệu ứng overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-black opacity-30 pointer-events-none"></div>
      </div>
    </>
  );
}

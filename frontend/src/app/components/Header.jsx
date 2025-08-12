"use client";

import { FaUser, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleUserClick = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include", // Gửi kèm cookie trong request
        }
      );

      if (res.ok) {
        setUser(null);
        setDropdownOpen(false); // Đóng dropdown khi đăng xuất
        router.push("/"); // Chuyển hướng về trang chủ
        toast.success("Đăng xuất thành công!"); // Thông báo đăng xuất thành công
      } else {
        toast.error("Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  // Check login status khi component lần đầu tiên mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include", // Gửi kèm cookie
          }
        );

        const data = await res.json(); // API luôn trả về JSON hợp lệ

        setUser(data); // `data` sẽ là object hoặc null dựa vào API response
      } catch (error) {
        console.error("Lỗi khi kiểm tra đăng nhập:", error);
        setUser(null);
      }
    };

    checkLoginStatus();
  }, [setUser]);

  return (
    <header className="bg-black text-white fixed top-0 left-0 w-full z-50 shadow-lg px-14 border-b-2 border-gray-600">
      <div className="container mx-auto flex justify-between items-center py-8 px-6">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          <span className="font-bold text-lg">cinebooking</span>
        </div>

        {/* Hamburger Icon (mobile) */}
        <div className="lg:hidden flex items-center">
          <FaBars className="text-white cursor-pointer" onClick={toggleMenu} />
        </div>

        {/* Navigation */}
        <nav
          className={`lg:flex items-center space-x-6 ${
            isMenuOpen ? "flex" : "hidden"
          } lg:block`}
        >
          <Link href="/" className="hover:text-orange-500">
            Trang chủ
          </Link>
          {user ? null : (
            <>
              <Link href="/login" className="hover:text-orange-500">
                Đăng nhập
              </Link>
              <Link href="/register" className="hover:text-orange-500">
                Đăng ký
              </Link>
            </>
          )}
          <Link href="/movies" className="hover:text-orange-500">
            Danh sách phim
          </Link>
          {user && (
            <Link href="/tickets" className="hover:text-orange-500">
              Vé đã đặt
            </Link>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Icon User */}
          {user && (
            <div className="relative">
              <FaUser
                className="text-white cursor-pointer hover:text-orange-500"
                onClick={handleUserClick}
              />

              {dropdownOpen && (
                <div className="absolute right-0 top-10 bg-gray-900 text-white rounded-lg shadow-lg w-40 p-2">
                  <p className="text-sm text-gray-400 mb-2">
                    {/* Hiển thị email người dùng hoặc 'Guest' */}
                    {user.email}
                  </p>
                  <ul>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="hover:underline hover:text-cyan-500 mb-2 cursor-pointer"
                    >
                      Hồ sơ
                    </Link>
                    <li
                      onClick={handleLogout}
                      className="hover:underline hover:text-red-500 cursor-pointer"
                    >
                      Đăng xuất
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

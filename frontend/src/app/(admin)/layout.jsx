import Link from "next/link";
import "../globals.css";

export const metadata = {
  title: "Admin Layout",
  description: "Admin-site layout",
};

export default function AdminLayout({ children }) {
  return (
    <>
      <div className="bg-gray-100 text-gray-900 antialiased">
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white">
            <div className="p-6">
              {/* Sidebar Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-center">
                  <Link href="/admin">Admin Dashboard</Link>
                </h2>
              </div>

              {/* Navigation */}
              <nav className="space-y-4">
                {/* Dashboard */}
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  🏠 Dashboard
                </Link>
                {/* Quản lý người dùng */}
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  👤 Quản lý người dùng
                </Link>
                {/* Quản lý phim */}
                <Link
                  href="/admin/locations"
                  className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  📍 Quản lý địa điểm
                </Link>
                <Link
                  href="/admin/theaters"
                  className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  🎥 Quản lý rạp
                </Link>
                <Link
                  href="/admin/movies"
                  className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  🎬 Quản lý phim
                </Link>
                <Link
                  href="/admin/showtimes"
                  className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  🕒 Quản lý suất chiếu
                </Link>
                {/* Quản lý vé đặt */}
                <Link
                  href="/admin/tickets"
                  className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  🎟️ Quản lý vé đặt
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-white shadow-lg rounded-lg mx-6 mt-6">
            <section>{children}</section>
          </main>
        </div>
      </div>
    </>
  );
}

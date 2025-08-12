export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-6">
        <h1 className="text-4xl font-bold text-gray-800">🏠 Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Quản lý và thống kê doanh thu phim</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Tổng số phim */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Tổng số phim
            </h3>
            <p className="text-3xl font-bold text-indigo-500 mt-2">128</p>
          </div>

          {/* Tổng doanh thu */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Tổng doanh thu
            </h3>
            <p className="text-3xl font-bold text-green-500 mt-2">$256,340</p>
          </div>

          {/* Vé bán được */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">Vé đã bán</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">12,345</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Thống kê doanh thu
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Doanh thu theo từng tháng
          </p>
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded">
            <img
              src="https://gitiho.com/caches/p_medium_large//images/article/photos/66/Excel/image_column-chart.jpg"
              alt="Biểu đồ doanh thu"
              className="h-full w-full object-cover rounded"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

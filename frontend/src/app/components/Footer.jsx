import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 border-t border-gray-700">
      <div className="container mx-auto px-6 md:px-10 ">
        {/* Top Section */}
        <div className="flex flex-wrap  items-start gap-6 ml-8">
          {/* Left Section */}
          <div className="w-full lg:w-1/3 px-4">
            <h2 className="text-2xl font-bold mb-4">cinebooking</h2>
            <p className="mb-4 leading-relaxed">
              Trang web đặt vé xem phim trực tuyến, giúp bạn dễ dàng tìm kiếm và
              đặt vé cho các bộ phim yêu thích tại các rạp gần nhất.
            </p>
          </div>

          {/* Center Section */}
          <div className="flex justify-end w-full lg:w-1/3 px-4">
            {/* Links */}
            <div>
              <h3 className="text-orange-500 font-bold mb-4">Links</h3>
              <ul className="flex flex-col gap-2 text-sm">
                <Link href="#" className="hover:underline">
                  Về chúng tôi
                </Link>
                <Link href="/profile" className="hover:underline">
                  Tài khoản
                </Link>
                <Link href="/movies" className="hover:underline">
                  Danh sách phim
                </Link>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
          <p>© Copyright 2025. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

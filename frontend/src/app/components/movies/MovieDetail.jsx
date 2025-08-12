const MovieDetail = ({ movie, onScrollToBooking }) => {
  return (
    // Thông tin chi tiết phim
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-gray-800 to-black text-white flex items-center justify-center mt-20">
      <div className="container mx-auto flex flex-wrap lg:flex-nowrap gap-8 p-4 px-8">
        {/* Bên trái - Ảnh */}
        <div className="w-full lg:w-1/3">
          <img
            src={movie.anh_phim} // Dùng ảnh phim từ API
            alt="Movie Poster"
            width={400}
            height={600}
            className="rounded-md shadow-md"
          />
        </div>
        {/* Bên phải - Chi tiết */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <h1 className="text-4xl font-bold mb-4">{movie.ten_phim}</h1>{" "}
          {/* Tên phim từ API */}
          <p className="text-lg mb-2">
            <span className="font-semibold">Thể loại:</span>{" "}
            {movie.the_loai.replace(/,/g, ", ")}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Quốc gia:</span> {movie.quoc_gia}
          </p>
          <h2 className="text-lg font-semibold mb-2">Mô tả:</h2>
          <p className="mb-6">{movie.mo_ta}</p>
          {/* Nút Đặt vé */}
          <button
            onClick={onScrollToBooking}
            className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

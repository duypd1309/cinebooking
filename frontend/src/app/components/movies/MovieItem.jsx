import Link from "next/link";

import { formatDate } from "@/utils/dateUtils";

const MovieItem = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative">
        <img
          src={movie.anh_phim}
          alt={movie.ten_phim}
          className="w-full h-64 md:h-72 lg:h-80 object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mt-2 hover:text-orange-500 transition-colors duration-200 truncate">
          <Link href={`/movies/${movie.id}`}>{movie.ten_phim}</Link>
        </h3>
        <p className="text-gray-600 mt-2 truncate">
          {movie.the_loai.replace(/,/g, ", ")}
        </p>
        <p className="text-gray-600 mt-2">
          Khởi chiếu: {formatDate(movie.ngay_khoi_chieu, "dd-MM-yyyy")}
        </p>
        <Link
          href={`/movies/${movie.id}`}
          className="mt-4 px-4 py-2 w-full bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-900 block text-center"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default MovieItem;

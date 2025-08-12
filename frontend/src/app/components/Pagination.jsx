import { getPaginationRange } from "@/utils/pagination";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const paginationRange = getPaginationRange(totalPages, currentPage);
  return (
    <div className="flex justify-center mt-6 gap-2">
      {paginationRange.map((page, index) => (
        <button
          key={typeof page === "number" ? page : `ellipsis-${index}`} // 👈 key luôn duy nhất
          disabled={page === "..."}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-3 py-1 rounded-md text-md font-medium transition-colors duration-200 ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "bg-white text-black border border-gray-300 hover:bg-orange-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;

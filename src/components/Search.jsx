import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function SearchBox() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSearchBox = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="gap-4">
            {/* Nút Search */}
            <button
                onClick={toggleSearchBox}
                className="text-white rounded-full flex items-center gap-2 shadow-lg focus:outline-none transition"
            >
                <FaSearch size={24} />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-20 transition-opacity"
                    onClick={toggleSearchBox}
                ></div>
            )}

            {/* Hộp thoại tìm kiếm */}
            <div
                className={`fixed cursor-pointer top-0 h-full w-full sm:w-1/2 sm:left-1/4 z-20 rounded-b-lg shadow-lg transform ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                    } transition-transform duration-300`}
                onClick={toggleSearchBox}>
                <div className="p-6 opacity-1 mt-[150px]" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl font-semibold mb-4 text-white-500">
                        What are you looking for?
                    </h2>
                    <div className="flex items-center gap-3 text-black">
                        <input
                            type="text"
                            placeholder="Search something..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        <button
                            onClick={toggleSearchBox}
                            className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition">
                            Go
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchBox;

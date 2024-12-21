import { FaSearch } from 'react-icons/fa';

const News = () => {
    return (
        <div className="flex flex-wrap">
            {/* Left Column */}
            <div className="w-full md:w-2/3 p-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Article Title</h2>
                    <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/3 p-4">
                <div className="bg-orange-500 p-6 rounded-lg shadow-md mb-4">
                    <div className="flex items-center mb-4">
                        <div className="flex w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full p-2 rounded-l-md"
                            />
                            <button className="p-2 bg-white rounded-r-md">
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h3 className="text-xl font-bold mb-2">Latest Posts</h3>
                        <ul>
                            <li className="mb-2">Post 1</li>
                            <li className="mb-2">Post 2</li>
                            <li className="mb-2">Post 3</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h3 className="text-xl font-bold mb-2">Categories</h3>
                        <ul>
                            <li className="mb-2">Category 1</li>
                            <li className="mb-2">Category 2</li>
                            <li className="mb-2">Category 3</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-2">Tags</h3>
                        <div className="flex flex-wrap">
                            <span className="bg-gray-200 text-gray-700 p-2 rounded-lg m-1">Tag 1</span>
                            <span className="bg-gray-200 text-gray-700 p-2 rounded-lg m-1">Tag 2</span>
                            <span className="bg-gray-200 text-gray-700 p-2 rounded-lg m-1">Tag 3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
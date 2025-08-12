export default function FeedbackSection() {
    return (
      <div className="bg-gray-100 py-16 px-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            <h4 className="text-orange-500 font-semibold uppercase">
              Our Feedbacks
            </h4>
            <h2 className="text-4xl font-bold text-gray-800">
              What They're Talking About us?
            </h2>
            <p className="text-gray-600">
              Proin a lacus arcu. Nullam id dui eu orci maximus. Cras at auctor
              lectus, vel pretium tellus.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded shadow-md hover:bg-gray-800">
              View All Feedbacks
            </button>
          </div>
  
          {/* Right Content */}
          <div className="relative bg-white p-8 shadow-lg rounded-lg border border-gray-200">
            <p className="text-gray-600">
              Proin a lacus arcu nullam id dui eu orci maximus. Cras at auctor
              lectus, vel pretium tellus. Class aptent sociosqu ad litora
              torquent per conubia nostra.
            </p>
            <div className="flex items-center mt-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_B-gbW00IfCIGChlvt-KOr-j9dyL91KvR0Q&s"
                alt="Pacific D. Lee"
                className="w-12 h-12 rounded-full border-2 border-orange-500"
              />
              <div className="ml-4">
                <h5 className="font-semibold text-gray-800">Pacific D. Lee</h5>
                <p className="text-orange-500 text-sm">Customer</p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-orange-500 p-4 rounded-tl-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 12h-6l2 6-8-12h6l-2-6z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default function Home() {
    const cards = [
      {
        title: "SÂN KHẤU KỊCH",
        subtitle: "Tham gia Ngay",
        icon: "🎭", // Thay bằng hình ảnh thực tế nếu cần
      },
      {
        title: "BOOM TẤN",
        subtitle: "Xem ngay",
        icon: "⭐",
      },
      {
        title: "BÀI HÁT",
        subtitle: "thử thách ngay",
        icon: "🎤",
      },
    ];
  
    return (
      <div className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 relative gap-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`bg-black text-white rounded-lg shadow-lg p-6 flex flex-col items-center relative ${
                  index !== cards.length - 1 ? "md:border-r md:border-dashed md:border-black" : ""
                }`}
              >
                <div className="bg-orange-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-3xl">
                  {card.icon}
                </div>
                <p className="text-sm mt-4 uppercase text-gray-400">{card.subtitle}</p>
                <h3 className="text-2xl font-bold mt-2 text-center">{card.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
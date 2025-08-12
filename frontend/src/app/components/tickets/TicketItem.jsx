import { formatDate } from "@/utils/dateUtils";

const TicketItem = ({ ticket, onCancel }) => {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900 text-white">
      <div className="flex gap-4">
        <img
          src={ticket.movieImage}
          alt={ticket.movieTitle}
          className="w-24 h-36 object-cover rounded-md"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold">{ticket.movieTitle}</div>
          <div className="text-sm text-gray-300">
            <p>Rạp: {ticket.cinemaName}</p>
            <p>Ngày chiếu: {formatDate(ticket.showDate)}</p>
            <p>Giờ chiếu: {ticket.showTime.slice(0, 5)}</p>
            <p>Định dạng: {ticket.format}</p>
            <p>Ghế: {ticket.seats.join(", ")}</p>
            <p className="mt-2 text-orange-400 font-medium">
              Giá vé: {ticket.totalPrice.toLocaleString()}đ
            </p>
          </div>
        </div>
        {/* Nút hủy vé */}
        <div className="flex items-center">
          <button
            onClick={() => onCancel(ticket.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
          >
            Hủy vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketItem;

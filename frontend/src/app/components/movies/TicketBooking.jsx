"use client";

import { useState, useEffect, forwardRef } from "react";

import { formatDate } from "@/utils/dateUtils";

import { toast } from "react-toastify";

// Khởi tạo ghế
const ROWS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
];
const COLS = Array.from({ length: 10 }, (_, i) => i + 1);

const TicketBooking = forwardRef(({ schedules }, bookingRef) => {
  // Trạng thái cho các thông tin lịch chiếu và ghế
  const [locations, setLocations] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [dates, setDates] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);

  // Trạng thái cho giá vé
  const [totalPrice, setTotalPrice] = useState(0);

  // Set địa điểm
  useEffect(() => {
    // Lấy địa điểm duy nhất từ schedules
    const uniqueLocations = [
      ...new Set(schedules.map((item) => item.ten_dia_diem)),
    ];
    setLocations(uniqueLocations);
  }, [schedules]);

  // Tính tổng giá vé theo số ghế chọn
  useEffect(() => {
    if (!selectedShowtime) return;
    setTotalPrice(selectedSeats.length * selectedShowtime.gia_ve);
  }, [selectedSeats, selectedShowtime]);

  // Hàm xử lý chọn địa điểm
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    const filteredCinemas = schedules
      .filter((s) => s.ten_dia_diem === location)
      .map((s) => ({ id: s.id_rap, ten_rap: s.ten_rap, dia_chi: s.dia_chi }));
    const uniqueCinemas = Array.from(
      new Map(filteredCinemas.map((c) => [c.id, c])).values()
    ); // id, ten_rap, dia_chi
    setCinemas(uniqueCinemas);
    setSelectedCinema(null);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  // Hàm xử lý chọn rạp
  const handleCinemaSelect = (cinemaId) => {
    setSelectedCinema(cinemaId);
    const filteredDates = schedules
      .filter((s) => s.id_rap == cinemaId)
      .map((s) => s.ngay_chieu);
    const uniqueDates = [...new Set(filteredDates)];
    setDates(uniqueDates);
    setSelectedDate(null);
    setShowtimes([]);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  // Hàm xử lý chọn ngày chiếu
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const filteredTimes = schedules
      .filter((s) => s.id_rap == selectedCinema && s.ngay_chieu === date)
      .flatMap((s) =>
        s.suat_chieu.map((t) => ({
          id_suat_chieu: t.id,
          dinh_dang: t.dinh_dang,
          gio_chieu: t.gio_chieu,
          gia_ve: t.gia_ve,
        }))
      );
    setShowtimes(filteredTimes);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  // Hàm xử lý chọn xuất chiếu
  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);

    // fetch ghế đã đặt
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seats/booked/${showtime.id_suat_chieu}`
    )
      .then((res) => res.json())
      .then((data) => setReservedSeats(data.data)); // ["E03", "F04"]
  };

  // Hàm xử lý đặt vé
  const handleBooking = () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      toast.error("Vui lòng chọn suất chiếu và ghế!");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_suat_chieu: selectedShowtime.id_suat_chieu,
        ghe_da_dat: selectedSeats,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Đặt vé thành công!");
        // Reset state
        setSelectedSeats([]);
        // Cập nhật ghế đã đặt
        setReservedSeats((prev) => [...prev, ...data.data.so_ghe]);
      })
      .catch((err) => {
        toast.error("Đặt vé thất bại!");
        console.error(err);
      });
  };

  // Hàm xử lý chọn và bỏ chọn ghế
  const toggleSeat = (seat) => {
    if (!selectedShowtime || reservedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Hàm xử lý tạo class cho ghế
  const getSeatClass = (seat) => {
    if (reservedSeats.includes(seat)) return "bg-gray-500";
    if (selectedSeats.includes(seat)) return "bg-yellow-400";
    return "bg-black";
  };

  return (
    // Lịch chiếu và đặt vé
    <div
      ref={bookingRef}
      className="min-h-screen bg-gradient-to-r from-blue-900 via-gray-800 to-black text-white pt-20"
    >
      <div className="max-w-4xl mx-auto py-10">
        {/* Title */}
        <h1 className="text-center text-4xl font-bold mb-6">LỊCH CHIẾU</h1>

        {/* Locations */}
        <div className="flex justify-center space-x-4 mb-6">
          {locations.map((location, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded-lg ${
                selectedLocation === location
                  ? "bg-yellow-400 text-black font-bold"
                  : "border-yellow-400 text-yellow-400"
              }`}
              onClick={() => handleLocationSelect(location)}
            >
              {location}
            </button>
          ))}
        </div>

        {/* Cinema */}
        {selectedLocation && (
          <div className="flex justify-center mb-6">
            <select
              value={selectedCinema || ""}
              onChange={(e) => handleCinemaSelect(e.target.value)}
              className="bg-transparent border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition"
            >
              <option value="" disabled className="text-black">
                -- Chọn rạp --
              </option>
              {cinemas.map((cinema) => (
                <option
                  key={cinema.id}
                  value={cinema.id}
                  className="text-black"
                >
                  {cinema.ten_rap}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dates */}
        {selectedCinema && (
          <div className="flex justify-center space-x-4 mb-8">
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`px-4 py-2 border rounded-lg ${
                  selectedDate === date
                    ? "bg-yellow-400 text-black font-bold"
                    : "border-yellow-400 text-yellow-400"
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        )}

        {/* Showtimes */}
        <div className="space-y-4">
          <div className="bg-purple-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">
              {selectedCinema &&
                cinemas.find((c) => c.id == selectedCinema)?.ten_rap}
            </h2>
            <p className="mb-4">
              {selectedCinema &&
                cinemas.find((c) => c.id == selectedCinema)?.dia_chi}
            </p>

            {/* Grouped by format */}
            {selectedDate &&
              Object.entries(
                showtimes.reduce((acc, curr) => {
                  const format = curr.dinh_dang || "Khác";
                  if (!acc[format]) acc[format] = [];
                  acc[format].push(curr);
                  return acc;
                }, {})
              ).map(([format, times], idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-sm font-semibold text-yellow-300 mb-2">
                    {format}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {times.map((showtime, index) => (
                      <button
                        key={index}
                        onClick={() => handleShowtimeSelect(showtime)}
                        className={`px-4 py-2 border rounded-lg ${
                          selectedShowtime === showtime
                            ? "bg-yellow-400 text-black font-bold"
                            : "border-yellow-400 text-yellow-400"
                        }`}
                      >
                        {showtime.gio_chieu.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Seats */}
        <div className="min-h-screen text-white flex flex-col items-center py-10">
          <h1 className="text-3xl font-bold mb-6">CHỌN GHẾ</h1>
          <div className="text-white text-xl p-2 rounded-md mb-4 text-center">
            <p>Màn hình</p>
            <img
              src="https://cinestar.com.vn/assets/images/img-screen.png"
              alt=""
            />
          </div>
          <div className="flex flex-col gap-2">
            {ROWS.map((row) => (
              <div key={row} className="flex justify-center gap-2">
                {COLS.map((col) => {
                  const seat = `${row}${col.toString().padStart(2, "0")}`;
                  return (
                    <div
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      className={`w-10 h-10 rounded-md flex items-center justify-center cursor-pointer ${getSeatClass(
                        seat
                      )}`}
                    >
                      {seat}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p>
              <span className="inline-block w-6 h-6 bg-black border mr-2"></span>
              Ghế Thường
              <span className="inline-block w-6 h-6 bg-yellow-400 border ml-4 mr-2"></span>
              Ghế Chọn
              <span className="inline-block w-6 h-6 bg-gray-500 border ml-4 mr-2"></span>
              Ghế Đã Đặt
            </p>
          </div>
          <span className="text-2xl font-bold mt-8">
            Tổng cộng: {totalPrice} VND
          </span>
          <button
            onClick={handleBooking}
            className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition mt-8"
          >
            Xác nhận đặt vé
          </button>
        </div>
      </div>
    </div>
  );
});

export default TicketBooking;

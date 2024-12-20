// src/components/AddBooking.jsx
import React, { useState } from "react";

const AddBooking = () => {
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    date: "",
    time: "",
    seats: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://your-api-endpoint.com/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Booking added:", data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="add-booking">
      <h2>Add Booking</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={bookingDetails.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={bookingDetails.date}
          onChange={handleChange}
        />
        <input
          type="time"
          name="time"
          value={bookingDetails.time}
          onChange={handleChange}
        />
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={bookingDetails.seats}
          onChange={handleChange}
        />
        <button type="submit">Add Booking</button>
      </form>
    </div>
  );
};

export default AddBooking;

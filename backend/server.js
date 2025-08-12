require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const seatRoutes = require("./routes/seats");
const userRoutes = require("./routes/users");
const showtimeRoutes = require("./routes/showtimes");
const theaterRoutes = require("./routes/theaters");
const formatRoutes = require("./routes/formats");
const scheduleRoutes = require("./routes/schedules");
const ticketRoutes = require("./routes/tickets");
const locationRoutes = require("./routes/locations");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
); // Cho phép frontend gọi tới backend

app.use(cookieParser()); // Đọc cookies trong request

// Auth routes
app.use("/api/auth", authRoutes);

// Movies routes
app.use("/api/movies", movieRoutes);

// Seats routes
app.use("/api/seats", seatRoutes);

// Users routes
app.use("/api/users", userRoutes);

// Showtimes routes
app.use("/api/showtimes", showtimeRoutes);

// Theaters routes
app.use("/api/theaters", theaterRoutes);

// Formats routes
app.use("/api/formats", formatRoutes);

// Schedules routes
app.use("/api/schedules", scheduleRoutes);

// Tickets routes
app.use("/api/tickets", ticketRoutes);

// Locations routes
app.use("/api/locations", locationRoutes);

app.listen(5000, () => console.log("Ứng dụng đang chạy với port 5000"));

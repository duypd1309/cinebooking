const express = require("express");
const db = require("../db");

const router = express.Router();

// API lấy danh sách ghế đã đặt theo suất chiếu
router.get("/booked/:id_suat_chieu", async (req, res) => {
  const { id_suat_chieu } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT so_ghe FROM dat_ve WHERE id_suat_chieu = ? AND trang_thai = 1`,
      [id_suat_chieu]
    );

    // Ghép tất cả các ghế từ các dòng thành 1 mảng
    const bookedSeats = rows.flatMap((row) =>
      row.so_ghe.split(",").map((ghe) => ghe.trim())
    );

    res.json({ success: true, data: bookedSeats });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ghế đã đặt:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

module.exports = router;

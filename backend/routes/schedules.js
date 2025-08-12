// routes/schedules.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Tạo mới lịch chiếu nếu chưa tồn tại và kiểm tra ngày chiếu hợp lệ
router.post("/", async (req, res) => {
  const { id_phim, id_rap, ngay_chieu } = req.body;

  if (!id_phim || !id_rap || !ngay_chieu) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin id_phim, id_rap hoặc ngay_chieu",
    });
  }

  try {
    // Kiểm tra ngày_chieu phải >= ngày_khoi_chieu của phim
    const [phimRows] = await db.execute(
      `SELECT ngay_khoi_chieu FROM phim WHERE id = ? LIMIT 1`,
      [id_phim]
    );

    if (phimRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phim với id đã cung cấp",
      });
    }

    const ngayKhoiChieu = new Date(phimRows[0].ngay_khoi_chieu);
    const ngayChieu = new Date(ngay_chieu);

    if (ngayChieu < ngayKhoiChieu) {
      return res.status(400).json({
        success: false,
        message: "Ngày chiếu phải bằng hoặc sau ngày khởi chiếu của phim",
      });
    }

    // 🔎 Kiểm tra lịch chiếu đã tồn tại chưa
    const [existing] = await db.execute(
      `SELECT id FROM lich_chieu WHERE id_phim = ? AND id_rap = ? AND ngay_chieu = ? LIMIT 1`,
      [id_phim, id_rap, ngay_chieu]
    );

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: "Lịch chiếu đã tồn tại",
        id: existing[0].id,
      });
    }

    // ✅ Nếu chưa tồn tại, tạo mới
    const [insertResult] = await db.execute(
      `INSERT INTO lich_chieu (id_phim, id_rap, ngay_chieu) VALUES (?, ?, ?)`,
      [id_phim, id_rap, ngay_chieu]
    );

    res.status(201).json({
      success: true,
      message: "Tạo lịch chiếu mới thành công",
      id: insertResult.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi tạo lịch chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;

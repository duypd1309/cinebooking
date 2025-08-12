// routes/formats.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// API lấy tất cả định dạng rạp
router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  if (isNaN(limit) || isNaN(offset)) {
    return res.status(400).json({
      success: false,
      message: "Tham số không hợp lệ",
    });
  }

  try {
    let whereClause = "";
    const queryParams = [];
    const countParams = [];

    if (search.trim()) {
      whereClause = "WHERE ten_dinh_dang LIKE ?";
      const keyword = `%${search}%`;
      queryParams.push(keyword);
      countParams.push(keyword);
    }

    const formatsQuery = `
      SELECT id, ten_dinh_dang, gia_ve
      FROM dinh_dang_rap
      ${whereClause}
      ORDER BY ten_dinh_dang ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM dinh_dang_rap
      ${whereClause}
    `;

    const [rows] = await db.execute(formatsQuery, queryParams);
    const [countResult] = await db.execute(countQuery, countParams);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: rows,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách định dạng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;

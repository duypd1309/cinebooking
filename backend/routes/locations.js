const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
  if (req.user?.role !== 0) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
  next();
}

/**
 * Lấy danh sách địa điểm + tìm kiếm
 * GET /api/locations/all?search=&page=&limit=
 */
router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  if (isNaN(limit) || isNaN(offset)) {
    return res
      .status(400)
      .json({ success: false, message: "Tham số không hợp lệ" });
  }

  try {
    let whereClause = "";
    const queryParams = [];
    const countParams = [];

    if (search.trim()) {
      whereClause = "WHERE ten_dia_diem LIKE ?";
      queryParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    const dataQuery = `
      SELECT 
        id,
        ten_dia_diem
      FROM dia_diem
      ${whereClause}
      ORDER BY ten_dia_diem ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM dia_diem
      ${whereClause}
    `;

    const [rows] = await db.execute(dataQuery, queryParams);
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
    console.error("Lỗi khi lấy danh sách địa điểm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Thêm mới địa điểm
 * POST /api/locations
 */
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { ten_dia_diem } = req.body;

  if (!ten_dia_diem) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên địa điểm" });
  }

  try {
    // Kiểm tra trùng tên
    const [exist] = await db.execute(
      "SELECT id FROM dia_diem WHERE ten_dia_diem = ? LIMIT 1",
      [ten_dia_diem]
    );
    if (exist.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Địa điểm đã tồn tại" });
    }

    const [result] = await db.execute(
      "INSERT INTO dia_diem (ten_dia_diem) VALUES (?)",
      [ten_dia_diem]
    );

    res.status(201).json({
      success: true,
      message: "Tạo địa điểm thành công",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi thêm địa điểm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Lấy thông tin 1 địa điểm
 * GET /api/locations/:id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT id, ten_dia_diem FROM dia_diem WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa điểm" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin địa điểm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Cập nhật địa điểm
 * PUT /api/locations/:id
 */
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { ten_dia_diem } = req.body;

  if (!ten_dia_diem) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên địa điểm" });
  }

  try {
    const [exist] = await db.execute("SELECT id FROM dia_diem WHERE id = ?", [
      id,
    ]);
    if (exist.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa điểm" });
    }

    await db.execute("UPDATE dia_diem SET ten_dia_diem = ? WHERE id = ?", [
      ten_dia_diem,
      id,
    ]);
    res.json({ success: true, message: "Cập nhật địa điểm thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa điểm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Xóa địa điểm
 * DELETE /api/locations/:id
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [exist] = await db.execute("SELECT id FROM dia_diem WHERE id = ?", [
      id,
    ]);
    if (exist.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa điểm" });
    }

    await db.execute("DELETE FROM dia_diem WHERE id = ?", [id]);

    res.json({ success: true, message: "Xóa địa điểm thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa địa điểm:", error);

    // Nếu là lỗi ràng buộc FK (có rạp liên kết)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa vì đang có rạp liên kết với địa điểm này",
      });
    }

    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;

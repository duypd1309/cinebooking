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
 * Lấy danh sách rạp chiếu + tìm kiếm
 * GET /api/theaters/all?search=&page=&limit=
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
      whereClause = "WHERE rc.ten_rap LIKE ? OR dd.ten_dia_diem LIKE ?";
      queryParams.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const dataQuery = `
      SELECT 
        rc.id,
        rc.ten_rap,
        rc.dia_chi,
        dd.id AS id_dia_diem,
        dd.ten_dia_diem
      FROM rap_chieu rc
      LEFT JOIN dia_diem dd ON rc.id_dia_diem = dd.id
      ${whereClause}
      ORDER BY dd.ten_dia_diem ASC, rc.ten_rap ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM rap_chieu rc
      LEFT JOIN dia_diem dd ON rc.id_dia_diem = dd.id
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
    console.error("Lỗi khi lấy danh sách rạp:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Lấy thông tin chi tiết rạp
 * GET /api/theaters/:id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT 
        rc.id,
        rc.ten_rap,
        rc.dia_chi,
        dd.id AS id_dia_diem,
        dd.ten_dia_diem
      FROM rap_chieu rc
      LEFT JOIN dia_diem dd ON rc.id_dia_diem = dd.id
      WHERE rc.id = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy rạp" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết rạp:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Thêm mới rạp chiếu
 * POST /api/theaters
 */
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { ten_rap, dia_chi, id_dia_diem } = req.body;

  if (!ten_rap || !id_dia_diem) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên rạp hoặc ID địa điểm" });
  }

  try {
    // Kiểm tra địa điểm tồn tại
    const [loc] = await db.execute("SELECT id FROM dia_diem WHERE id = ?", [
      id_dia_diem,
    ]);
    if (loc.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa điểm" });
    }

    // Kiểm tra trùng tên rạp trong cùng địa điểm
    const [exist] = await db.execute(
      "SELECT id FROM rap_chieu WHERE ten_rap = ? AND id_dia_diem = ? LIMIT 1",
      [ten_rap, id_dia_diem]
    );
    if (exist.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Rạp đã tồn tại trong địa điểm này" });
    }

    const [result] = await db.execute(
      "INSERT INTO rap_chieu (ten_rap, dia_chi, id_dia_diem) VALUES (?, ?, ?)",
      [ten_rap, dia_chi || null, id_dia_diem]
    );

    res.status(201).json({
      success: true,
      message: "Tạo rạp chiếu thành công",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi thêm rạp:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Cập nhật rạp chiếu
 * PUT /api/theaters/:id
 */
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { ten_rap, dia_chi, id_dia_diem } = req.body;

  if (!ten_rap || !id_dia_diem) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên rạp hoặc ID địa điểm" });
  }

  try {
    const [exist] = await db.execute("SELECT id FROM rap_chieu WHERE id = ?", [
      id,
    ]);
    if (exist.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy rạp" });
    }

    await db.execute(
      "UPDATE rap_chieu SET ten_rap = ?, dia_chi = ?, id_dia_diem = ? WHERE id = ?",
      [ten_rap, dia_chi || null, id_dia_diem, id]
    );
    res.json({ success: true, message: "Cập nhật rạp thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật rạp:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

/**
 * Xóa rạp chiếu
 * DELETE /api/theaters/:id
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra rạp tồn tại
    const [exist] = await db.execute("SELECT id FROM rap_chieu WHERE id = ?", [
      id,
    ]);
    if (exist.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy rạp" });
    }

    try {
      // Thực hiện xóa
      await db.execute("DELETE FROM rap_chieu WHERE id = ?", [id]);
      return res.json({ success: true, message: "Xóa rạp thành công" });
    } catch (err) {
      // Nếu lỗi do ràng buộc khóa ngoại (FK constraint)
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          success: false,
          message:
            "Không thể xóa vì rạp này đang có lịch chiếu hoặc dữ liệu liên kết.",
        });
      }
      throw err; // Ném tiếp lỗi để catch ở ngoài
    }
  } catch (error) {
    console.error("Lỗi khi xóa rạp:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;

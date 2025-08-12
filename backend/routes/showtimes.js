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

// API lấy danh sách tất cả suất chiếu + tìm kiếm theo tên phim
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
      whereClause = "WHERE p.ten_phim LIKE ?";
      queryParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    // 🛠️ Ghép LIMIT/OFFSET trực tiếp vào query
    const showtimesQuery = `
      SELECT 
        sc.id,
        p.ten_phim,
        p.anh_phim,
        lc.ngay_chieu,
        r.ten_rap,
        dd.ten_dia_diem,
        sc.gio_chieu,
        ddr.ten_dinh_dang,
        ddr.gia_ve
      FROM suat_chieu sc
      JOIN lich_chieu lc ON sc.id_lich_chieu = lc.id
      JOIN phim p ON lc.id_phim = p.id
      JOIN rap_chieu r ON lc.id_rap = r.id
      JOIN dia_diem dd ON r.id_dia_diem = dd.id
      JOIN dinh_dang_rap ddr ON sc.id_dinh_dang = ddr.id
      ${whereClause}
      ORDER BY lc.ngay_chieu DESC, sc.gio_chieu ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM suat_chieu sc
      JOIN lich_chieu lc ON sc.id_lich_chieu = lc.id
      JOIN phim p ON lc.id_phim = p.id
      ${whereClause}
    `;

    const [rows] = await db.execute(showtimesQuery, queryParams);
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
    console.error("Lỗi khi lấy danh sách suất chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API tạo mới suất chiếu (admin)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const { id_lich_chieu, gio_chieu, id_dinh_dang } = req.body;

  if (!id_lich_chieu || !gio_chieu || !id_dinh_dang) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin: id_lich_chieu, gio_chieu hoặc id_dinh_dang",
    });
  }

  try {
    // 🔎 Kiểm tra xem lịch chiếu có tồn tại không
    const [scheduleRows] = await db.execute(
      `SELECT * FROM lich_chieu WHERE id = ?`,
      [id_lich_chieu]
    );
    if (scheduleRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lịch chiếu" });
    }

    // Kiểm tra trùng suất chiếu (cùng lịch + cùng giờ)
    const [existing] = await db.execute(
      `SELECT id FROM suat_chieu WHERE id_lich_chieu = ? AND gio_chieu = ? LIMIT 1`,
      [id_lich_chieu, gio_chieu]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Suất chiếu đã tồn tại vào giờ này trong lịch chiếu",
      });
    }

    // Tạo suất chiếu mới
    const [result] = await db.execute(
      `INSERT INTO suat_chieu (id_lich_chieu, gio_chieu, id_dinh_dang) VALUES (?, ?, ?)`,
      [id_lich_chieu, gio_chieu, id_dinh_dang]
    );

    res.status(201).json({
      success: true,
      message: "Tạo suất chiếu thành công",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi tạo suất chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API lấy chi tiết suất chiếu theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu ID suất chiếu" });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        sc.id,
        sc.id_lich_chieu,
        lc.id_phim,
        lc.id_rap,
        lc.ngay_chieu,
        sc.gio_chieu,
        sc.id_dinh_dang
      FROM suat_chieu sc
      JOIN lich_chieu lc ON sc.id_lich_chieu = lc.id
      WHERE sc.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy suất chiếu" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết suất chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API cập nhật suất chiếu (admin) — chấp nhận movieId, theaterId, date, time, formatId
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { movieId, theaterId, date, time, formatId } = req.body;

  if (!movieId || !theaterId || !date || !time || !formatId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin: movieId, theaterId, date, time hoặc formatId",
    });
  }

  try {
    // 1) Kiểm tra suat_chieu tồn tại
    const [existingShowtime] = await db.execute(
      `SELECT * FROM suat_chieu WHERE id = ? LIMIT 1`,
      [id]
    );
    if (existingShowtime.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy suất chiếu" });
    }

    // 2) Tìm lich_chieu tương ứng (theo movieId, theaterId, date)
    const [schedules] = await db.execute(
      `SELECT * FROM lich_chieu WHERE id_phim = ? AND id_rap = ? AND ngay_chieu = ? LIMIT 1`,
      [movieId, theaterId, date]
    );

    let id_lich_chieu;
    if (schedules.length > 0) {
      id_lich_chieu = schedules[0].id;
    } else {
      // Tạo mới lich_chieu nếu chưa có
      const [insertLich] = await db.execute(
        `INSERT INTO lich_chieu (id_phim, id_rap, ngay_chieu) VALUES (?, ?, ?)`,
        [movieId, theaterId, date]
      );
      id_lich_chieu = insertLich.insertId;
    }

    // 3) Đảm bảo định dạng tồn tại (tùy DB bạn có thể kiểm tra)
    const [formatRows] = await db.execute(
      `SELECT * FROM dinh_dang_rap WHERE id = ? LIMIT 1`,
      [formatId]
    );
    if (formatRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy định dạng" });
    }

    // 4) Chuẩn hoá time — đảm bảo có giây nếu DB cần (HH:MM:SS)
    let gio_chieu = time;
    if (/^\d{2}:\d{2}$/.test(time)) {
      gio_chieu = `${time}:00`;
    }

    // 5) Kiểm tra trùng suất chiếu (trừ chính nó)
    const [duplicate] = await db.execute(
      `SELECT id FROM suat_chieu WHERE id_lich_chieu = ? AND gio_chieu = ? AND id <> ? LIMIT 1`,
      [id_lich_chieu, gio_chieu, id]
    );
    if (duplicate.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Suất chiếu đã tồn tại vào giờ này trong lịch chiếu",
      });
    }

    // 6) Cập nhật suat_chieu
    await db.execute(
      `UPDATE suat_chieu SET id_lich_chieu = ?, gio_chieu = ?, id_dinh_dang = ? WHERE id = ?`,
      [id_lich_chieu, gio_chieu, formatId, id]
    );

    return res.json({
      success: true,
      message: "Cập nhật suất chiếu thành công",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật suất chiếu:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// DELETE /api/showTimes/:id
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy suất chiếu để biết id_lich_chieu
    const [showtime] = await db.query(
      "SELECT id, id_lich_chieu FROM suat_chieu WHERE id = ?",
      [id]
    );
    if (showtime.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Suất chiếu không tồn tại" });
    }

    const idLichChieu = showtime[0].id_lich_chieu;

    // Xóa suất chiếu
    await db.query("DELETE FROM suat_chieu WHERE id = ?", [id]);

    // Kiểm tra xem lịch chiếu này còn suất chiếu nào khác không
    const [remaining] = await db.query(
      "SELECT COUNT(*) AS count FROM suat_chieu WHERE id_lich_chieu = ?",
      [idLichChieu]
    );

    if (remaining[0].count === 0) {
      // Không còn suất chiếu nào => xóa luôn lịch chiếu
      await db.query("DELETE FROM lich_chieu WHERE id = ?", [idLichChieu]);
    }

    res.json({
      success: true,
      message: "Xóa suất chiếu (và lịch chiếu nếu trống) thành công",
    });
  } catch (error) {
    console.error("Lỗi xoá suất chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;

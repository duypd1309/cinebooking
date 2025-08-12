const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
  if (req.user?.role !== 0) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
  next();
}

// GET /api/tickets - Lấy vé đã đặt của người dùng hiện tại
router.get("/", async (req, res) => {
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn chưa đăng nhập." });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 5, 50); // tránh limit quá lớn
  const offset = (page - 1) * limit;

  if (isNaN(limit) || isNaN(offset)) {
    return res
      .status(400)
      .json({ success: false, message: "Tham số phân trang không hợp lệ." });
  }

  try {
    // Đếm tổng số vé
    const [[countResult]] = await db.execute(
      `SELECT COUNT(*) AS total FROM dat_ve WHERE id_tai_khoan = ? AND trang_thai = 1`,
      [user.id]
    );
    const totalRows = countResult.total;
    const totalPages = Math.ceil(totalRows / limit);

    // Lấy vé đã đặt
    const [rows] = await db.query(
      `
      SELECT
        dv.id,
        p.ten_phim AS movieTitle,
        p.anh_phim AS movieImage, 
        rc.ten_rap AS cinemaName,
        rc.dia_chi AS diaChi,
        lc.ngay_chieu AS showDate,
        sc.gio_chieu AS showTime,
        ddr.ten_dinh_dang AS format,
        dv.so_ghe AS seats,
        dv.tien_ve AS totalPrice
      FROM dat_ve dv
      JOIN suat_chieu sc ON dv.id_suat_chieu = sc.id
      JOIN lich_chieu lc ON sc.id_lich_chieu = lc.id
      JOIN phim p ON lc.id_phim = p.id
      JOIN rap_chieu rc ON lc.id_rap = rc.id
      JOIN dinh_dang_rap ddr ON sc.id_dinh_dang = ddr.id
      WHERE dv.id_tai_khoan = ? AND dv.trang_thai = 1
      ORDER BY lc.ngay_chieu DESC, sc.gio_chieu DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      [user.id]
    );

    const data = rows.map((row) => ({
      ...row,
      seats: row.seats.split(","),
    }));

    res.json({
      success: true,
      data,
      totalPages,
    });
  } catch (err) {
    console.error("Lỗi khi lấy vé:", err);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

/**
 * Lấy danh sách vé + tìm kiếm theo email người đặt
 * GET /api/tickets/all?search=&page=&limit=
 */
router.get("/all", isAdmin, async (req, res) => {
  // parse & validate pagination
  const page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (!Number.isInteger(limit) || limit <= 0) limit = 10;
  // giới hạn tối đa để tránh truy vấn quá nặng
  limit = Math.min(limit, 100);

  const offset = (page - 1) * limit;
  if (!Number.isInteger(offset) || offset < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Tham số phân trang không hợp lệ." });
  }

  const search = (req.query.search || "").trim();

  try {
    // build where + params (search dùng binding để tránh injection)
    let whereClause = "";
    const params = [];
    const countParams = [];

    if (search) {
      whereClause = "WHERE tk.email LIKE ? OR p.ten_phim LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    // COUNT query (parameterized)
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM dat_ve dv
      JOIN suat_chieu sc ON dv.id_suat_chieu = sc.id
      JOIN lich_chieu lc ON sc.id_lich_chieu = lc.id
      JOIN phim p ON lc.id_phim = p.id
      JOIN tai_khoan tk ON dv.id_tai_khoan = tk.id
      ${whereClause}
    `;
    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // DATA query: chèn LIMIT/OFFSET trực tiếp (sau khi đã validate)
    const dataQuery = `
      SELECT
        dv.id,
        p.ten_phim AS movieTitle,
        p.anh_phim AS movieImage,
        rc.ten_rap AS cinemaName,
        rc.dia_chi AS diaChi,
        lc.ngay_chieu AS showDate,
        sc.gio_chieu AS showTime,
        ddr.ten_dinh_dang AS format,
        dv.so_ghe AS seats,
        dv.tien_ve AS totalPrice,
        tk.email AS userEmail,
        tk.ho_va_ten AS userName,
        tk.role AS userRole
      FROM dat_ve dv
      JOIN suat_chieu sc ON dv.id_suat_chieu = sc.id
      JOIN lich_chieu lc ON sc.id_lich_chieu = lc.id
      JOIN phim p ON lc.id_phim = p.id
      JOIN rap_chieu rc ON lc.id_rap = rc.id
      JOIN dinh_dang_rap ddr ON sc.id_dinh_dang = ddr.id
      JOIN tai_khoan tk ON dv.id_tai_khoan = tk.id
      ${whereClause}
      ORDER BY lc.ngay_chieu DESC, sc.gio_chieu DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Sử dụng db.query với params cho phần WHERE, LIMIT/OFFSET đã được inject
    const [rows] = await db.query(dataQuery, params);

    const data = rows.map((row) => ({
      ...row,
      seats: row.seats ? row.seats.split(",") : [],
    }));

    return res.json({
      success: true,
      data,
      total,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Lỗi khi lấy vé admin:", err);
    return res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

// API đặt vé
router.post("/", async (req, res) => {
  try {
    const { id_suat_chieu, ghe_da_dat } = req.body;

    // Kiểm tra đăng nhập
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Vui lòng đăng nhập để đặt vé!" });
    }

    // Kiểm tra dữ liệu đầu vào
    if (
      !id_suat_chieu ||
      !Array.isArray(ghe_da_dat) ||
      ghe_da_dat.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Thông tin đặt vé không hợp lệ!" });
    }

    const danhSachGhe = ghe_da_dat.join(","); // VD: "A01,A02,B03"
    const soLuongGhe = ghe_da_dat.length;
    const id_tai_khoan = req.user.id;

    // Kiểm tra xem ghế có bị trùng không
    const [existingSeats] = await db.execute(
      `SELECT so_ghe FROM dat_ve WHERE id_suat_chieu = ?`,
      [id_suat_chieu]
    );

    const daDat = existingSeats.flatMap((row) => row.so_ghe.split(","));

    const gheTrung = ghe_da_dat.filter((ghe) => daDat.includes(ghe));
    if (gheTrung.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Các ghế sau đã được đặt: ${gheTrung.join(", ")}`,
      });
    }

    const [[suatChieu]] = await db.execute(
      `
  SELECT ddr.gia_ve
  FROM suat_chieu sc
  JOIN dinh_dang_rap ddr ON sc.id_dinh_dang = ddr.id
  WHERE sc.id = ?
  `,
      [id_suat_chieu]
    );

    if (!suatChieu) {
      return res
        .status(404)
        .json({ success: false, message: "Suất chiếu không tồn tại!" });
    }

    const gia_ve = suatChieu.gia_ve;
    const tien_ve = gia_ve * soLuongGhe;

    // Tiến hành lưu vé
    const [result] = await db.execute(
      `INSERT INTO dat_ve (id_suat_chieu, id_tai_khoan, so_ghe, tien_ve) VALUES (?, ?, ?, ?)`,
      [id_suat_chieu, id_tai_khoan, danhSachGhe, tien_ve]
    );

    return res.status(201).json({
      success: true,
      message: "Đặt vé thành công!",
      data: {
        id: result.insertId,
        id_tai_khoan,
        id_suat_chieu,
        so_ghe: ghe_da_dat,
        tien_ve,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đặt vé:", error);
    return res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// API hủy vé (xóa record)
router.delete("/:id", async (req, res) => {
  const ticketId = parseInt(req.params.id);
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn chưa đăng nhập." });
  }

  try {
    // Kiểm tra vé tồn tại và thuộc user hiện tại
    const [rows] = await db.execute(
      `SELECT * FROM dat_ve WHERE id = ? AND id_tai_khoan = ? AND trang_thai = 1`,
      [ticketId, userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy vé hợp lệ để hủy." });
    }

    // Xóa vé
    await db.execute(`DELETE FROM dat_ve WHERE id = ? AND id_tai_khoan = ?`, [
      ticketId,
      userId,
    ]);

    return res.json({ success: true, message: "Hủy vé thành công." });
  } catch (err) {
    console.error("Lỗi khi hủy vé:", err);
    return res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

module.exports = router;

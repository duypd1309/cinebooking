const express = require("express");

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// API lấy danh sách phim đang chiếu
router.get("/now-showing", async (req, res) => {
  try {
    const [movies] = await db.execute(
      "SELECT id, ten_phim, anh_phim, the_loai, ngay_khoi_chieu FROM phim WHERE ngay_khoi_chieu <= NOW() ORDER BY ngay_khoi_chieu DESC"
    );
    res.json({ success: true, data: movies });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim đang chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API lấy danh sách phim sắp chiếu
router.get("/coming-soon", async (req, res) => {
  try {
    const [movies] = await db.execute(
      "SELECT id, ten_phim, anh_phim, the_loai, ngay_khoi_chieu FROM phim WHERE ngay_khoi_chieu > NOW() ORDER BY ngay_khoi_chieu ASC"
    );
    res.json({ success: true, data: movies });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim sắp chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API mới để lấy 6 phim gần nhất (đang hoặc sắp chiếu) để làm phim nổi bật
router.get("/featured", async (req, res) => {
  try {
    const [movies] = await db.execute(`
      SELECT id, ten_phim, anh_phim, the_loai, ngay_khoi_chieu
      FROM phim
      ORDER BY ngay_khoi_chieu DESC
      LIMIT 6
    `);

    res.json({ success: true, data: movies });
  } catch (error) {
    console.error("Lỗi khi lấy phim nổi bật:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API lấy danh sách tất cả phim + tìm kiếm theo tên
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
      whereClause = "WHERE ten_phim LIKE ?";
      queryParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    // 🛠️ Ghép trực tiếp LIMIT và OFFSET vào câu query
    const moviesQuery = `
      SELECT id, ten_phim, anh_phim, the_loai, quoc_gia, mo_ta, ngay_khoi_chieu
      FROM phim
      ${whereClause}
      ORDER BY ngay_khoi_chieu ASC, id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM phim
      ${whereClause}
    `;

    const [movies] = await db.execute(moviesQuery, queryParams);
    const [countResult] = await db.execute(countQuery, countParams);

    const total = countResult[0].total;

    res.json({
      success: true,
      data: movies,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim có phân trang:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API lấy thông tin phim theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [movies] = await db.execute("SELECT * FROM phim WHERE id = ?", [id]);

    if (movies.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }

    res.json({ success: true, data: movies[0] });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// API thêm phim (admin)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Kiểm tra đăng nhập
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Vui lòng đăng nhập." });
    }

    // Kiểm tra quyền admin
    if (req.user.role !== 0) {
      return res.status(403).json({
        success: false,
        message: "Forbidden! Bạn không có quyền thêm phim",
      });
    }

    const { title, imageUrl, description, genres, country, releaseDate } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !title ||
      !imageUrl ||
      !description ||
      !genres ||
      !country ||
      !releaseDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin phim!",
      });
    }

    const genreString = genres.join(","); // Chuyển mảng thể loại thành chuỗi

    const sql = `
      INSERT INTO phim (ten_phim, anh_phim, mo_ta, the_loai, quoc_gia, ngay_khoi_chieu) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title,
      imageUrl,
      description,
      genreString,
      country,
      releaseDate,
    ];

    const [result] = await db.execute(sql, values);

    if (result.affectedRows > 0) {
      return res.status(201).json({
        success: true,
        message: "Thêm phim thành công!",
        data: {
          id: result.insertId,
          ten_phim: title,
          anh_phim: imageUrl,
          mo_ta: description,
          the_loai: genreString,
          quoc_gia: country,
          ngay_khoi_chieu: releaseDate,
        },
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khi thêm phim!" });
    }
  } catch (error) {
    console.error("Lỗi khi thêm phim:", error);
    return res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// API cập nhật phim (admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Kiểm tra đăng nhập
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Vui lòng đăng nhập." });
    }

    // Kiểm tra quyền admin
    if (req.user.role !== 0) {
      return res.status(403).json({
        success: false,
        message: "Forbidden! Bạn không có quyền cập nhật phim",
      });
    }

    const { id } = req.params;
    const { title, imageUrl, description, genres, country, releaseDate } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !title ||
      !imageUrl ||
      !description ||
      !genres ||
      !country ||
      !releaseDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin phim!",
      });
    }

    const genreString = genres.join(","); // Chuyển mảng thể loại thành chuỗi

    // Kiểm tra xem phim có tồn tại không
    const [existingMovie] = await db.execute(
      "SELECT * FROM phim WHERE id = ?",
      [id]
    );
    if (existingMovie.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phim!",
      });
    }

    // Cập nhật thông tin phim
    const sql = `
      UPDATE phim 
      SET ten_phim = ?, anh_phim = ?, mo_ta = ?, the_loai = ?, quoc_gia = ?, ngay_khoi_chieu = ? 
      WHERE id = ?
    `;
    const values = [
      title,
      imageUrl,
      description,
      genreString,
      country,
      releaseDate,
      id,
    ];

    const [result] = await db.execute(sql, values);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Cập nhật phim thành công!",
        data: {
          id,
          ten_phim: title,
          anh_phim: imageUrl,
          mo_ta: description,
          the_loai: genreString,
          quoc_gia: country,
          ngay_khoi_chieu: releaseDate,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Không có thay đổi nào được thực hiện!",
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật phim:", error);
    return res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

/**
 * Xóa phim
 * DELETE /api/movies/:id
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra quyền admin
    if (!req.user || req.user.role !== 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa phim!",
      });
    }

    // Kiểm tra phim tồn tại
    const [exist] = await db.execute("SELECT id FROM phim WHERE id = ?", [id]);
    if (exist.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phim" });
    }

    // Thực hiện xóa
    await db.execute("DELETE FROM phim WHERE id = ?", [id]);

    res.json({ success: true, message: "Xóa phim thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa phim:", error);

    // Nếu là lỗi ràng buộc FK (có lịch chiếu liên kết)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa vì đang có lịch chiếu liên kết với phim này",
      });
    }

    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API lấy lịch chiếu theo phim (nested structure)
router.get("/:id/schedule", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        lc.id AS id_lich_chieu,
        lc.ngay_chieu,
        rap.id AS id_rap,
        rap.ten_rap,
        rap.dia_chi,
        dd.ten_dia_diem,
        xc.id AS id_suat_chieu,
        xc.gio_chieu,
        ddr.ten_dinh_dang,
        ddr.gia_ve
      FROM lich_chieu lc
      JOIN rap_chieu rap ON lc.id_rap = rap.id
      JOIN dia_diem dd ON rap.id_dia_diem = dd.id
      LEFT JOIN suat_chieu xc ON xc.id_lich_chieu = lc.id
      LEFT JOIN dinh_dang_rap ddr ON xc.id_dinh_dang = ddr.id
      WHERE lc.id_phim = ?
      ORDER BY lc.ngay_chieu ASC, xc.gio_chieu ASC
      `,
      [id]
    );

    const grouped = [];

    rows.forEach((row) => {
      let group = grouped.find(
        (g) => g.id_rap === row.id_rap && g.ngay_chieu === row.ngay_chieu
      );

      if (!group) {
        group = {
          id_rap: row.id_rap,
          ten_rap: row.ten_rap,
          dia_chi: row.dia_chi,
          ten_dia_diem: row.ten_dia_diem,
          ngay_chieu: row.ngay_chieu,
          suat_chieu: [],
        };
        grouped.push(group);
      }

      if (row.id_suat_chieu && row.gio_chieu) {
        group.suat_chieu.push({
          id: row.id_suat_chieu,
          gio_chieu: row.gio_chieu,
          dinh_dang: row.ten_dinh_dang,
          gia_ve: row.gia_ve,
        });
      }
    });

    res.json({ success: true, data: grouped });
  } catch (error) {
    console.error("Lỗi khi lấy lịch chiếu:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

module.exports = router;

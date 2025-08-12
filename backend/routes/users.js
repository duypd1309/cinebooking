const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
  if (req.user?.role !== 0) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
  next();
}

// API lấy danh sách người dùng (admin) có phân trang + tìm kiếm theo tên và email
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
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
      whereClause = "WHERE ho_va_ten LIKE ? OR email LIKE ?";
      const keyword = `%${search}%`;
      queryParams.push(keyword, keyword);
      countParams.push(keyword, keyword);
    }

    // Ghép trực tiếp LIMIT và OFFSET
    const usersQuery = `
      SELECT id, ho_va_ten AS name, email, role
      FROM tai_khoan
      ${whereClause}
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM tai_khoan
      ${whereClause}
    `;

    const [users] = await db.query(usersQuery, queryParams);
    const [countResult] = await db.query(countQuery, countParams);
    const totalUsers = countResult[0].total;

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
      },
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// Lấy thông tin người dùng hiện tại
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT id, email, ho_va_ten, role FROM tai_khoan WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Lỗi lấy thông tin user:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// Cập nhật thông tin hồ sơ cá nhân
router.put("/profile", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { email, ho_va_ten } = req.body;

  if (!email || !ho_va_ten) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin cần thiết.",
    });
  }

  try {
    // Kiểm tra email đã tồn tại cho user khác chưa
    const [checkEmail] = await db.query(
      "SELECT id FROM tai_khoan WHERE email = ? AND id != ?",
      [email, userId]
    );
    if (checkEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng bởi tài khoản khác.",
      });
    }

    const [result] = await db.query(
      "UPDATE tai_khoan SET email = ?, ho_va_ten = ? WHERE id = ?",
      [email, ho_va_ten, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    res.json({ success: true, message: "Cập nhật thông tin thành công!" });
  } catch (err) {
    console.error("Lỗi cập nhật hồ sơ:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// Đổi mật khẩu
router.put("/change-password", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin." });
  }

  try {
    // Lấy mật khẩu hiện tại
    const [rows] = await db.query(
      "SELECT password FROM tai_khoan WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu cũ không đúng!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE tai_khoan SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// GET /api/users/:id (Admin)
router.get("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, email, ho_va_ten, role FROM tai_khoan WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng!",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Lỗi lấy thông tin người dùng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
    });
  }
});

// API thêm người dùng mới (admin)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 1 } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin!" });
    }

    // Kiểm tra email đã tồn tại chưa
    const [existing] = await db.query(
      "SELECT id FROM tai_khoan WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO tai_khoan (ho_va_ten, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: "Thêm người dùng thành công!",
      user: {
        id: result.insertId,
        name,
        email,
        role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// API chỉnh sửa thông tin người dùng (admin)
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { email, ho_va_ten, role } = req.body;

  if (!email || !ho_va_ten || typeof role === "undefined") {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin cần thiết." });
  }

  try {
    const [result] = await db.query(
      "UPDATE tai_khoan SET email = ?, ho_va_ten = ?, role = ? WHERE id = ?",
      [email, ho_va_ten, role, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    res.json({ success: true, message: "Cập nhật người dùng thành công!" });
  } catch (err) {
    console.error("Lỗi cập nhật user:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

// API xóa người dùng (admin)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tai_khoan WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    res.json({ success: true, message: "Xóa người dùng thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// API Đăng ký tài khoản
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const [existingUser] = await db.query(
      "SELECT * FROM tai_khoan WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email đã được sử dụng!" });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Thêm tài khoản vào database
    await db.query(
      "INSERT INTO tai_khoan (email, password, ho_va_ten, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, fullName, 1] // Mặc định role = 1 (user)
    );

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// API Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem email có tồn tại không
    const [user] = await db.query("SELECT * FROM tai_khoan WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    const userData = user[0]; // Lấy thông tin người dùng

    // Kiểm tra mật khẩu có đúng không
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Lưu token vào HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true, // Bảo vệ khỏi XSS
      secure: true, // Chỉ gửi qua HTTPS (nếu deploy)
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    res.json({ message: "Đăng nhập thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Xóa Cookie chứa token
  res.json({ message: "Đăng xuất thành công!" });
});

// API kiểm tra trạng thái đăng nhập
router.get("/me", authMiddleware, (req, res) => {
  if (!req.user) {
    return res.json(null); // Guest
  }

  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;

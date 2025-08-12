const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ Cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Gán thông tin user từ token vào request
    } catch (error) {
      console.log("Token không hợp lệ hoặc đã hết hạn!", error.message);
      req.user = null; // Token không hợp lệ hoặc hết hạn, user là Guest
    }
  } else {
    req.user = null; // Nếu không có token, user là Guest
  }

  next();
};

module.exports = authMiddleware;

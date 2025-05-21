const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyUser = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ success: false, error: "Token not provided or format invalid" });
      }
  
      const token = authHeader.split(" ")[1];

      // Giải mã token để lấy thông tin người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm người dùng từ ID đã giải mã từ token
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      
      // Lưu thông tin người dùng vào req.user và tiếp tục xử lý
      req.user = user;
      next();
    } catch (error) {
      console.log("Verify token error:", error.message); // 👈 debug
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
  }

module.exports = verifyUser;

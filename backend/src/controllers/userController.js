const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const createAdminUser = async () => {
    try {
        // Kiểm tra nếu admin đã tồn tại thì không tạo nữa
        const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            console.log("⚠️ Admin đã tồn tại, không tạo lại");
            return;
        }

        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        });

        await newUser.save();
        res.status(201).json({message: "Tạo admin thành công !"})
    } catch (error) {
        res.status(500).json({message: "Lỗi khi tạo admin !"})
    }
}

module.exports = createAdminUser;

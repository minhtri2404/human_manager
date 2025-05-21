const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const userRegister = async(req,res) => {
    try {
        const hashPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save()
        res.status(201).json({message: "Tạo admin thành công !"})
    } catch (error) {
        console.log("❌ Lỗi khi tạo admin:", error);
        res.status(500).json({message: "Lỗi hệ thống"})
    }
}
module.exports = userRegister;

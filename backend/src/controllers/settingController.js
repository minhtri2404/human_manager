const User = require('../models/userModel')
const bcrypt = require('bcrypt');

class SettingController {
    changePassword = async(req, res) => {
        try {
            const { userId, oldPassword, newPassword } = req.body

            if (!newPassword) {
                return res.status(400).json({ success: false, message: "New password is required" })
            }

            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ success: false, message: "User Not Found" })
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password)
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Wrong old password" })
            }

            const hashPassword = await bcrypt.hash(newPassword, 10)
            await User.findByIdAndUpdate(userId, { password: hashPassword })

            return res.status(200).json({ success: true, message: "Password changed successfully" })
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
        }
    }
}

module.exports = new SettingController()

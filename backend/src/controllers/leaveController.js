const Leave = require('../models/leaveModel')

class LeaveController {
    addLeave = async (req, res) => {
        try {
            const {userId, leaveType, startDate, endDate, reason} = req.body
            
            console.log('Request body:', req.body);  // Xem dữ liệu gửi lên
            console.log('userId:', userId);
            
            const newLeave = new Leave({
                employeeId: userId, leaveType, startDate, endDate, reason
            })

            await newLeave.save()
            return res.status(200).json({success: true, message: "Tạo đơn xin nghỉ thành công"})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }
    }
}

module.exports = new LeaveController()

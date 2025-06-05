const Leave = require('../models/leaveModel')
const Employee = require('../models/employeeModel')

class LeaveController {
    addLeave = async (req, res) => {
        try {
            const {userId, leaveType, startDate, endDate, reason} = req.body
            
            console.log('Request body:', req.body);  // Xem dữ liệu gửi lên
            console.log('userId:', userId);
            
            // Tìm employee theo userId
            const employee = await Employee.findOne({ userId });

            const newLeave = new Leave({
                employeeId: employee._id, leaveType, startDate, endDate, reason
            })

            await newLeave.save()
            return res.status(200).json({success: true, message: "Tạo đơn xin nghỉ thành công"})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }
    }

    getAllLeave = async (req, res) => {
        try {
            const { id } = req.params;

            const employee = await Employee.findOne({ userId: id });
            
            if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found for this userId' });
            }

            const leaves = await Leave.find({ employeeId: employee._id });
            return res.status(200).json({ success: true, leaves });
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message});
        }
    }
}
module.exports = new LeaveController()

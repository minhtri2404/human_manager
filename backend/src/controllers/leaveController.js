const Leave = require('../models/leaveModel')
const Employee = require('../models/employeeModel')

class LeaveController {
    // Thêm đơn xin nghĩ nhân viên
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

    // Hiển thị đơn xin nghĩ của nhân viên
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

    // Hiển thị tất cả đơn xin nghĩ nhân viên bên Admin
    getLeave = async(req, res) => {
        try {
            const leaves = await Leave.find().populate({
                path: "employeeId",
                populate: [
                    {
                        path: 'department',
                        select: 'dep_name'
                    },

                    {
                        path: 'userId',
                        select: 'name'
                    }
                ]
            })
            return res.status(200).json({success: true, leaves})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }
    }

    // Thông tin chi tiết đơn xin nghĩ
    getLeaveDetail = async (req, res) => {
        try {
            const {id} = req.params
            const leaves = await Leave.findById(id).populate({
                path: "employeeId",
                populate: [
                    {
                        path: 'department',
                        select: 'dep_name'
                    },

                    {
                        path: 'userId',
                        select: 'name profileImage'
                    }
                ]
            })
            // console.log('Leave Detail: ', leaves)
            return res.status(200).json({success: true, leaves})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }
    }
}
module.exports = new LeaveController()

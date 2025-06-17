const Attendance = require('../models/attendanceModel')
const Employee = require('../models/employeeModel')

class AttendanceController {
    //Hiển thị danh sách chấm công của nhân viên
    getAllAttendance = async(req, res) => {
        try {
            const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            const attendance = await Attendance.find({date}).populate({
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
            return res.status(200).json({success: true, attendance})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }       
    }

    //Cập nhật trạng thái chấm công của nhân viên
    updateAttendance = async(req, res) => {
        try {
            const { employeeId } = req.params;
            const { status } = req.body;
            const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const employee = await Employee.findOne({employeeId});

            const attendance = await Attendance.findOneAndUpdate({employeeId: employee._id, date}, {status}, {new: true})
            return res.status(200).json({success: true, message: 'Attendance updated successfully', attendance})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }
    }
}

module.exports = new AttendanceController()
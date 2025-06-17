const Attendance = require('../models/attendanceModel')

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
}

module.exports = new AttendanceController()
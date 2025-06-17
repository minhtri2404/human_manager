const Employee = require('../models/employeeModel')
const Attendance = require('../models/attendanceModel')

const defaultAttendance = async(req, res, next) => {
    try {
        const date = new Date().toISOString().split('T')[0];
        
        const existingAttendance = await Attendance.findOne({date})
        if(!existingAttendance) {
            const employees = await Employee.find();
            const attendance = employees.map(employee => ({
                date,
                employeeId: employee._id,
                status: null
            }));

            await Attendance.insertMany(attendance);
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message})
    }
}
module.exports = defaultAttendance;
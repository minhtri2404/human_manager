const mongoose = require("mongoose");
const Employee = require('../models/employeeModel')
const Leave = require('../models/leaveModel')
const Salary = require('../models/salaryModel')
const User = require('../models/userModel')
const Attendance = require('../models/attendanceModel')

const departmentSchema = new mongoose.Schema({
    dep_name:{type: String, required:true},
    description:{type: String},
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}

});

// Khi xóa phòng ban thì xóa luôn nhân viên, nghĩ phép, lương, chấm công của nhân viên trong phòng ban đó
departmentSchema.pre('deleteOne', {document: true, query: false},  async function(next) {
    try {
        // 1. Lấy danh sách nhân viên thuộc phòng ban này
        const employee = await Employee.find({department: this._id});

        // 2. Lấy ra các _id và userId của nhân viên
        const empId = employee.map(emp => emp._id);
        const userId = employee.map(emp => emp.userId).filter(id => id !== null);

        // 3. Xoá nhân viên
        await Employee.deleteMany({department: this._id});

        // 4. Xoá các bảng liên quan
        await Leave.deleteMany({employeeId: {$in: empId}});
        await Salary.deleteMany({employeeId: {$in: empId}});
        await Attendance.deleteMany({employeeId: {$in: empId}});

        // 5. Xoá tài khoản user liên quan
        await User.deleteMany({ _id: { $in: userId } });
        next();
    } catch (error) {
        next(error);
    }
})

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
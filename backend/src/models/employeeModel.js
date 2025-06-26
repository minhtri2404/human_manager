const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Leave = require('../models/leaveModel')
const Salary = require('../models/salaryModel')
const Attendance = require('../models/attendanceModel')


const employeeSchema = new mongoose.Schema({
   userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
   employeeId: {type: String, required: true, unique: true},
   dob: {type: Date},
   gender: {type: String},
   phone: {type: Number},
   designation: {type: String},
   department: {type: Schema.Types.ObjectId, ref: 'Department', required: true},
   salary: {type: Number, required: true},
   createdAt:{type: Date, default: Date.now},
   updatedAt:{type: Date, default: Date.now}
});

//Khi xóa nhân viên thì xóa luôn nghĩ phép,lương, chấm công
employeeSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const empId = this._id;

        // Xoá các bản ghi liên quan đến nhân viên
        await Leave.deleteMany({ employeeId: empId });
        await Salary.deleteMany({ employeeId: empId });
        await Attendance.deleteMany({ employeeId: empId });

        next();
    } catch (error) {
        next(error);
    }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
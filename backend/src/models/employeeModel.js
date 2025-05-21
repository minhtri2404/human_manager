const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
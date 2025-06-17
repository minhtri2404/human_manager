const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const AttendanceSchema = new Schema({
    date: {type: String, required: true}, // Format: YYYY-MM-DD
    employeeId: {type: Schema.Types.ObjectId, ref: 'Employee', required: true},
    status: {type: String, enum: ["Present", "Absent", "Sick", "Leave"], default: null},
})

const Attendance = mongoose.model('Attendance', AttendanceSchema)
module.exports = Attendance 

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController')
const authMiddleware = require('../middleware/authMiddleware')
const defaultAttendance = require('../middleware/defaultAttendance')

router.get('/', authMiddleware, defaultAttendance, attendanceController.getAllAttendance);
router.put('/update/:employeeId', authMiddleware, attendanceController.updateAttendance);

module.exports = router;
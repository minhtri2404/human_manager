const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/add', authMiddleware, leaveController.addLeave)

module.exports = router;
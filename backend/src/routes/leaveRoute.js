const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController')
const authMiddleware = require('../middleware/authMiddleware')

//User
router.post('/add', authMiddleware, leaveController.addLeave)
router.get('/:id', authMiddleware, leaveController.getAllLeave)

//Admin
router.get('/',authMiddleware, leaveController.getLeave)


module.exports = router;
const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController')
const authMiddleware = require('../middleware/authMiddleware')

router.put('/change-password', authMiddleware, settingController.changePassword)


module.exports = router;
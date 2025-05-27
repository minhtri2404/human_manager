const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/add', authMiddleware, salaryController.addSalary)


module.exports = router;
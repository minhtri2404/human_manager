const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/list', authMiddleware, employeeController.getAllEmployees);
router.post('/add', authMiddleware, employeeController.addEmployee)


module.exports = router;

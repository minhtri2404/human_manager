const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/', authMiddleware, employeeController.getAllEmployee)
router.post('/add', authMiddleware, employeeController.addEmployee)
router.get('/:id', authMiddleware, employeeController.getViewEmployee)
router.put('/edit/:id', authMiddleware, employeeController.updateEmployee)
router.delete('/:id', authMiddleware, employeeController.deleteEmployee)
router.get('/departments/:id', authMiddleware, employeeController.fetchEmployeesByDepId)

module.exports = router;

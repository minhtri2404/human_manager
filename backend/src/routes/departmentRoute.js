const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', authMiddleware, departmentController.getAllDepartment)
router.post('/add', authMiddleware, departmentController.addDepartment)
router.get('/:id', authMiddleware, departmentController.getDepartment)
router.put('/:id', authMiddleware, departmentController.updateDepartment)
router.delete('/:id', authMiddleware, departmentController.deleteDepartment)


module.exports = router;


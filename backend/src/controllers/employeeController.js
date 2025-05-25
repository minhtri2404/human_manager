const Employee = require('../models/employeeModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const upload = require('../middleware/uploadMiddleware')

class EmployeeController {

    //Xem toàn bộ danh sách nhân viên
    getAllEmployee = async (req, res) => {
        try {
            const employees = await Employee.find()
                .populate('userId', {password: 0})
                .populate('department')

            res.status(200).json({ success: true, data: employees });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    // Thêm nhân viên
    addEmployee = async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Image upload failed', error: err.message })
            }
            try {
                const {
                    name,
                    email,
                    employeeId,
                    dob,
                    gender,
                    phone,
                    designation,
                    department,
                    salary,
                    password,
                    role
                } = req.body

                const existingUser = await User.findOne({ email })
                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'Email already exists' })
                }

                const hashPassword = await bcrypt.hash(password, 10)

                const newUser = new User({
                    name,
                    email,
                    password: hashPassword,
                    role,
                    profileImage: req.file ? req.file.filename : ""
                })

                const savedUser = await newUser.save()

                const newEmployee = new Employee({
                    userId: savedUser._id,
                    employeeId,
                    dob,
                    gender,
                    phone,
                    designation,
                    department,
                    salary
                })

                await newEmployee.save()

                return res.status(200).json({ success: true, message: 'Employee added successfully' })
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
            }
        })
    }

    //Xem thông tin chi tiết của nhân viên
    getViewEmployee = async(req, res) => {
        try {
            const {id} = req.params
            const employee = await Employee.findById(id)
                .populate('userId', {password: 0})
                .populate('department')
            return res.status(200).json({success: true, employee})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message })
        }
    }

     // Sửa thông tin của nhân viên
    updateEmployee = async(req, res) => {
        try {
            const {id} = req.params
            const { name, phone, designation, department, salary} = req.body

            // Tìm nhân viên
            const emp = await Employee.findById(id)
            if (!emp) {
                return res.status(404).json({success: false, message: "Employee not found" })
            }

            // Tìm người dùng liên kết
            const user = await User.findById(emp.userId)
            if (!user) {
                return res.status(404).json({success: false, message: "User not found" })

            }

            // Cập nhật người dùng và nhân viên
            const updateUser = await User.findByIdAndUpdate(emp.userId, { name }, { new: true });
            const updateEmployee = await Employee.findByIdAndUpdate(id, {
                phone, designation, salary, department
            }, {new: true})

            if (!updateEmployee || !updateUser) {
                return res.status(404).json({success: false, message: "Failed to update records" })
            }
            return res.status(200).json({success: true, message: "Employee updated successfully ", updateEmployee, updateUser})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message })

        }
    }
}
module.exports = new EmployeeController()

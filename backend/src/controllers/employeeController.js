const Employee = require('../models/employeeModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const upload = require('../middleware/uploadMiddleware')

class EmployeeController {

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
}
module.exports = new EmployeeController()

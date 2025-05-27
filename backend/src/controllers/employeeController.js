const Employee = require('../models/employeeModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const upload = require('../middleware/uploadMiddleware')
const fs = require('fs') 
const path = require('path')

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
   updateEmployee = async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Image upload failed',
                    error: err.message
                });
            }

            try {
                const { id } = req.params;
                const { name, dob, salary, department } = req.body;

                // Tìm nhân viên
                const emp = await Employee.findById(id);
                if (!emp) {
                    return res.status(404).json({ success: false, message: 'Employee not found' });
                }

                // Tìm người dùng liên kết
                const user = await User.findById(emp.userId);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                // Cập nhật tên người dùng
                user.name = name;
                if (req.file) {
                    user.profileImage = req.file.filename; // Nếu có ảnh mới
                }
                await user.save();

                // Cập nhật thông tin nhân viên
                emp.dob = dob;
                emp.salary = salary;
                emp.department = department;
                await emp.save();

                return res.status(200).json({
                    success: true,
                    message: 'Employee updated successfully',
                    employee: emp,
                    user: user
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: error.message
                });
            }
        });
    };

    //Xóa nhân viên
    deleteEmployee = async(req, res) => {
        try {
            const {id} = req.params

            // Tìm nhân viên
            const employee = await Employee.findById(id)
            if (!employee){
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }

            //Tìm người dùng liên kết
            const user = await User.findById(employee.userId)
            if(user){
                console.log("User:", user)
                console.log("Ảnh profile:", user.profileImage)

                if(user.profileImage){
                    const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', user.profileImage);
                    console.log("Đường dẫn ảnh cần xóa:", imagePath)

                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath); // Xóa file ảnh
                        console.log("==> Ảnh đã được xóa:", user.profileImage);
                    } else{
                        console.log("==> Ảnh KHÔNG tồn tại:", imagePath);

                    }   
                }
                //Xóa người dùng
                await User.findByIdAndDelete(employee.userId)
            }

            //Xóa nhân viên
            await Employee.findByIdAndDelete(id)
            return res.status(200).json({success: true, message: 'Xóa người dùng thành công'})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }
    }

    fetchEmployeesByDepId = async(req, res) => {
        try {
            const {id} = req.params
            const employees = await Employee.find({department: id})
            
            return res.status(200).json({success: true, employees})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message })
        }   
    }
}
module.exports = new EmployeeController()

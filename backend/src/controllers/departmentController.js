const Department = require('../models/departmentModel')

class DepartmentController {

    getAllDepartment = async(req, res) => {
        try {
            const departments = await Department.find()
            return res.status(200).json({success: true, departments})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})

        }
    }

    addDepartment = async(req, res) =>{
        try {
            const {dep_name, description} = req.body
            if (!dep_name || !description) {
                return res.status(400).json({ success: false, error: 'Tên phòng ban và mô tả không được để trống' })
            }  
            const newDepartment = new Department({ 
                dep_name, description 
            }) 
            await newDepartment.save()
            return res.status(201).json({success: true, department: newDepartment})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    getDepartment = async(req, res) => {
        try {
            const {id} = req.params
            const department = await Department.findById(id)
            return res.status(200).json({success: true, department})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    updateDepartment = async(req, res) => {
        try {
            const {id} = req.params
            const {dep_name, description} = req.body
            if (!dep_name || !description) {
                return res.status(400).json({ success: false, error: 'Tên phòng ban và mô tả không được để trống' })
            }           
            const updateDep = await Department.findByIdAndUpdate(id, 
                { dep_name, description },
                {new: true}
            )
            return res.status(200).json({success: true, updateDep})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }

    deleteDepartment = async(req, res) => {
        try {
            const {id} = req.params
            const deleteDep = await Department.findByIdAndDelete(id)
            return res.status(200).json({success: true, deleteDep})

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
}

module.exports = new DepartmentController()
const Employee = require('../models/employeeModel')
const Department = require('../models/departmentModel')
const Leave = require('../models/leaveModel')
const Salary = require('../models/salaryModel')


class DashboardController{
    getSummary = async (req, res) => {
        try {
            const totalEmployee = await Employee.countDocuments()
            const totalDepartment = await Department.countDocuments()
            
            // 👉 Tính tổng toàn bộ netSalary từ collection Salary
            const totalSalary = await Salary.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$netSalary" }
                }
            }
            ])
            // 👉 Lấy danh sách employeeId đã nộp đơn nghỉ phép
            const empAppliedLeave = await Leave.distinct('employeeId')

            // 👉 Tính số lượng đơn nghỉ phép theo status
            const leaveStatus = await Leave.aggregate([
                {$group: {
                    _id: "$status",
                    count: { $sum: 1}
                }}
            ])

            const leaveSummary = {
                appliedFor: empAppliedLeave.length,
                approved: leaveStatus.find(item => item._id === "Approved")?.count || 0, 
                rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0, 
                pending: leaveStatus.find(item => item._id === "Pending")?.count || 0, 
            }

            return res.status(200).json({
                success: true,
                message: 'Dashboard summary fetched successfully',
                totalEmployee,
                totalDepartment,
                totalSalarys: totalSalary[0]?.total || 0,
                leaveSummary
            })
        } catch (error) {
            return res.status(500).json({success: false, message: 'Internal server error', error: error.message})
        }
    }
}

module.exports = new DashboardController()
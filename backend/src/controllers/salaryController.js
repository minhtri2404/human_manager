const Salary = require('../models/salaryModel')

class SalaryController {
    addSalary = async (req, res) => {
        try {
            const {employeeId, basicSalary, allowances, deductions, payDate} = req.body

            // Kiểm tra đầu vào bắt buộc
            if (!employeeId || !basicSalary || !payDate) {
                return res.status(400).json({success: false, message: 'employeeId, basicSalary và payDate là bắt buộc'});
            }
            const totalSalary = parseFloat(
                (parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(deductions)).toFixed(2)
            );
            
            const newSalary = new Salary({
                employeeId,
                basicSalary,
                allowances,
                deductions,
                netSalary: totalSalary,
                payDate
            })

            await newSalary.save()
            return res.status(200).json({success: true, message: "Thêm lương thành công"})
        } catch (error) {
            return res.status(500).json({success: false, message: 'Inter server error', error: error.message})
        }
    }

    getSalary = async (req, res) => {
        try {
            const { id } = req.params;

            const salary = await Salary.find({ employeeId: id })
                .populate('employeeId', 'employeeId salary'); // tuỳ bạn muốn hiển thị thêm gì

            if (!salary || salary.length === 0) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy lương cho nhân viên này' });
            }

            return res.status(200).json({ success: true, salary });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
        }
    };

}

module.exports = new SalaryController()
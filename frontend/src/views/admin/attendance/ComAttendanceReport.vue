<template>
  <v-container>
    <h2 class="text-center text-2xl font-bold my-4">Attendance Report</h2>

    <!-- Bộ lọc ngày -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="2">
        <v-label class="font-weight-bold mb-1">Filter by Date</v-label>
        <v-text-field
          type="date"
          v-model="dateFilter"
          @change="onDateChange"
          dense
          hide-details
          variant="outlined"
        />
      </v-col>
    </v-row>

    <!-- Vòng qua từng ngày -->
    <div v-for="(records, date) in report" :key="date" class="mb-6">
      <h3 class="text-xl font-semibold mb-2">{{ formatDate(date) }}</h3>

      <!-- Bảng dữ liệu -->
      <v-table density="compact" class="border">
        <thead>
          <tr>
            <th class="text-left">S.No</th>
            <th class="text-left">Mã nhân viên</th>
            <th class="text-left">Tên</th>
            <th class="text-left">Phòng ban</th>
            <th class="text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, i) in records" :key="record.employeeId">
            <td>{{ i + 1 }}</td>
            <td>{{ record.employeeId }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.department }}</td>
            <td>{{ record.status }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <!-- Các nút hành động -->
    <v-row class="mt-4" justify="center" align="center">
      <v-btn color="primary" class="mr-2" @click="handleLoadMore">Load More</v-btn>
      <v-btn color="success" class="ml-2" @click="exportToExcel">Xuất Excel</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const report = ref({})
const limit = ref(5)
const skip = ref(0)
const dateFilter = ref('')

// Gọi API
const fetchReport = async () => {
  try {
    const params = new URLSearchParams({
      limit: limit.value,
      skip: skip.value
    })
    if (dateFilter.value) {
      params.append('date', dateFilter.value)
    }

    const res = await axios.get(`http://localhost:4000/api/attendances/report?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (res.data.success) {
      const newData = res.data.groupData
      if (skip.value === 0) {
        report.value = newData
      } else {
        report.value = { ...report.value, ...newData }
      }
    }
  } catch (err) {
    alert(err.message)
  }
}

// Chọn ngày mới -> reset skip về 0 và fetch lại
const onDateChange = () => {
  skip.value = 0
  fetchReport()
}

// Nhấn nút Load More -> tăng skip và fetch
const handleLoadMore = () => {
  skip.value += limit.value
  fetchReport()
}

// Hàm định dạng ngày dd-MM-yyyy
const formatDate = (inputDate) => {
  const date = new Date(inputDate)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Xuất file Excel
const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Attendance Report')

  // Dòng tiêu đề
  sheet.mergeCells('A1', 'E1')
  sheet.getCell('A1').value = 'BÁO CÁO CHẤM CÔNG'
  sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
  sheet.getCell('A1').font = { size: 16, bold: true }

  // Header
  sheet.addRow(['S.No', 'Mã nhân viên', 'Tên', 'Phòng ban', 'Trạng thái'])
  sheet.getRow(2).font = { bold: true }
  sheet.columns = [
    { key: 'sno', width: 6 },
    { key: 'employeeId', width: 15 },
    { key: 'name', width: 20 },
    { key: 'department', width: 20 },
    { key: 'status', width: 15 }
  ]

  // Ghi dữ liệu
  let rowIndex = 3
  Object.entries(report.value).forEach(([date, records]) => {
    sheet.addRow([`Ngày ${formatDate(date)}`])
    sheet.mergeCells(`A${rowIndex}:E${rowIndex}`)
    sheet.getCell(`A${rowIndex}`).font = { italic: true }
    rowIndex++

    records.forEach((record, index) => {
      sheet.addRow([
        index + 1,
        record.employeeId,
        record.name,
        record.department,
        record.status
      ])
      rowIndex++
    })

    // Dòng trống giữa mỗi ngày
    sheet.addRow([])
    rowIndex++
  })

  // Viền bảng
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
  })

  // Xuất file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `Attendance_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
}

onMounted(fetchReport)
</script>

<style scoped>
.text-left {
  text-align: left;
}
</style>

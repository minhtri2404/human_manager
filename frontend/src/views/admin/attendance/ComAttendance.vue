<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Tiêu đề-->
        <div class="text-center my-4">
          <h2>Manager Attendance</h2>
          <p class="mt-2">Mark Employees for {{ today }}</p>
        </div>

        <!-- Thanh tìm kiếm và nút thêm -->
        <v-row class="mb-4" justify="space-between" align="center">
          <v-col cols="6" md="4">
            <v-text-field v-model="search" label="Search by Name" dense hide-details />
          </v-col>

          <v-col cols="12" md="4" class="text-right">
            <RouterLink to="/admin-dashboard/attendance-report">
              <v-btn color="teal" dark>Attendance Report</v-btn>
            </RouterLink>
          </v-col>
        </v-row>

        <!-- Bảng chấm công -->
        <v-data-table
            :headers="headers"
            :items="filteredAttendance"
            :loading="loading"
            loading-text="Loading attendance..."
            class="elevation-1"
        >
          <!-- HIỂN THỊ HEADER -->
          <template v-slot:headers="{ columns }">
            <tr>
              <th v-for="column in columns" :key="column.key" :style="column.key === 'action' ? 'text-align: center' : ''">
                {{ column.text }}
              </th>
            </tr>
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.sno }}</td>
              <td>{{ item.employeeId }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.department }}</td>
              <!-- Cột Trạng thái -->
              <td>
                <v-chip v-if="item.status" :color="getStatusColor(item.status)" dark small>
                  {{ item.status }}
                </v-chip>
                <span v-else class="text-grey">Chưa chấm</span>
              </td>
              <!-- Cột Hành động -->
              <td class="text-center">
                <template v-if="!item.status">
                  <v-btn size="small" color="green" @click="markAttendance(item.employeeId, 'Present')">Present</v-btn>
                  <v-btn size="small" color="red" @click="markAttendance(item.employeeId, 'Absent')">Absent</v-btn>
                  <v-btn size="small" color="blue" @click="markAttendance(item.employeeId, 'Sick')">Sick</v-btn>
                  <v-btn size="small" color="orange" @click="markAttendance(item.employeeId, 'Leave')">Leave</v-btn>
                </template>
                <template v-else>
                  <span class="text-grey">Đã chấm</span>
                </template>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const attendance = ref([]);
const search = ref('');
const loading = ref('');
const now = new Date();
const today = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

const headers = [
  { text: 'S.No', key: 'sno', width: '60px'},
  { text: 'Mã Nhân Viên', key: 'employeeId' },
  { text: 'Tên', key: 'name' },
  { text: 'Phòng ban', key: 'department' },
  { text: 'Trạng thái', key: 'status' },
  { text: 'Hành động', key: 'action', sortable: false }
];

// Hàm gọi APi Lấy danh sách chấm công
const fetchAttendance = async () => {
    loading.value = true;
    try {
      const res = await axios.get('http://localhost:4000/api/attendances', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })

    if(res && res.data && Array.isArray(res.data.attendance)){
        attendance.value = res.data.attendance.map((att, index) =>({
            sno: index + 1,
            employeeId: att.employeeId?.employeeId || 'N/A',
            name: att.employeeId?.userId?.name || 'N/A',
            department: att.employeeId?.department?.dep_name || 'N/A',
            status: att.status,
            _id: att._id // dùng nếu cần update attendance

        }))
    }
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to fetch attendance')
    } finally {
    loading.value = false
    }
}

// Hàm đánh dấu trạng thái chấm công
const markAttendance = async (employeeId, status) => {
  try {
    const res = await axios.put(`http://localhost:4000/api/attendances/update/${employeeId}`, {status}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (res.data.success) {
      alert(`Đã chấm công ${status} cho mã nhân viên: ${employeeId}`)
      fetchAttendance() // Cập nhật lại danh sách chấm công sau khi đánh dấu
    } else {
      alert('Failed to mark attendance')
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Error marking attendance')
  }
}
// Lọc theo tên nhân viên
const filteredAttendance = computed(() =>
  attendance.value.filter(emp =>
    emp.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

// Đổi màu theo status
const getStatusColor = (status) => {
  switch (status) {
    case 'Present': return 'green'
    case 'Absent': return 'red'
    case 'Sick': return 'blue'
    case 'Leave': return 'orange'
    default: return 'grey'
  }
}

onMounted(fetchAttendance)
</script>


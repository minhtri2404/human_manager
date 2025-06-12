<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Tiêu đề -->
        <div class="text-center my-4">
          <h2>Manager Leave</h2>
        </div>

        <!-- Thanh tìm kiếm và bộ lọc trạng thái -->
        <v-row class="mb-4" justify="space-between" align="center">
          <v-col cols="6" md="4">
            <v-text-field v-model="search" label="Search by Name" dense hide-details />
          </v-col>

          <v-col cols="12" md="6" class="text-right">
            <v-btn color="blue" class="mx-1" @click="filterStatus('All')">All</v-btn>
            <v-btn color="orange" class="mx-1" @click="filterStatus('Pending')">Pending</v-btn>
            <v-btn color="green" class="mx-1" @click="filterStatus('Approved')">Approved</v-btn>
            <v-btn color="red" class="mx-1" @click="filterStatus('Rejected')">Rejected</v-btn>
          </v-col>
        </v-row>

        <!-- Bảng danh sách đơn xin nghỉ -->
        <v-data-table
          :headers="headers"
          :items="filteredLeaves"
          :loading="loading"
          loading-text="Loading leaves..."
          item-value="id"
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
              <td>{{ item.leaveType }}</td>
              <td>{{ item.department }}</td>
              <td>{{ item.days }}</td>
              <td>{{ item.status }}</td>
              <td class="text-center">
                <v-btn size="small" color="teal" @click="viewLeave(item.id)">View</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const leaves = ref([])
const loading = ref(false)
const search = ref('')
const selectedStatus = ref('')

const headers = [
  { text: 'S.No', key: 'sno', width: '60px' },
  { text: 'Mã Nhân Viên', key: 'employeeId' },
  { text: 'Tên', key: 'name' },
  { text: 'Loại Phép', key: 'leaveType' },
  { text: 'Phòng Ban', key: 'department' },
  { text: 'Số Ngày Nghỉ', key: 'days' },
  { text: 'Trạng Thái', key: 'status' },
  { text: 'Hành Động', key: 'action', sortable: false }
]

const fetchLeaves = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:4000/api/leaves', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (res && res.data && Array.isArray(res.data.leaves)) {
      leaves.value = res.data.leaves.map((leave, index) => {
        const startDate = new Date(leave.startDate)
        const endDate = new Date(leave.endDate)
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

        return {
          id: leave._id,
          sno: index + 1,
          employeeId: leave.employeeId?.employeeId || 'N/A',
          name: leave.employeeId?.userId?.name || 'N/A',
          leaveType: leave.leaveType,
          department: leave.employeeId?.department?.dep_name || 'N/A',
          days,
          status: leave.status,
        }
      })
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to fetch leaves')
  } finally {
    loading.value = false
  }
}

const filterStatus = (status) => {
  selectedStatus.value = status === 'All' ? '' : status
}

const filteredLeaves = computed(() => {
  return leaves.value.filter((leave) => {
    const matchesName = leave.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = selectedStatus.value ? leave.status === selectedStatus.value : true
    return matchesName && matchesStatus
  })
})

const viewLeave = (id) => {
  router.push(`/admin-dashboard/leave/${id}`)
}

onMounted(fetchLeaves)
</script>

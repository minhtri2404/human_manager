<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Tiêu đề -->
        <div class="text-center my-4">
          <h2>My Leave Requests</h2>
        </div>

        <!-- Tìm kiếm và Thêm mới -->
        <v-row class="mb-4" justify="space-between" align="center">
          <v-col cols="6" md="4">
            <v-text-field
              v-model="search"
              label="Search by Reason"
              dense
              hide-details
            />
          </v-col>

          <v-col cols="12" md="4" class="text-right">
            <RouterLink to="/employee-dashboard/add-leave">
              <v-btn color="teal" dark>ADD NEW LEAVE</v-btn>
            </RouterLink>
          </v-col>
        </v-row>

        <!-- Bảng dữ liệu -->
        <v-data-table
          :headers="headers"
          :items="filteredLeaves"
          :loading="loading"
          loading-text="Loading leaves..."
          item-value="id"
          class="elevation-1"
        >
          <!-- Hiển thị header -->
          <template v-slot:headers="{ columns }">
            <tr>
              <th v-for="column in columns" :key="column.key" class="text-left">
                {{ column.text }}
              </th>
            </tr>
          </template>

          <!-- Hiển thị từng dòng -->
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.sno }}</td>
              <td>{{ item.leaveType }}</td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.endDate }}</td>
              <td>{{ item.reason }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" text>No leave records found.</v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuth } from '@/auth/userAuth';

const { user } = useAuth()
const leaves = ref([])
const loading = ref(false)
const search = ref('')

const headers = [
  { text: 'S.No', key: 'sno', width: '60px' },
  { text: 'Leave Type', key: 'leaveType' },
  { text: 'From', key: 'startDate' },
  { text: 'To', key: 'endDate' },
  { text: 'Description', key: 'reason' },
  { text: 'Status', key: 'status' }
]


// Gọi API để lấy danh sách leave
const fetchLeaves = async () => {
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:4000/api/leaves/${user.value._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      leaves.value = res.data.leaves.map((leave, index) => ({
        id: leave._id,
        sno: index + 1,
        leaveType: leave.leaveType,
        startDate: new Date(leave.startDate).toLocaleDateString(),
        endDate: new Date(leave.endDate).toLocaleDateString(),
        reason: leave.reason,
        status: leave.status
      }))
    }
  } catch (error) {
    alert('Failed to fetch leaves')
  } finally {
    loading.value = false
  }
}

// Lọc theo lý do
const filteredLeaves = computed(() =>
  leaves.value.filter(leave =>
    leave.reason.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(fetchLeaves)
</script>

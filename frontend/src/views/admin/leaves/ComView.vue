<template>
  <v-container class="mt-10">
    <v-card class="pa-6" >
      <v-card-title class="text-h5 text-center">Leave Details</v-card-title>

      <v-row class="mt-4" v-if="leave">
        <v-col cols="12" md="4">
          <v-img
            :src="`http://localhost:4000/uploads/${leave.employeeId.userId.profileImage}`"
            class="rounded-circle"
            max-width="300"
            aspect-ratio="1"
            cover
          />
        </v-col>

        <v-col cols="12" md="8">
          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Name:</v-col>
            <v-col cols="8">{{ leave.employeeId.userId.name }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Employee ID:</v-col>
            <v-col cols="8">{{ leave.employeeId.employeeId }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Leave Type:</v-col>
            <v-col cols="8">{{ leave.leaveType }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Reason:</v-col>
            <v-col cols="8">{{ leave.reason }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Department:</v-col>
            <v-col cols="8">{{ leave.employeeId.department.dep_name }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Start Date:</v-col>
            <v-col cols="8">{{ formatDate(leave.startDate) }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">End Date:</v-col>
            <v-col cols="8">{{ formatDate(leave.endDate) }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">
              {{ leave.status === 'Pending' ? 'Action:' : 'Status:' }}
            </v-col>
            <v-col cols="8">
              <div v-if="leave.status === 'Pending'" class="d-flex" style="gap: 12px">
                <v-btn color="green" @click="changeStatus(leave._id, 'Approved')">Approve</v-btn>
                <v-btn color="red" @click="changeStatus(leave._id, 'Rejected')">Reject</v-btn>
              </div>
              <div v-else>
                <v-chip :color="statusColor(leave.status)" dark>{{ leave.status }}</v-chip>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-alert type="info" v-else>Loading leave data...</v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const leave = ref(null)

const fetchLeave = async () => {
  try {
    const res = await axios.get(`http://localhost:4000/api/leaves/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      leave.value = res.data.leaves
    }
  } catch (err) {
    alert(err.response?.data?.error || 'Failed to load leave details')
  }
}

// Cập nhật đơn xin nghỉ
const changeStatus = async(id, status) => {
  try {
    const res = await axios.put(`http://localhost:4000/api/leaves/${id}`, {status},{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      alert('Duyêt đơn thành công')
      router.push('/admin-dashboard/leave')
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error)
    } else{
      alert('Lỗi không xác định!')
    }
  }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString()
}

const statusColor = (status) => {
  switch (status) {
    case 'Pending': return 'orange'
    case 'Approved': return 'green'
    case 'Rejected': return 'red'
    default: return 'grey'
  }
}

onMounted(fetchLeave)
</script>

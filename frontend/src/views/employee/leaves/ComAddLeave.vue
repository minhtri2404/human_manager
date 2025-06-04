<template>
  <v-container class="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-6">Add Employee</h2>

    <v-form @submit.prevent="handleSubmit" ref="formRef">
      <v-row class="mb-4">
        <v-col cols="12">
          <v-select
            v-model="leave.leaveType"
            :items="['Sick Leave', 'Casual Leave', 'Annual Leave']"
            label="Leaves Type"
            required
            dense
          />
        </v-col>
      </v-row>

      <v-row class="mb-4" :class="{ 'gap-4': true }">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="leave.startDate"
            label="From Date"
            type="date"
            required
            dense
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="leave.endDate"
            label="To Date"
            type="date"
            required
            dense
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="leave.reason"
            label="Description"
            placeholder="Reason"
            required
            rows="3"
            dense
          />
        </v-col>
      </v-row>

      <v-btn
        type="submit"
        color="teal"
        class="white--text"
        block
        depressed
        rounded
      >
        Add Leaves
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/auth/userAuth';

const { user } = useAuth();

const router = useRouter()

const leave = ref({
  userId: user.value?._id || '',  // lấy userId ở đây
  leaveType: '',
  startDate: '',
  endDate: '',
  reason: ''
})

const handleSubmit = async () => {

  try {
    const response = await axios.post('http://localhost:4000/api/leaves/add', leave.value ,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (response.data.success) {
        alert('Tạo đơn nghĩ thành công')
        router.push('/employee-dashboard/leave')
    }
  } catch (error) {
        alert('Tạo đơn nghĩ thất bại')
  }
}
</script>

<style scoped>
.max-w-4xl {
  max-width: 48rem; /* 768px */
}
</style>
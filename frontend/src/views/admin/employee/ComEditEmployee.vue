<template>
  <v-container class="mt-10" max-width="700">
    <v-card class="pa-6">
      <v-card-title class="text-h5 d-flex justify-center font-weight-bold">Edit Employee</v-card-title>
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field label="Name" v-model="employee.name" required></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field label="Phone" v-model="employee.phone" type="tel" required></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field label="Designation" v-model="employee.designation" required></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field label="Salary" v-model.number="employee.salary" type="number" required></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-select
              label="Department"
              :items="departments"
              item-title="dep_name"
              item-value="_id"
              v-model="employee.department"
              required
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-btn type="submit" color="teal" class="text-white" block>Edit Employee</v-btn>
          </v-col>
        </v-row>
      </v-form>
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

const employee = ref({
  name: '',
  phone: '',
  designation: '',
  salary: 0,
  department: ''
})

const departments = ref([])

const fetchDepartments = async () => {
  try {
    const res = await axios.get('http://localhost:4000/api/departments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (res.data.success) {
      departments.value = res.data.departments
    }
  } catch (error) {
    console.error('Failed to fetch departments', error)
  }
}

const fetchEmployee = async () => {
  try {
    const res = await axios.get(`http://localhost:4000/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (res.data.success) {
      const emp = res.data.employee
      employee.value.name = emp.userId.name
      employee.value.phone = emp.phone
      employee.value.designation = emp.designation
      employee.value.salary = emp.salary
      employee.value.department = emp.department
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to load employee')
  }
}

const handleSubmit = async () => {
  // Kiểm tra dữ liệu đầu vào
  if (!employee.value.name || !employee.value.phone) {
    alert('Vui lòng nhập đầy đủ tên phòng ban và mô tả')
    return // dừng không gửi request nếu thiếu dữ liệu
  }
  try {
    const res = await axios.put(`http://localhost:4000/api/employees/edit/${id}`, employee.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (res.data.success) {
      alert('Cập nhật thành công')
      router.push('/admin-dashboard/employee')
    }
  } catch (error) {
    alert('Cập nhật thất bại')
  }
}

onMounted(() => {
  fetchDepartments()
  fetchEmployee()
})
</script>
<style scoped>
.mt-10 {
  margin-top: 40px;
}
</style>
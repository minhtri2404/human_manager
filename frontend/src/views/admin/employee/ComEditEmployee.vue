<template>
  <v-container class="mt-10" max-width="700">
    <v-card class="pa-6 elevation-2">
      <v-card-title class="text-h5 text-center font-weight-bold">Edit Employee</v-card-title>
      <v-form @submit.prevent="handleSubmit">
        <v-row dense>
          <!-- Name -->
          <v-col cols="12" md="6">
            <v-text-field label="Name" v-model="formData.name" required />
          </v-col>

          <!-- DOB -->
          <v-col cols="12" md="6">
            <v-text-field label="Date of Birth" v-model="formData.dob" type="date" required />
          </v-col>

          <!-- Salary -->
          <v-col cols="12" md="6">
            <v-text-field label="Salary" v-model="formData.salary" type="number" required />
          </v-col>

          <!-- Department -->
          <v-col cols="12" md="6">
            <v-select
              label="Department"
              :items="departments"
              item-title="dep_name"
              item-value="_id"
              v-model="formData.department"
              required
            />
          </v-col>

          <!-- Image -->
          <v-col cols="12" md="12">
            <v-file-input
              label="Upload New Image"
              v-model="formData.image"
              accept="image/*"
              prepend-icon=""
            />
          </v-col>
        </v-row>

        <v-btn type="submit" color="teal" class="mt-6" block>Update Employee</v-btn>
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

const formData = ref({
  name: '',
  dob: '',
  salary: '',
  department: '',
  image: null,
})
const oldImage = ref('') // Giữ lại ảnh cũ

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
      formData.value.name = emp.userId.name
      formData.value.dob = emp.dob ? new Date(emp.dob).toISOString().substr(0, 10) : ''
      formData.value.salary = emp.salary
      formData.value.department = emp.department
      oldImage.value = emp.image // Lưu lại ảnh cũ
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to load employee')
  }
}

const handleSubmit = async () => {
  const data = new FormData()
  data.append('name', formData.value.name)
  data.append('dob', formData.value.dob)
  data.append('salary', formData.value.salary)
  data.append('department', formData.value.department)

  // Nếu có ảnh mới thì gửi, nếu không thì gửi ảnh cũ
  if (formData.value.image) {
    data.append('image', formData.value.image)
  } else {
    data.append('oldImage', oldImage.value)
  }

  try {
    const res = await axios.put(`http://localhost:4000/api/employees/edit/${id}`, data, {
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

<template>
  <v-container class="mt-10">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5 d-flex justify-center">Edit Department</v-card-title>
          <v-form @submit.prevent="handleSubmit" ref="form">
            <v-text-field
              label="Department Name"
              v-model="department.dep_name"
              name="dep_name"
              required
              :rules="[v => !!v || 'Department name is required']"
            />
            <v-textarea
              label="Description"
              v-model="department.description"
              name="description"
              rows="4"
              :rules="[v => !!v || 'Description is required']"
            />

            <v-btn type="submit" color="teal" class="mt-4" block>
              Update Department
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()   // để lấy id từ URL
const router = useRouter() // để chuyển hướng sau khi submit
const department = ref({ 
    dep_name: '', 
    description: '' 
})
const id = route.params.id

const getDepartment = async () => {
  try {
    const res = await axios.get(`http://localhost:4000/api/departments/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (res.data.success) {
      department.value = res.data.department
    }
  } catch (err) {
    alert('Lỗi khi tải dữ liệu phòng ban')
  }
}

const handleSubmit = async () => {
  // Kiểm tra dữ liệu đầu vào
  if (!department.value.dep_name || !department.value.description) {
    alert('Vui lòng nhập đầy đủ tên phòng ban và mô tả')
    return // dừng không gửi request nếu thiếu dữ liệu
  }
  
  try {
    const res = await axios.put(`http://localhost:4000/api/departments/${id}`,department.value,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    if (res.data.success) {
      alert('Cập nhật thành công')
      // Sau khi cập nhật xong, điều hướng lại trang danh sách phòng ban
      router.push('/admin-dashboard/department')
    } else{
      alert('Có lỗi xảy ra khi cập nhật phòng ban!')
    }
  } catch (err) {
    alert('Cập nhật thất bại')
  }
}

onMounted(() => {
  getDepartment()
})
</script>

<template>
  <v-container class="mt-10">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5 d-flex justify-center">Add Department</v-card-title>
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
              Add Department
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const department = ref({
  dep_name: '',
  description: ''
})

const handleSubmit = async () => {
  // Kiểm tra xem form có hợp lệ không trước khi gửi
  if (!department.value.dep_name || !department.value.description) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  try {
    // Gửi request POST để thêm dữ liệu phòng ban mới
    const res = await axios.post('http://localhost:4000/api/departments/add', department.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Kiểm tra nếu API trả về thành công
    if (res.data.success) {
      alert('Phòng ban đã được thêm thành công!');
      // Sau khi thêm xong, điều hướng lại trang danh sách phòng ban
      router.push('/admin-dashboard/department');
    } else {
      alert('Có lỗi xảy ra khi thêm phòng ban!');
    }
  } catch (error) {
    console.error('Lỗi khi gửi request:', error);
    // Kiểm tra lỗi từ API
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert('Đã xảy ra lỗi không xác định, vui lòng thử lại sau.');
    }
  }
}

</script>

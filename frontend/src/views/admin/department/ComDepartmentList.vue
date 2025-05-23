<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Căn giữa tiêu đề -->
        <div class="text-center my-4">
          <h2>Manager Department</h2>
        </div>

        <!-- Thanh tìm kiếm và nút -->
        <v-row class="mb-4" justify="space-between" align="center" >
          <v-col cols="6" md="4">
            <v-text-field v-model="search" label="Search by Name" dense hide-details />
          </v-col>

          <v-col cols="12" md="4" class="text-right">
            <RouterLink to="/admin-dashboard/add-department">
              <v-btn color="teal" dark> ADD NEW DEPARTMENT </v-btn>
            </RouterLink>
          </v-col>
        </v-row>

        <!-- Bảng dữ liệu -->
        <v-data-table
          :headers="headers"
          :items="filteredDepartments"
          :loading="loading"
          loading-text="Loading..."
          item-value="id"
          class="elevation-1"
        >
        <template v-slot:headers="{ columns }">
            <tr>
              <th v-for="column in columns" :key="column.key" :style="column.key === 'action' ? 'text-align: center' : ''">
                {{ column.text }}
              </th>
            </tr>
          </template>

          <!-- Custom row -->
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.sno }}</td>
              <td>{{ item.dep_name }}</td>
              <td>
                <v-btn color="green" size="small" @click="editDepartment(item.id)">Edit</v-btn>
                <v-btn color="red" size="small" @click="deleteDepartment(item.id)">Delete</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const departments = ref([])
const loading = ref(false)
const search = ref('')

const headers = [
  { text: 'S No', key: 'sno' },
  { text: 'Department', key: 'dep_name' },
  { text: 'Actions', key: 'actions', sortable: false }
]

const fetchDepartments = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:4000/api/departments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (res && res.data && Array.isArray(res.data.departments)) {
      departments.value = res.data.departments.map((dep, index) => ({
        id: dep._id,
        sno: index + 1,
        dep_name: dep.dep_name
      }))
    } else {
      console.error('Dữ liệu không hợp lệ: res.data.departments không phải là một mảng');
    }
  } catch (error) {
    console.error('Có lỗi trong việc gọi API:', error);
    alert(error.response?.data?.error || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
  } finally {
    loading.value = false
  }
}

const editDepartment = (id) => {
  router.push(`/admin-dashboard/department/${id}`)
}

const deleteDepartment = async (id) => {
  const confirmDelete = confirm('Bạn có muốn xóa phòng ban này không')
  if (confirmDelete) {
    try {
      const res = await axios.delete(`http://localhost:4000/api/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.data.success){
        alert('Xóa thành công!')
        // Cập nhật lại danh sách phòng ban sau khi xóa
        await fetchDepartments()
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa phòng ban!')
    }
  }
}

const filteredDepartments = computed(() =>
  departments.value.filter(dep =>
    dep.dep_name.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(fetchDepartments)
</script>

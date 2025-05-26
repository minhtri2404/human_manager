<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Tiêu đề-->
        <div class="text-center my-4">
          <h2>Manager Employee</h2>
        </div>

        <!-- Thanh tìm kiếm và nút thêm -->
        <v-row class="mb-4" justify="space-between" align="center">
          <v-col cols="6" md="4">
            <v-text-field v-model="search" label="Search by Name" dense hide-details />
          </v-col>

          <v-col cols="12" md="4" class="text-right">
            <RouterLink to="/admin-dashboard/add-employee">
              <v-btn color="teal" dark>ADD NEW EMPLOYEE</v-btn>
            </RouterLink>
          </v-col>
        </v-row>

        <!-- Bảng danh sách nhân viên -->
        <v-data-table
          :headers="headers"
          :items="filteredEmployees"
          :loading="loading"
          loading-text="Loading employees..."
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
              <td>{{ item.name }}</td>
              <td>
                <v-avatar size="30">
                  <v-img :src="`http://localhost:4000/uploads/${item.profileImage}`" />
                </v-avatar>
              </td>
              <td>{{ item.dep_name }}</td>
              <td>{{ item.dob }}</td>
              <td class="text-center">
                <v-btn size="small" color="green" @click="viewEmployee(item.id)">View</v-btn>
                <v-btn size="small" color="orange">Salary</v-btn>
                <v-btn size="small" color="teal">Leave</v-btn>
                <v-btn size="small" color="blue" @click="editEmployee(item.id)">Edit</v-btn>
                <v-btn size="small" color="red" @click="deleteEmployee(item.id)">Delete</v-btn>
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
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const employees = ref([])
const loading = ref(false)
const search = ref('')

const headers = [
  { text: 'S.No', key: 'sno', width: '60px' },
  { text: 'Name', key: 'name' },
  { text: 'Image', key: 'profileImage' },
  { text: 'Department', key: 'dep_name' },
  { text: 'DOB', key: 'dob' },
  { text: 'Action', key: 'action' , sortable: false }
]

const fetchEmployees = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:4000/api/employees', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (res && res.data && Array.isArray(res.data.data)) {
      employees.value = res.data.data.map((emp, index) => ({
        id: emp._id,
        sno: index + 1,
        name: emp.userId.name,
        profileImage: emp.userId.profileImage,
        dep_name: emp.department?.dep_name || 'N/A',
        dob: new Date(emp.dob).toLocaleDateString()
      }))
    }
  } catch (err) {
    alert(err.response?.data?.error || 'Failed to fetch employees')
  } finally {
    loading.value = false
  }
}

const viewEmployee = (id) => {
  router.push(`/admin-dashboard/employee/${id}`)
}

const editEmployee = (id) => {
  router.push(`/admin-dashboard/employee/edit/${id}`)

}

const deleteEmployee = async (id) => {
  const confirmDelete = confirm('Bạn có muốn xóa phòng nhân viên này không')
  if (confirmDelete) {
    try {
      const res = await axios.delete(`http://localhost:4000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.data.success){
        alert('Xóa thành công!')
        // Cập nhật lại danh sách phòng ban sau khi xóa
        await fetchEmployees()
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa nhân viên!')
    }
  }
}

const filteredEmployees = computed(() =>
  employees.value.filter(emp =>
    emp.name.toLowerCase().includes(search.value.toLowerCase())
  )
);


onMounted(fetchEmployees)



</script>

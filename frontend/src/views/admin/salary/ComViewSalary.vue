<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="4" class="pa-6 rounded-lg">
          <div class="text-center mb-6">
            <v-icon size="36" color="primary">mdi-cash-multiple</v-icon>
            <h2 class="text-h5 font-weight-bold mt-2">Salary History</h2>
          </div>

          <v-text-field
            v-model="search"
            label="Search By Emp ID"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            @input="filterSalary"
            clearable
            class="mb-4"
          ></v-text-field>

          <v-table class="elevation-1 rounded-lg" v-if="filteredSalary.length">
            <thead>
              <tr class="bg-grey-lighten-3">
                <th class="text-left">STT</th>
                <th class="text-left">Mã nhân viên</th>
                <th class="text-left">Lương mặc định</th> <!-- Mức lương mặc định -->
                <th class="text-left">Lương cơ bản</th>
                <th class="text-left">Phụ cấp</th>
                <th class="text-left">Khấu trừ</th>
                <th class="text-left">Tổng lương</th>
                <th class="text-left">Ngày trả</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in filteredSalary"
                :key="item._id"
                :class="index % 2 === 0 ? 'bg-grey-lighten-5' : ''"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ item.employeeId.employeeId }}</td>
                <td>{{ formatCurrency(item.employeeId.salary) }}</td> <!-- Lương mặc định -->
                <td>{{ formatCurrency(item.basicSalary) }}</td>
                <td>{{ formatCurrency(item.allowances) }}</td>
                <td>{{ formatCurrency(item.deductions) }}</td>
                <td class="font-weight-bold text-success">{{ formatCurrency(item.netSalary) }}</td>
                <td>{{ new Date(item.payDate).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </v-table>

          <v-alert v-else type="info" class="mt-4" border="start" color="info" variant="tonal">
            Không có bản ghi lương nào.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const id = route.params.id
const salary = ref([])
const filteredSalary = ref([])
const search = ref('')

const fetchSalary = async () => {
  try {
    const res = await axios.get(`http://localhost:4000/api/salarys/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (res.data.success) {
      salary.value = res.data.salary
      filteredSalary.value = res.data.salary
    }
  } catch (err) {
    alert(err.response?.data?.message || err.message)
  }
}

const filterSalary = () => {
  filteredSalary.value = salary.value.filter((item) =>
    item.employeeId.employeeId.toLowerCase().includes(search.value.toLowerCase())
  )
}

const formatCurrency = (amount) => {
  if (amount == null) return '-'
  return amount.toLocaleString('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ₫'
}

onMounted(fetchSalary)
</script>

<style scoped>
th, td {
  padding: 12px;
}
</style>

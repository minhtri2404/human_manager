<template>
  <v-container class="mt-10">
    <v-card class="pa-6">
      <v-card-title class="text-h5 font-weight-bold">Add Salary</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-row dense>
            <!-- Department -->
            <v-col cols="12" md="6">
              <v-select
                label="Department"
                :items="departments"
                item-title="dep_name"
                item-value="_id"
                @update:modelValue="getEmployeesByDepartment"
                required
              ></v-select>
            </v-col>

            <!-- Employee -->
            <v-col cols="12" md="6">
              <v-select
                label="EmployeeID"
                v-model="salary.employeeId"
                :items="employees"
                item-title="employeeId"
                item-value="_id"
                required
              ></v-select>
            </v-col>

            <!-- Basic Salary -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Basic Salary"
                type="number"
                v-model.number="salary.basicSalary"
                required
              ></v-text-field>
            </v-col>

            <!-- Allowances -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Allowances"
                type="number"
                v-model.number="salary.allowances"
                required
              ></v-text-field>
            </v-col>

            <!-- Deductions -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Deductions"
                type="number"
                v-model.number="salary.deductions"
                required
              ></v-text-field>
            </v-col>

            <!-- Pay Date -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Pay Date"
                type="date"
                v-model="salary.payDate"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn type="submit" class="mt-4" color="teal-darken-2" block>
            Add Salary
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const salary = ref({
  employeeId: null,
  basicSalary: 0,
  allowances: 0,
  deductions: 0,
  payDate: null,
})

const departments = ref([])
const employees = ref([])


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
    alert(error?.response?.data?.error || 'Failed to fetch departments')
  }
}

const getEmployeesByDepartment = async (id) => {
    employees.value = []  // reset danh sách cũ
    salary.value.employeeId = null  // reset nhân viên đã chọn khi đổi department
    try {
        const res = await axios.get(`http://localhost:4000/api/employees/departments/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        })
        
        if (res.data.success) {
        employees.value = res.data.employees
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
        }
    }
}

const handleSubmit = async () => {
  try {
    const res = await axios.post('http://localhost:4000/api/salarys/add', salary.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (res.data.success) {
      router.push('/admin-dashboard/employee')
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error)
    }
  }
}

onMounted(() => {
  fetchDepartments()
})
</script>
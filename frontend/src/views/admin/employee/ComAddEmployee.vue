<template>
  <v-container class="max-w-4xl mx-auto mt-10 bg-white pa-8 rounded-md elevation-3">
    <h2 class="text-h5 d-flex justify-center font-weight-bold mb-6">Add Employee</h2>
    <v-form @submit.prevent="handleSubmit">
      <v-row dense>
        <!-- Name -->
        <v-col cols="12" md="6">
          <v-text-field label="Name" v-model="formData.name" name="name" required />
        </v-col>

        <!-- Email -->
        <v-col cols="12" md="6">
          <v-text-field label="Email" v-model="formData.email" name="email" type="email" required />
        </v-col>

        <!-- Employee ID -->
        <v-col cols="12" md="6">
          <v-text-field label="Employee ID" v-model="formData.employeeId" name="employeeId" required />
        </v-col>

        <!-- Date of Birth -->
        <v-col cols="12" md="6">
          <v-text-field label="Date of Birth" v-model="formData.dob" name="dob" type="date" required />
        </v-col>

        <!-- Gender -->
        <v-col cols="12" md="6">
          <v-select
            :items="['Male', 'Female', 'Other']"
            label="Gender"
            v-model="formData.gender"
            name="gender"
            required
          />
        </v-col>

        <!-- Phone -->
        <v-col cols="12" md="6">
          <v-text-field label="Phone" v-model="formData.phone" name="phone" type="tel" required />
        </v-col>

        <!-- Designation -->
        <v-col cols="12" md="6">
          <v-text-field label="Designation" v-model="formData.designation" name="designation" required />
        </v-col>

        <!-- Department -->
        <v-col cols="12" md="6">
          <v-select
            :items="departments"
            item-title="dep_name"
            item-value="_id"
            label="Department"
            v-model="formData.department"
            name="department"
            required
          />
        </v-col>

        <!-- Salary -->
        <v-col cols="12" md="6">
          <v-text-field label="Salary" v-model="formData.salary" name="salary" type="number" required />
        </v-col>

        <!-- Password -->
        <v-col cols="12" md="6">
          <v-text-field label="Password" v-model="formData.password" name="password" type="password" required />
        </v-col>

        <!-- Role -->
        <v-col cols="12" md="6">
          <v-select
            :items="['admin', 'employee']"
            label="Role"
            v-model="formData.role"
            name="role"
            required
          />
        </v-col>

        <!-- Image Upload -->
        <v-col cols="12" md="6">
          <v-file-input
            label="Upload Image"
            v-model="formData.image"
            accept="image/*"
            name="image"
            prepend-icon=""
            hide-details
          />
        </v-col>
      </v-row>

      <!-- Submit Button -->
      <v-btn type="submit" color="teal" class="mt-6" block> Add Employee </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const departments = ref([])

const formData = ref({
  name: '',
  email: '',
  employeeId: '',
  dob: '',
  gender: '',
  phone: '',
  designation: '',
  department: '',
  salary: '',
  password: '',
  role: '',
  image: null,
})

// Fetch department list
const fetchDepartments = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/departments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (response.data.success) {
      departments.value = response.data.departments
    }
  } catch (error) {
    alert(error?.response?.data?.error || 'Failed to fetch departments')
  }
}

// Submit handler
const handleSubmit = async () => {
  const data = new FormData()
  for (const key in formData.value) {
    data.append(key, formData.value[key])
  }
  try {
    const response = await axios.post('http://localhost:4000/api/employees/add', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (response.data.success) {
      router.push('/admin-dashboard/employee')
    }
  } catch (error) {
    alert(error?.response?.data?.error || 'Failed to add employee')
  }
}

onMounted(fetchDepartments)
</script>



<template>
  <v-container class="mt-10">
    <v-card class="pa-6">
      <v-card-title class="text-h5 text-center">Employee Details</v-card-title>
      <v-row class="mt-4" v-if="employee">
        <v-col cols="12" md="4">
          <v-img
            :src="`http://localhost:4000/uploads/${employee.userId.profileImage}`"
            class="rounded-circle"
            max-width="300"
            aspect-ratio="1"
            cover
          />
        </v-col>

        <v-col cols="12" md="8">
          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Name:</v-col>
            <v-col cols="8">{{ employee.userId.name }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Employee ID:</v-col>
            <v-col cols="8">{{ employee.employeeId }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Date of Birth:</v-col>
            <v-col cols="8">{{ formatDate(employee.dob) }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Gender:</v-col>
            <v-col cols="8">{{ employee.gender }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Department:</v-col>
            <v-col cols="8">{{ employee.department.dep_name }}</v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="4" class="font-weight-bold">Phone:</v-col>
            <v-col cols="8">{{ employee.phone }}</v-col>
          </v-row>
        </v-col>
      </v-row>

    <v-alert type="info" v-else>Loading employee data...</v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute() // để lấy id từ URL
const id = route.params.id
const employee = ref(null)

const fetchEmployee = async () => {
  try {
    const res = await axios.get(`http://localhost:4000/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (res.data.success) {
      employee.value = res.data.employee
    } 
  } catch (err) {
    alert(err.response?.data?.error || 'Error fetching employee')
  }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString()
}

onMounted(fetchEmployee)
</script>

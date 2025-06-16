<template>
  <v-container>
    <h3 class=" text-center text-h6 font-weight-bold">Dashboard Overview</h3>
    <v-row class="mt-4" dense>
      <v-col cols="12" md="4" v-for="(card, index) in overviewCards" :key="index">
        <ComSummaryCard v-bind="card" />
      </v-col>
    </v-row>

    
    <h4 class="text-center text-h6 mt-10">Leave Detail</h4>
    <v-row class="mt-4" dense>
      <v-col cols="12" md="3" v-for="(card, index) in leaveCards" :key="index">
        <ComSummaryCard v-bind="card" />
      </v-col>
    </v-row>

    <!-- Biểu đồ tổng quan -->
    <h4 class="text-center text-h6 mt-10">Chart Detail</h4>
    <v-row class="mt-4" dense>
      <v-col cols="12" md="8" class="mx-auto">
        <ComChart
          v-if="summaryReady"
          :chartValues="chartValues"
        />
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import ComSummaryCard from '@/components/ComSummaryCard.vue'
import ComChart from '@/components/ComChart.vue'

const overviewCards = ref([])
const leaveCards = ref([])
const chartValues = ref([0, 0, 0])
const summaryReady = ref(false)

// Hàm gọi API để lấy dữ liệu tổng quan
const fetchSummary = async () => {
  try {
    const res = await axios.get('http://localhost:4000/api/dashboards/summary', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = res.data
    // Gán dữ liệu động
    overviewCards.value = [
      { icon: 'mdi-account-group', text: 'Total Employee', number: data.totalEmployee, color: 'teal-darken-2' },
      { icon: 'mdi-domain', text: 'Total Department', number: data.totalDepartment, color: 'blue-darken-2' },
      { icon: 'mdi-currency-usd', text: 'Monthly Salary', number: `$${data.totalSalarys}`, color: 'red-darken-2' },
    ]

    leaveCards.value = [
      { icon: 'mdi-file-document-outline', text: 'Leave Applied', number: data.leaveSummary.appliedFor, color: 'teal-darken-2' },
      { icon: 'mdi-check-circle', text: 'Leave Approved', number: data.leaveSummary.approved, color: 'green-darken-2' },
      { icon: 'mdi-timer-sand', text: 'Leave Pending', number: data.leaveSummary.pending, color: 'yellow-darken-2' },
      { icon: 'mdi-close-circle', text: 'Leave Rejected', number: data.leaveSummary.rejected, color: 'red-darken-2' },
    ]

    // ✅ Cập nhật chartValues
    chartValues.value = [
      data.totalEmployee,
      data.totalDepartment,
      (data.totalSalarys / 100)
    ]
    summaryReady.value = true
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error)
    } else {
      alert("Failed to fetch summary")
    }
  }
}
onMounted(fetchSummary)
</script>

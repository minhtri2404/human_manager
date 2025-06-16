<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { defineProps } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

// Đăng ký chart
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Nhận props từ component cha
const props = defineProps({
  chartValues: {
    type: Array,
    required: true,
    default: () => [0, 0, 0]
  }
})

// Tạo chart data dựa trên props
const chartData = computed(() => ({
  labels: ['Employees', 'Departments', 'Salaries'],
  datasets: [
    {
      label: 'Summary Data',
      backgroundColor: ['#00897b', '#42a5f5', '#ef5350'],
      data: props.chartValues
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>

<style scoped>
div {
  height: 400px;
}
</style>

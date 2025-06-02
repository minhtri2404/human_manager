<template>
  <v-app>
    <ComSideBarEmp />
    <v-main class="ml-64 bg-grey-lighten-3">
      <ComNavBar />

      <!-- ✅ Chỉ hiển thị ComSummary khi đang ở trang Dashboard -->
      <ComSummaryEmp v-if="isDashboard" />

      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ComSideBarEmp from '@/views/employee/ComSideBarEmp.vue'
import ComNavBar from '@/components/ComNavBar.vue'
import ComSummaryEmp from '@/views/employee/ComSummaryEmp.vue'

const route = useRoute()

// ✅ Kiểm tra xem đang ở Dashboard hay không
const isDashboard = computed(() => route.path === '/employee-dashboard')
</script>

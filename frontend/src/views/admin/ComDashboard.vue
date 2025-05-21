<template>
  <v-app>
    <ComSideBar />
    <v-main class="ml-64 bg-grey-lighten-3">
      <ComNavBar />

      <!-- ✅ Chỉ hiển thị ComSummary khi đang ở trang Dashboard -->
      <ComSummary v-if="isDashboard" />

      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ComSideBar from '@/components/ComSidebar.vue'
import ComNavBar from '@/components/ComNavBar.vue'
import ComSummary from '@/components/ComSummary.vue'

const route = useRoute()

// ✅ Kiểm tra xem đang ở Dashboard hay không
const isDashboard = computed(() => route.path === '/admin-dashboard')
</script>

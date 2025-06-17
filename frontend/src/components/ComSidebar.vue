<template>
  <v-navigation-drawer permanent width="250" color="grey-darken-4">
    <v-sheet color="teal-darken-2" height="64" class="d-flex align-center justify-center">
      <h3 class="text-white text-h5 text-center">HMS</h3>
    </v-sheet>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        link
        :prepend-icon="item.icon"
        :exact="true" 
        exact-active-class="active-item" 
      >
        <v-list-item-title class="text-subtitle-1">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const items = [
  { title: "Dashboard", icon: "mdi-view-dashboard", to: "/admin-dashboard" },
  { title: "Employees", icon: "mdi-account-group", to: "/admin-dashboard/employee" },
  { title: "Departments", icon: "mdi-domain", to: "/admin-dashboard/department" },
  { title: "Leaves", icon: "mdi-calendar-month", to: "/admin-dashboard/leave" },
  { title: "Attendance", icon: "mdi-fingerprint", to: "/admin-dashboard/attendance" },
  { title: "Salarys", icon: "mdi-currency-usd", to: "/admin-dashboard/salary" },
  { title: "Settings", icon: "mdi-cog", to: "/admin-dashboard/setting" },
];
</script>

<style scoped>
.text-subtitle-1 {
  font-size: 16px !important;
  font-weight: 500;
}

.active-item {
  background-color: #004d40 !important; 
  color: #f5f1f1 !important;           
}

/* Thêm màu icon khi active */
.active-item .v-icon {
  color: #fcfffd !important;           
}

/* Tăng hiệu ứng khi hover (tùy chọn) */
.v-list-item:hover {
  background-color: #00695c !important;
  color: #08ef3a !important;
}
</style>
